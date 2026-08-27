---
title: "PLSR Model for Predicting Compound Concentration from Spectral Data"
date: 2025-03-02
summary: "Built a Partial Least Squares Regression model to predict target compound concentration from spectroscopy data, with full cross-validation."
tools: [Python, scikit-learn, PLSR, NumPy, matplotlib]
repo_url: "https://github.com/usernamekamu/nama-repo-plsr"
notebook_url: ""
log2fc: -1.4
neglogp: 2.9
---

## Overview

Describe the context: the type of spectral data (e.g. NIR, Raman), what
is being predicted, and why PLSR was chosen (well-suited for data with
many highly correlated variables).

## Methods

1. Signal preprocessing (smoothing, normalization, derivatives)
2. Train/test split
3. Determine the optimal number of components via cross-validation
4. Fit the PLSR model

```python
from sklearn.cross_decomposition import PLSRegression
from sklearn.model_selection import cross_val_predict

pls = PLSRegression(n_components=n_opt)
y_pred_cv = cross_val_predict(pls, X_train, y_train, cv=10)
```

## Results

Report performance metrics (RMSE, R², RPD) and a predicted-vs-actual
plot.

## Next steps

For example: compare against other models (Random Forest, SVR), or test
robustness against instrument noise.
