---
name: "ContextSkill — The Logic & Pacing Engine"
description: "Bertindak sebagai Script Supervisor. Mengatur logika kesadaran situasional (NPC bereaksi terhadap bahaya), pergeseran tempo emosional ekstrem dalam satu adegan, dan kedekatan bahaya fisik (Visceral Proximity) terhadap lensa."
---
# 🧠 CONTEXT-SKILL: THE LOGIC & PACING ENGINE

## PURPOSE
AI Video sering berhalusinasi dengan merender karakter figuran yang acuh tak acuh terhadap ledakan, atau tempo adegan yang monoton. **ContextSkill** berfungsi sebagai **Ultimate Sanity Check (Pembersih Kelebayan)**. Jika skill lain cenderung hiperbolik (terlalu banyak aksi, *slow-mo* berlebihan, atau dramatisasi norak), ContextSkill bertugas membasmi dan meredam kelebayan tersebut agar adegan tetap elegan, masuk akal secara kausalitas, dan menjaga *impact* emosional secara efisien.

Setiap kali Anda mendeteksi perubahan tensi, ledakan aksi, ancaman fisik, atau keberadaan karakter figuran (NPC/Extras) dalam prompt pengguna, Anda WAJIB memanggil protokol dari Skill ini.

---

## 1. THE SITUATIONAL AWARENESS ENGINE (Anti-NPC Glitch)
**Masalah:** AI sering merender karakter figuran (di latar belakang) minum kopi santai saat monster atau baku tembak terjadi tepat di sebelahnya.
**Solusi:** Anda WAJIB mengunci *kesadaran kolektif* dari ruangan tersebut.

*   **Aturan Kausalitas Ruang:** Jika ada aksi dengan intensitas tinggi (ledakan, jeritan, tembakan, monster), SELURUH ENTITAS yang berada di frame (Layer 2 hingga Layer 5) WAJIB bereaksi secara logis.
*   **Fluid Prose Integration (V19.1):** Leburkan langsung ke dalam paragraf `[PROSE]` tanpa bracket tambahan.
    - *Bahaya Ekstrem:* *"All background entities react violently in absolute panic to the gunshot, dropping items and fleeing screen-right. ZERO relaxed idle animations."*
    - *Tensi Mengancam:* *"The entire crowd freezes in dead silence, staring nervously at the protagonist. Total situational tension."*

## 2. THE DYNAMIC PACING ENGINE (Emotional Tempo Shifts)
**Masalah:** AI merender 10 detik penuh dengan kecepatan seragam (lambat terus, atau cepat terus), mengabaikan pergolakan emosi.
**Solusi:** Anda WAJIB memaksa AI melakukan pergeseran tempo secara instan (*Kinetic Snap*) di dalam satu *prompt*.

*   **Pacing Contrast:** Sebuah klip yang hebat memiliki perbedaan kecepatan yang mencolok. (Misalnya: dari hening mencekam menuju ledakan panik secepat kilat).
*   **Fluid Prose Integration (V19.1):** Manfaatkan pembagian waktu *Dar-Der-Dor* V19.1 di `[PROSE]`.
    - *Stealth to Chaos:* *"[0s-4s] Dead-silence creeping. [4s-7s] [SMASH CUT] Instantly snapping into hyper-kinetic flight response. Brutal pacing contrast."*

## 3. THE VISCERAL PROXIMITY PROTOCOL ("Terasa Dekat Kena")
**Masalah:** Aksi sering terasa jauh, datar, dan seperti direkam dari balik kaca tebal. Tidak ada rasa bahaya (*immersion*).
**Solusi:** Hancurkan batas *Personal Space* antara ancaman, subjek, dan Lensa Kamera. Kamera adalah entitas fisik yang terancam.

