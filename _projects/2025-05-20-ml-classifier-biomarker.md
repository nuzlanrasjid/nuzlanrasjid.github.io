---
title: "Classifying Disease Subtypes from Gene Expression Data"
date: 2025-05-20
summary: "A machine learning model to classify disease subtypes based on gene expression profiles, with rigorous feature selection and evaluation."
tools: [Python, scikit-learn, XGBoost, pandas, SHAP]
repo_url: "https://github.com/usernamekamu/nama-repo-classifier"
notebook_url: ""
log2fc: 3.0
neglogp: 4.1
---

## Overview

Describe the dataset (number of samples, number of features/genes,
number of classes), and why this problem matters clinically or
biologically.

## Methods

1. Feature selection (e.g. variance threshold, differential expression
   as an initial filter)
2. Stratified train/test split by class
3. Train several models (Logistic Regression, Random Forest, XGBoost)
4. Interpret the model with SHAP values

```python
import shap

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
```

## Results

Report metrics (accuracy, F1, per-class AUC) and which genes/features
contributed most according to SHAP.

## Next steps

For example: validation on an external dataset, or deployment as a
simple API.
