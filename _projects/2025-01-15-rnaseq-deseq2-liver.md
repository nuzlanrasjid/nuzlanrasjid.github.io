---
title: "Analisis Differential Expression RNA-seq pada Jaringan Hati"
date: 2025-01-15
summary: "Pipeline RNA-seq dari raw counts hingga daftar gen signifikan menggunakan DESeq2, termasuk visualisasi volcano plot dan enrichment analysis."
tools: [Python, R, DESeq2, Bioconductor, pandas]
repo_url: "https://github.com/usernamekamu/nama-repo-deseq2"
notebook_url: ""
log2fc: 2.1
neglogp: 3.4
---

## Ringkasan

Jelaskan di sini konteks datanya: dari mana data RNA-seq berasal (misalnya
GEO/SRA), berapa jumlah sampel per kelompok, dan pertanyaan biologis yang
ingin dijawab.

## Metode

1. QC raw reads dengan FastQC
2. Alignment / quantifikasi (contoh: Salmon, STAR)
3. Import ke R, jalankan `DESeq2`
4. Filter gen dengan `padj < 0.05` dan `|log2FoldChange| > 1`

```r
dds <- DESeqDataSetFromMatrix(countData = counts,
                               colData = coldata,
                               design = ~ condition)
dds <- DESeq(dds)
res <- results(dds)
```

## Hasil

Tulis temuan utama: berapa gen yang signifikan naik/turun, pathway apa yang
muncul dari enrichment analysis, dan gambar volcano plot atau heatmap kalau
ada.

## Yang bisa dikembangkan lagi

Catat keterbatasan atau langkah lanjutan (misal: validasi qPCR, integrasi
dengan data proteomik, dsb).
