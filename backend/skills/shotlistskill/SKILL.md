---
name: "ShotListSkill — Automated Production Shot-List & Scene Matrix Engine v1.0"
description: >
  Automatically breaks down long-form film concepts or multi-scene scripts into structured,
  production-ready Shot-List Tables (Shot #, Duration, Angle, Lens, Framing, Subject Action, Audio, Asset Ref Tag).
---

# 📋 SHOTLIST-SKILL V1.0: AUTOMATED SHOT-LIST MATRIX ENGINE

## PURPOSE
To transform raw film ideas, outlines, or multi-minute scripts into a **Professional Production Shot-List Matrix** (Tabel Matriks Shot Produksi) before generating individual video prompts.

---

## 📊 SHOT-LIST MATRIX STRUCTURE (Tabel Matriks Shot)

Setiap kali pengguna meminta perancangan film multi-klip (1–5 menit / 6–30 Klip), ShotListSkill secara otomatis memuntahkan **Tabel Matriks Shot-List Produksi** berikut:

| Shot # | Time | Shot Type & Angle | Lens & Optics | Subject Action & Motion | Lighting & Environment | Audio & Dialogue Cue | Asset Tag |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | 0-10s | Master Wide Shot | 24mm Anamorphic | Establishing character entering room | Sodium Amber 2700K | Heavy rain on roof | `@image1`, `@image_env1` |
| **02** | 10-20s| Medium OTS Shot | 35mm Prime f/1.4 | Subject sits down, gripping cup | Tungsten & Teal Shadow | Dialogue: "Waktumu habis." | `@image1`, `@image5` |
| **03** | 20-30s| Macro Insert Shot | 100mm Macro Probe | Key turning inside brass lock | Single Directional Key | Mechanical click SFX | `@image_prop1` |
| **04** | 30-40s| Low-Angle OTS | 50mm Prime | Reaction shot of character B | High-Contrast Chiaroscuro | Whispers: "Ini belum selesai." | `@image2`, `@image5` |

---

## 📐 THE 6 SHOT COVERAGE LAWS (Aturan Sekuens Kamera)

1. **Rule of Varied Coverage:** DILARANG menggunakan ukuran shot yang sama persis dalam 2 klip berturut-turut (misal: Wide Shot lalu Wide Shot lagi). Variasikan: `Wide -> Medium OTS -> Macro Insert -> Low Angle Medium -> Reverse Wide`.
2. **The 3-Second Kinetic Beat:** Setiap shot 10 detik WAJIB memiliki minimal 3 ketukan aksi fisik/kamera.
3. **The King of Multi-Shot:** Jika ada 2+ karakter atau objek penting, berikan shot reaksi terpisah untuk masing-masing subjek.
4. **Chirality Continuity Tracking:** Catat koordinat posisi layar (`SCREEN-LEFT`, `SCREEN-RIGHT`) di setiap baris tabel.
5. **Asset Tag Mapping:** Cantumkan tag referensi (`@image1`, `@image_env1`, `@image_prop1`) di kolom terakhir untuk memudahkan pementasan.