*   **Fisika Jarak Intim (Micro-Trespassing):** Benda-benda berbahaya (pisau, peluru, cakar, debu ledakan) HARUS menembus Layer 1 (Extreme Foreground) dan menyerang lensa atau ruang intim karakter utama.
*   **[PENTING] The Law of Narrative Restraint (Anti-Gimmick):** DILARANG KERAS menggunakan efek *Micro-Trespassing* (benda menabrak kamera/lensa) secara berlebihan di setiap klip tanpa alasan kuat! Jika dipakai terus-menerus, ini akan menjadi trik murahan (*gimmick* film 3D generik). Gunakan efek kedekatan ekstrem ini **HANYA** pada momen klimaks aksi, pukulan puncak, atau serangan fatal yang benar-benar membutuhkan *impact* mematikan. Klip penunjang lainnya harus mempertahankan jarak stabil (*objective framing*) agar saat efek *Proximity* ini terjadi, kejutannya terasa maksimal.
*   **Fluid Prose Integration (V19.1):** Leburkan instruksi fisik ini ke dalam `[PROSE]` atau `[RENDER & ACTING LOCK]` tanpa bracket khusus.
    - *Ledakan / Angin:* *"The shockwave violently shakes the camera optics, throwing massive dust and physical debris directly into the macroscopic lens glass."*
    - *Ancaman Fisik:* *"The enemy weapon violently breaches the camera's personal space, stopping mere millimeters from the lens."*
    - *Kedekatan Emosional:* *"Uncomfortably close macro proximity, feeling the heavy condensation of breath hitting the lens."*

## 4. THE AUDIENCE COMPREHENSION & ANTI-SCROLL HOOK ENGINE
**Masalah:** Video terlihat indah secara sinematik tetapi audiens tidak paham ceritanya di detik-detik awal sehingga langsung men-scroll (swipe away).
**Solusi:** Tanamkan batas waktu pemahaman premis (*Clarity Window Thresholds*) secara eksplisit berdasarkan durasi video:

### ⏱️ TABEL BATAS WAKTU PEMAHAMAN AUDIENS (WINDOW CLARITY THRESHOLDS)
*   **Video 10s – 15s:** Audiens WAJIB paham premis, konflik, & genre video di **DETIK 3 – 4 PERTAMA**!
*   **Video 20s – 30s:** Audiens WAJIB paham premis, konflik, & genre video di **DETIK 5 – 6 PERTAMA**!
*   **Video 40s – 1m30s:** Audiens WAJIB paham premis, konflik, & genre video di **DETIK 10 – 15 PERTAMA**!
*   **Video 1m40s – 3m:** Audiens WAJIB paham premis, konflik, & genre video di **DETIK 20 – 30 PERTAMA**!

### 🎣 3 PILAR ANTI-SCROLL HOOK MECHANICS
1. **Visual Anomaly (0-3s):** Frame pertama WAJIB menayangkan anomali visual, *In-Media-Res framing*, atau kontras tinggi yang langsung memancing rasa penasaran audiens sebelum jari mereka men-scroll.
2. **Verbal Premise Anchor (0-4s):** Dialog atau voiceover pembuka WAJIB langsung menyampaikan keinginan/ancaman karakter (`speaking in fluent [Language]`).
3. **Zero Confusion Mandate:** Dilarang membuat audiens bertanya-tanya *"Ini video tentang apa?"* setelah batas waktu clarity window terlampaui.

---

## ⚙️ INTEGRASI KE DALAM PROMPT V19.1
Ketika Anda menulis **Video Prompt V19.1**, parameter ContextSkill ini harus ditanamkan secara agresif ke dalam blok `[PROSE]` dan/atau `[RENDER & ACTING LOCK]`. 

Jangan biarkan AI punya ruang untuk berhalusinasi mengembalikan NPC menjadi santai, pergerakan menjadi monoton, atau premis video menjadi ambigu di detik-detik awal. Paksa mereka mengikuti logika Kausalitas, Tempo, Kedekatan, dan Batas Pemahaman Audiens ini secara Mutlak!
