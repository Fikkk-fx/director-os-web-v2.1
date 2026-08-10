---
name: PhoneticSkill — The Indonesian Phonetic & Dialogue Anchor Engine
description: Pustaka fonetik dan jangkar pelafalan Bahasa Indonesia (terutama pembedaan 'e' biasa/taling [e]/[ɛ], 'e' pepet [ə], dan 'eu' Sunda [ɤ]). Mencegah mesin AI Speech/Video (ElevenLabs, Sora, Kling, Seedance) salah mengucapkan kata-kata Indonesia (seperti 'cebok' diucapkan 'ceubok'). Menyediakan respelling fonetis, aturan KBBI, dan injeksi phonetic anchor otomatis untuk naskah dan prompt audio/video.
---

# 🗣️ PHONETIC-SKILL: THE INDONESIAN PHONETIC & DIALOGUE ANCHOR ENGINE
**Versi:** 1.0 (Indonesian Phonetic Purity & Anti-'EU' Glitch Protocol)  
**Ruang Lingkup:** Pelafalan Vokal Bahasa Indonesia, Fonetik Dialek Nusantara, Respelling AI Speech (ElevenLabs/Sora/Kling), Penyelaras Ejaan E Biasa vs E Pepet vs EU Sunda.

---

## 🛑 HUKUM MUTLAK ANTI-'EU' GLITCH (THE INDONESIAN 'E' MATRIX)

Mesin AI Speech dan Lip-Sync Video sering mengalami *glitch* pelafalan ketika membaca teks Bahasa Indonesia yang mengandung huruf **'e'**. AI sering secara keliru menganggap vokal 'e' sebagai vokal **'eu'** Sunda (misal: kata *"cebok"* diucapkan *"ceubok"*, *"bebek"* diucapkan *"beubeuk"*, atau *"tempe"* diucapkan *"teumpeu"*).

**PhoneticSkill** bertindak sebagai benteng pertahanan fonetik untuk memastikan 100% ketepatan pelafalan vokal Bahasa Indonesia.

---

## 📐 FASE 1: THE INDONESIAN 'E' CLASSIFICATION MATRIX

Huruf **'e'** dalam Bahasa Indonesia dan Dialek Nusantara terbagi menjadi 3 Kelas Fonetik Utama:

### 1. KELAS E-TALING / E-BIASA (`é` / `è`) — [e] & [ɛ]
* **Cara Pengucapan:** Bibir melebar, suara jelas dan terbuka seperti kata bahasa Inggris *"bed"*, *"red"*, atau *"pet"*.
* **Contoh Kata Kunci:**
  - *cebok* [cè-bok] -> **BUKAN** *ceubok*!
  - *bebek* [bè-bèk] -> **BUKAN** *beubeuk*!
  - *tempe* [tèm-pè] -> **BUKAN** *teumpeu*!
  - *besok* [bè-sok] -> **BUKAN** *beusok*!
  - *leher* [lè-hèr] -> **BUKAN** *leuheur*!
  - *peta, meja, sate, sore, cabe, kera, ember, nenek, kecap, kere*.
* **Phonetic Anchor Injection for AI:**  
  `[PHONETIC LOCK: Standard Indonesian 'e' taling as in 'bed' /cɛbok/, ZERO Sundanese 'eu' accent]`

### 2. KELAS E-PEPET (`ê`) — [ə] (Schwa)
* **Cara Pengucapan:** Vokal lemah/samu dari dada, bibir rileks, seperti kata bahasa Inggris *"about"*, *"sofa"*, atau *"the"*.
* **Contoh Kata Kunci:**
  - *kerja* [kər-ja]
  - *terbang* [tər-bang]
  - *sekarang* [sə-ka-rang]
  - *besar, kecil, tembus, depan, telur, benci, senang, beli, sendiri*.
* **Phonetic Anchor Injection for AI:**  
  `[PHONETIC LOCK: Unstressed schwa 'e' as in 'about' /kərja/, natural Indonesian neutral tone]`

### 3. KELAS EU-SUNDA (`eu`) — [ɤ] / [ɯ] (KHUSUS DIALEK SUNDA)
* **Cara Pengucapan:** Vokal belakang tertutup, bibir tidak membundar. HANYA digunakan jika naskah secara eksplisit berlokasi di Jawa Barat / Sunda atau menggunakan kata bahasa Sunda murni.
* **Contoh Kata Kunci Sunda Murni:**
  - *geulis* [gɤ-lis] (cantik)
  - *beureum* [bɤ-rɤm] (merah)
  - *euweuh* [ɤ-wɤh] (tidak ada)
  - *seubeuh* [sɤ-bɤh] (kenyot/kenyang)
  - *heueuh, keur, leuheung, geura*.
