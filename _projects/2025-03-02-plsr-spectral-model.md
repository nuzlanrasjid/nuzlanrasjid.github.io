---
title: "Model PLSR untuk Prediksi Kadar Senyawa dari Data Spektral"
date: 2025-03-02
summary: "Membangun model Partial Least Squares Regression untuk memprediksi konsentrasi senyawa target dari data spektroskopi, lengkap dengan validasi silang."
tools: [Python, scikit-learn, PLSR, NumPy, matplotlib]
repo_url: "https://github.com/usernamekamu/nama-repo-plsr"
notebook_url: ""
log2fc: -1.4
neglogp: 2.9
---

## Ringkasan

Jelaskan konteks datanya: jenis data spektral (misalnya NIR, Raman), apa
yang diprediksi, dan kenapa PLSR jadi pilihan metode (cocok untuk data
dengan banyak variabel yang saling berkorelasi tinggi).

## Metode

1. Preprocessing sinyal (smoothing, normalisasi, derivative)
2. Split data train/test
3. Tentukan jumlah komponen optimal via cross-validation
4. Fit model PLSR

```python
from sklearn.cross_decomposition import PLSRegression
from sklearn.model_selection import cross_val_predict

pls = PLSRegression(n_components=n_opt)
y_pred_cv = cross_val_predict(pls, X_train, y_train, cv=10)
```

## Hasil

Tampilkan metrik performa (RMSE, R², RPD), dan plot predicted vs actual.

## Yang bisa dikembangkan lagi

Misalnya: bandingkan dengan model lain (Random Forest, SVR), atau uji
robustness terhadap noise instrumen.
