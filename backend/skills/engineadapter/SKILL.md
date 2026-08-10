---
name: "EngineAdapterSkill — AI Video Engine Compiler & Architecture Adapter v1.0"
description: >
  Dynamically adapts and compiles final video prompts to target specific AI Video Generation Model Architectures
  (Kling 1.5/2.0, Sora, Seedance 2.0, Runway Gen-3 Alpha, Hailuo/Minimax). Maximizes prompt ingestion efficiency and prevents model-specific glitches.
---

# ⚙️ ENGINE-ADAPTER-SKILL V1.0: MODEL-SPECIFIC COMPILER

## PURPOSE
To tailor the final compiled prompt block specifically for the target **AI Video Engine Architecture**. Different models have unique text encoders, character truncation limits, and cut handling mechanisms.

---

## 🛠️ THE 5 MASTER ENGINE ADAPTER PROFILES

### 1. PROFIL: KLING 1.5 / 2.0 (Kinetic & Gravitational Master)
- **Karakteristik:** Sangat jago memproses fisika gerak, *camera track*, dan gravitasi. Sensitif terhadap penumpukan tag kaku.
- **Aturan Adapter:**
  - Utamakan deskripsi narasi murni di `[PROSE]`.
  - Suntikkan pengunci gravitasi: `"Grounded realism, 1.0x physical momentum, heavy gravity gait"`.
  - Format Kode: Pure backticks `` ``` `` tanpa tag kebocoran `text`.

### 2. PROFIL: SORA (T5-XXL Narrative & Subtext Master)
- **Karakteristik:** Memiliki T5-XXL text encoder raksasa yang sangat pintar memahami narasi puitis panjang, namun bisa berhalusinasi jika ada tag negatif.
- **Aturan Adapter:**
  - Gunakan **The Uncompressed Prompt Mandate (Rule 29)** secara maksimal (2.200+ karakter).
  - Gunakan **Affirmative Phrasing** (100% positif afirmatif, zero negative nouns).
  - Deskripsikan detail emosi mikro secara mendalam.

### 3. PROFIL: SEEDANCE 2.0 (Multi-Shot & Timestamp Cut Master)
- **Karakteristik:** Mesin generasi baru yang sangat handal memproses `[HARD CUT]` dan `Timestamp Cuts` dalam 1 prompt klip 10-15s.
- **Aturan Adapter:**
  - Aktifkan **The Action-Reaction Multi-Shot Architecture** (`[0s-3s]`, `[3s-7s]`, `[7s-10s]`).
  - Suntikkan tag pembersih memori setelah hard cut: `[SCENE RESET: ZERO ENVIRONMENT BLEED FROM PREVIOUS SHOT]`.

### 4. PROFIL: RUNWAY GEN-3 ALPHA (Optics & Anamorphic Master)
- **Karakteristik:** Sangat responsif terhadap jargon lensa optik (*f/1.4 Anamorphic, bokeh, shallow depth of field*).
- **Aturan Adapter:**
  - Awali prompt dengan `Global Style Tag` yang padat.
  - Suntikkan rincian lensa optik spesifik: `"Shot on 35mm f/1.4 Anamorphic prime lens, creamy background bokeh, sharp subject isolation"`.

### 5. PROFIL: HAILUO / MINIMAX / LUMA (Documentary & Short-Context Master)
- **Karakteristik:** Sangat kuat pada tekstur kulit manusia alami dan realisme dokumenter, namun memiliki batas karakter pendek (~200-500 karakter).
- **Aturan Adapter:**
  - **Short-Context Strip Mode (Cutoff Protection):** Wajib menghapus header braket struktural (`[SPATIAL DEPTH ENGINE]`, `[RENDER & ACTING LOCK]`, `[PHYSICS VECTORS]`) dan menaruh paragraf aksi utama `[PROSE]` di baris pertama agar aksi tidak terpotong (truncated) di bawah.
  - Gunakan frasa `cinéma vérité` dan `translucent epidermis, micro-pores`.
  - Kunci warna kulit: `100% natural consistent skin tone`.

---

## 🔄 DYNAMIC ADAPTER INJECTION MANDATE
Saat user menentukan target mesin (misal: "buat Kling", "buat Sora", atau "buat Hailuo"), EngineAdapterSkill secara otomatis mengompresi/mengkonfigurasi prompt ke format terpotong yang paling optimal untuk mesin tersebut!