* **Aturan Keras:** DILARANG KERAS menyuntikkan bunyi `eu` ini pada kata-kata Bahasa Indonesia baku!

---

## 🔍 FASE 2: EXTERNAL REFERENCE & MINING ENGINE (EKSPLORASI FONETIK)

Jika ada kata baru, kata serapan, atau kata daerah yang ambigu dalam naskah, **PhoneticSkill** akan secara otomatis menjalankan 3 Aturan Mining Referensi Luar:

1. **Pola Ejaan KBBI (Kamus Besar Bahasa Indonesia):**
   - Menelusuri penanda fonetik KBBI: `é` (taling) vs `ê` (pepet).
   - Kata bertanda `é` wajib diikat dengan jangkar respelling `[e]` (contoh: *méja*, *bébas*, *cébok*).
2. **Pola Asal Serapan (Etymology Anchor):**
   - Kata serapan Jawa/Sunda yang sudah diserap ke Bahasa Indonesia baku (seperti *cebok, kecele, membludak, kere, beken*) WAJIB dikembalikan ke fonetik Indonesia baku ('e' biasa/taling), BUKAN dialek daerah asalnya.
3. **Phonetic Respelling for ElevenLabs / Text-to-Speech:**
   - Menyediakan format ejaan alternatif (phonetic spelling) jika AI Voice masih kebingungan membaca kata standar:
     - *cebok* -> ditulis di prompt audio sebagai `cheh-bok` atau `chay-bok` (mencegah dibaca *cheu-bok*).
     - *tempe* -> ditulis sebagai `tem-pay` atau `tem-peh`.
     - *bebek* -> ditulis sebagai `beh-bek`.

---

## 🎛️ FASE 3: AUTOMATIC PHONETIC INJECTION IN DIRECTOR OS

Ketika **PhoneticSkill** aktif di Director OS, setiap kali ada dialog Bahasa Indonesia di dalam blok `[PROSE]` atau naskah audio (ElevenLabs / AudioSkill), sistem akan otomatis menyuntikkan **Phonetic Anchor Tag**:

### 1. Injeksi Pada Prompt Video (Director OS V19.1)
```text
[PROSE]: [0s-3s] Wife yells in rage, speaking fluent native Indonesian [standard 'e' taling pronunciation in 'cebok' /cɛbok/, ZERO Sundanese 'eu' accent]: "Jawab aku Mas! Kamu boker gak cebok lagi kan?!"
```

### 2. Injeksi Pada Prompt Audio (AudioSkill / ElevenLabs)
```text
[AUDIO PROMPT - ELEVENLABS]:
Voice Actor: Indonesian Male/Female (Native Jakarta/Standard)
Dialogue: "Jawab aku Mas! Kamu boker gak cebok lagi kan?!"
Phonetic Guide: "cebok" pronounced as /cheh-bok/ (standard Indonesian 'e' as in 'bed', do NOT pronounce as 'cheu-bok'). High emotional distress, raw authentic Indonesian accent.
```

---

## 📋 SUMMARY CHEAT-SHEET: KATA POPULER YANG SERING SALAH AI

| Kata Asli | Salah AI (Glitched) | Benar (Phonetic Anchor) | Kelas Fonetik |
| :--- | :--- | :--- | :--- |
| **cebok** | *ceubok* | `cheh-bok` / `cè-bok` | E-Taling (Biasa) |
| **besok** | *beusok* | `beh-sok` / `bè-sok` | E-Taling (Biasa) |
| **bebek** | *beubeuk* | `beh-bek` / `bè-bèk` | E-Taling (Biasa) |
| **leher** | *leuheur* | `leh-her` / `lè-hèr` | E-Taling (Biasa) |
| **tempe** | *teumpeu* | `tem-peh` / `tèm-pè` | E-Taling (Biasa) |
| **cabe** | *cha-beu* | `chah-beh` / `ca-bè` | E-Taling (Biasa) |
| **kerja** | *keurja* | `ker-jah` / `kər-ja` | E-Pepet (Schwa) |
| **sekarang** | *seukarang* | `se-kah-rang` / `sə-ka-rang` | E-Pepet (Schwa) |

---
**ATURAN MUTLAK PHONETIC-SKILL:**  
Selalu kunci pelafalan kata Bahasa Indonesia bernada 'e' biasa dengan tag `[standard 'e' as in 'bed', ZERO 'eu']` untuk menjamin AI Voice & Lip-Sync Video 100% otentik dan bebas *glitch* aksen daerah tak diundang!
