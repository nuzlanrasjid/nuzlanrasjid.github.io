---
title: "Klasifikasi Subtipe Penyakit dari Data Ekspresi Gen"
date: 2025-05-20
summary: "Model machine learning untuk mengklasifikasikan subtipe penyakit berdasarkan profil ekspresi gen, dengan feature selection dan evaluasi model yang ketat."
tools: [Python, scikit-learn, XGBoost, pandas, SHAP]
repo_url: "https://github.com/usernamekamu/nama-repo-classifier"
notebook_url: ""
log2fc: 3.0
neglogp: 4.1
---

## Ringkasan

Jelaskan dataset (jumlah sampel, jumlah fitur/gen, jumlah kelas), dan
kenapa masalah ini penting secara klinis atau biologis.

## Metode

1. Feature selection (misal: variance threshold, differential expression
   sebagai filter awal)
2. Split data dengan stratifikasi kelas
3. Training beberapa model (Logistic Regression, Random Forest, XGBoost)
4. Interpretasi model dengan SHAP values

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
```

## Hasil

Laporkan metrik (accuracy, F1, AUC per kelas) dan gen/fitur mana yang
paling berkontribusi menurut SHAP.

## Yang bisa dikembangkan lagi

Misalnya: validasi pada dataset eksternal, atau deployment sebagai API
sederhana.
