# GALUR — Design Direction & Brand Soul

> **"Garis Alur, Ngajentrekeun Struktur"**
> Parabot digital visualisasi alur, proses kerja teknis, dan perancangan sistem berbasis kearifan Tatar Pasundan & standar diagramming profesional.

---

## 1. Identitas & Karakter Brand

- **Nama Produk:** GALUR
- **Makna Filosofis:** Dalam bahasa Sunda, *Galur* bermakna alur yang tertata rapi, runut, kronologis, dan jernih. Membantu manusia mengurai kerumitan gagasan menjadi struktur visual yang gamblang (*ngajentrekeun*).
- **Maskot & Lambang:** **Macan Tutul Jawa** (*Panthera pardus melas*), fauna endemik dan identitas resmi Jawa Barat. Melambangkan kelincahan berpikir (*agility*), ketajaman analisis (*precision*), ketenangan, serta kepedulian pelestarian alam Pasundan.
- **Ekosistem:** **Bangkit Beruang Ecosystem** — Studio perangkat lunak independen yang mengutamakan ketelitian pengerjaan (*craftsmanship*), integritas data, dan kegunaan nyata.

---

## 2. Palet Warna (The Pasundan Palette)

| Peran | Hex | Keterangan & Filosofi |
| :--- | :--- | :--- |
| **Primary Base (Brand Dark)** | `#0b4632` | Hijau Hutan Lindung Tatar Sunda. Stabil, sejuk, berakar pada alam. |
| **Deep Contrast (Obsidian)** | `#072419` | Hijau pekat malam untuk bilah footer dan kontras tinggi. |
| **Accent (Gold / Amber)** | `#f59e0b` / `#ea9932` | Kuning emas & jingga hangat corak Macan Tutul Jawa. Menandai aksi utama. |
| **Surface Light (Paper Canvas)** | `#eff4f0` / `#f8fafc` | Putih kertas bernuansa alam untuk kenyamanan visual sesi kerja panjang. |
| **Text Primary (Slate Dark)** | `#0f172a` / `#1e293b` | Teks hitam-arang dengan kontras tajam (WCAG AAA). |
| **Technical Accent** | `#2563eb` | Biru diagram teknis untuk relasi logika & konektor data. |

---

## 3. Tipografi

- **UI Sans:** `Plus Jakarta Sans`, `Inter`, atau system sans-serif modern.
  - Karakter: Bersih, geometris seimbang, keterbacaan tinggi pada ukuran teks kecil (10px–13px label diagram).
- **Technical Mono:** `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`.
  - Digunakan untuk: Koordinat kanvas, dimensi kertas (A4, 210 × 297 mm), nama berkas, dan payload data.

---

## 4. Parameter Dials (Antislop Alignment)

- **ENERGY: 2 (Focused Studio Craft)**
  - Tampilan berjiwa studio arsitektur/desain. Bukan website marketing AI yang bising dengan partikel melayang, namun bukan pula kekosongan steril tanpa identitas.
- **RHYTHM: 2 (Structured Hierarchy)**
  - Ritme layout mengikuti kebutuhan fungsional pengguna: orientasi identitas -> preview kanvas interaktif -> pilar filosofi -> kapabilitas spesialis -> ruang kerja diagram.
- **MOTION: 1 (Purposeful & Calm)**
  - Animasi hanya berjalan berdasarkan interaksi pengguna (hover mikro, transisi pembukaan modal, perpindahan tab).
  - Dilarang keras memakai loop abadi (`animate-pulse`, `animate-bounce`) pada elemen status statis.

---

## 5. Batasan & Standar Kualitas (Dose Caps)

1. **Glassmorphism:** Maksimal 1–2 elemen struktural (Navbar transparan dan modal overlay). Seluruh kartu kanvas dan panel inspeksi wajib menggunakan warna solid untuk menjaga ketegasan batas (*crisp borders*).
2. **Border Radius:**
   - Kontrol/Tombol: `rounded-xl` (10px–12px).
   - Kartu & Wadah: `rounded-2xl` (16px) hingga `rounded-3xl` (24px) untuk modul utama.
   - Pill (`rounded-full`): Hanya untuk badge status ringkas atau avatar bulat. Dilarang mengubah semua tombol menjadi pill.
3. **Elevasi & Bayangan:**
   - Permukaan kerja (kanvas & panel) menempel datar (*grounded plane*) dengan border `border-slate-200/80`.
   - Bayangan hanya digunakan pada modal popup dan lembar kertas kanvas untuk menandai tumpukan z-index.
4. **Indikator Status Jujur:**
   - Titik status (koneksi kolaborasi, penyimpanan) ditampilkan solid tanpa efek *pulsing* berulang yang mengalihkan fokus pengguna.
