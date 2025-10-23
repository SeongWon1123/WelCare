package com.example.welcare

import android.Manifest
import android.content.pm.PackageManager
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.material.floatingactionbutton.FloatingActionButton
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import java.io.File
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var btnRecord: FloatingActionButton
    private lateinit var tvStatus: TextView
    private lateinit var tvTranscript: TextView

    private var mediaRecorder: MediaRecorder? = null
    private var audioFile: File? = null
    private var isRecording = false

    private val client = OkHttpClient()
    private val SERVER_URL = "http://10.54.32.11:8000"

    // 자동 중지 관련
    private val silenceHandler = Handler(Looper.getMainLooper())
    private var silenceRunnable: Runnable? = null
    private val SILENCE_DELAY = 20000L // 20초 침묵 후 자동 중지

    companion object {
        private const val REQUEST_RECORD_AUDIO = 200
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btnRecord = findViewById(R.id.btnRecord)
        tvStatus = findViewById(R.id.tvStatus)
        tvTranscript = findViewById(R.id.tvTranscript)

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.RECORD_AUDIO), REQUEST_RECORD_AUDIO)
        }

        btnRecord.setOnClickListener {
            if (isRecording) {
                stopRecording()
            } else {
                startRecording()
            }
        }
    }

    private fun startRecording() {
        audioFile = File(externalCacheDir, "recording.m4a")

        mediaRecorder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            MediaRecorder(this)
        } else {
            MediaRecorder()
        }.apply {
            setAudioSource(MediaRecorder.AudioSource.MIC)
            setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
            setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
            setOutputFile(audioFile?.absolutePath)

            try {
                prepare()
                start()
                isRecording = true
                btnRecord.setImageDrawable(getDrawable(android.R.drawable.ic_media_pause))
                tvStatus.text = "녹음 중... (말이 끝나면 자동으로 중지됩니다)"

                // 자동 중지 시작
                startSilenceDetection()
            } catch (e: IOException) {
                Toast.makeText(this@MainActivity, "녹음 시작 실패", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun startSilenceDetection() {
        silenceRunnable = Runnable {
            if (isRecording) {
                stopRecording()
            }
        }
        silenceHandler.postDelayed(silenceRunnable!!, SILENCE_DELAY)
    }

    private fun stopRecording() {
        // 자동 중지 취소
        silenceRunnable?.let { silenceHandler.removeCallbacks(it) }

        mediaRecorder?.apply {
            stop()
            release()
        }
        mediaRecorder = null
        isRecording = false
        btnRecord.setImageDrawable(getDrawable(android.R.drawable.ic_btn_speak_now))
        tvStatus.text = "음성 처리 중..."

        audioFile?.let { sendAudioToSTT(it) }
    }

    private fun sendAudioToSTT(file: File) {
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.name,
                file.asRequestBody("audio/m4a".toMediaTypeOrNull()))
            .build()

        val request = Request.Builder()
            .url("$SERVER_URL/stt")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    tvStatus.text = "서버 연결 실패"
                    Toast.makeText(this@MainActivity, "에러: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                runOnUiThread {
                    if (response.isSuccessful && body != null) {
                        val json = JSONObject(body)
                        val text = json.getString("text")
                        tvTranscript.text = "당신: $text"
                        tvStatus.text = "AI 응답 생성 중..."
                        sendTextToChat(text)
                    } else {
                        tvStatus.text = "음성 인식 실패"
                    }
                }
            }
        })
    }

    private fun sendTextToChat(text: String) {
        val requestBody = FormBody.Builder()
            .add("prompt", text)
            .build()

        val request = Request.Builder()
            .url("$SERVER_URL/chat")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    tvStatus.text = "서버 연결 실패"
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                runOnUiThread {
                    if (response.isSuccessful && body != null) {
                        val json = JSONObject(body)
                        val answer = json.getString("answer")
                        tvTranscript.text = "${tvTranscript.text}\n\nAI: $answer"
                        tvStatus.text = "음성 생성 중..."
                        sendTextToTTS(answer)
                    } else {
                        tvStatus.text = "답변 생성 실패"
                    }
                }
            }
        })
    }

    private fun sendTextToTTS(text: String) {
        val requestBody = FormBody.Builder()
            .add("text", text)
            .build()

        val request = Request.Builder()
            .url("$SERVER_URL/tts")
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    tvStatus.text = "음성 생성 실패"
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val audioBytes = response.body?.bytes()
                    audioBytes?.let {
                        val audioFile = File(externalCacheDir, "response.mp3")
                        audioFile.writeBytes(it)

                        runOnUiThread {
                            playAudio(audioFile)
                            tvStatus.text = "재생 중..."
                        }
                    }
                }
            }
        })
    }

    private fun playAudio(file: File) {
        val mediaPlayer = MediaPlayer().apply {
            setDataSource(file.absolutePath)
            prepare()
            start()

            setOnCompletionListener {
                tvStatus.text = "대화 완료. 다시 녹음하세요."
                release()
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        silenceRunnable?.let { silenceHandler.removeCallbacks(it) }
    }
}