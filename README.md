# Portfolio Jekyll — Bioinformatics & ML

Starter portfolio berbasis Jekyll dengan hero berupa "volcano plot"
interaktif: tiap titik di plot mewakili satu project, dan meng-klik titik
akan scroll ke detail project itu.

## 1. Coba dulu di komputer sendiri (opsional tapi disarankan)

Butuh Ruby terpasang. Lalu di folder ini jalankan:

```bash
bundle install
bundle exec jekyll serve
```

Buka `http://localhost:4000` di browser. Setiap kali simpan perubahan file,
refresh browser untuk lihat hasilnya.

Kalau males install Ruby dulu, langsung saja lanjut ke langkah deploy di
bawah — GitHub yang akan build sitenya, kamu tidak wajib jalankan di lokal.

## 2. Ganti data pribadi kamu

- `_config.yml` — ganti `title`, `email`, `github_username`, `linkedin_url`
- `index.html` — bagian `<section class="about">`, ganti teks bio dan
  daftar skill (`.pill`)

## 3. Cara menambahkan project baru

Setiap project = satu file markdown baru di folder `_projects/`.

1. Copy salah satu file yang sudah ada, misalnya
   `_projects/2025-01-15-rnaseq-deseq2-liver.md`
2. Rename file, formatnya: `YYYY-MM-DD-judul-singkat.md`
3. Edit bagian atas file (di antara `---`), ini disebut *front matter*:

```yaml
---
title: "Judul Project Kamu"
date: 2025-08-26
summary: "Satu-dua kalimat ringkasan untuk kartu project."
tools: [Python, DESeq2, scikit-learn]
repo_url: "https://github.com/usernamekamu/nama-repo"
notebook_url: ""
log2fc: 2.0     # posisi horizontal di volcano plot hero (boleh negatif)
neglogp: 3.0    # posisi vertikal — makin tinggi makin "menonjol"
---
```

4. Tulis isi lengkap project-nya di bawah front matter, pakai Markdown biasa
   (bisa sisipkan kode, gambar, dll)
5. Simpan file, lalu commit & push ke GitHub

**Itu saja.** Project baru otomatis muncul di daftar dan di volcano plot —
kamu tidak perlu sentuh HTML/CSS sama sekali.

> Catatan soal `log2fc` dan `neglogp`: ini murni angka untuk mengatur posisi
> titik di plot (bukan hasil statistik sungguhan), jadi bebas kamu isi
> sesuai seberapa "menonjol" kamu anggap project itu. Kalau dihapus, posisi
> akan diacak otomatis.

## 4. Deploy ke GitHub Pages

**Opsi A — repo utama akun kamu (paling simpel, jadi `usernamekamu.github.io`)**

1. Buat repo baru di GitHub dengan nama persis: `usernamekamu.github.io`
2. Push seluruh isi folder ini ke repo tersebut:

```bash
git init
git add .
git commit -m "Portfolio pertama"
git branch -M main
git remote add origin https://github.com/usernamekamu/usernamekamu.github.io.git
git push -u origin main
```

3. Tunggu 1–2 menit, buka `https://usernamekamu.github.io`

**Opsi B — repo dengan nama bebas (jadi subpath, misal `usernamekamu.github.io/portfolio`)**

Sama seperti di atas, tapi nama repo bebas. Lalu di repo GitHub:
Settings → Pages → Source → pilih branch `main` → Save.
Tambahkan juga di `_config.yml`:

```yaml
baseurl: "/nama-repo-kamu"
```

## 5. Setiap update berikutnya

```bash
git add .
git commit -m "Tambah project baru: nama project"
git push
```

GitHub otomatis build ulang dan situs ter-update dalam 1–2 menit.
