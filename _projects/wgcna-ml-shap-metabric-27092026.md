---
title: "ML Classification & SHAP Biomarker Screening on WGCNA Gene Modules (METABRIC)"
date: 2026-09-27
summary: "Trained XGBoost, Random Forest, and SVM classifiers on gene modules from a prior WGCNA analysis to predict PAM50 breast cancer subtype, then used SHAP to screen for candidate biomarkers with cross-model, directional, and stability checks."
tools: [Python, XGBoost, Random Forest, SVM, SHAP, scikit-learn]
repo_url: "https://github.com/nuzlanrasjid/wgcna-ml-analysis"
log2fc: 2.4
neglogp: 2.1
---

## Overview

This project extends a prior WGCNA (Weighted Gene Co-expression Network
Analysis) on the METABRIC breast cancer dataset into a supervised
classification task. Genes from the significant co-expression modules
identified by WGCNA, combined with a small set of clinical traits, are
used as input features to predict PAM50 molecular subtype (Basal, LumA,
LumB, Her2, Normal) with three independent classifiers. SHAP
(SHapley Additive exPlanations) is then used not just to explain the
models, but to screen the important genes for candidate biomarkers,
using cross-model agreement, directionality, and resampling stability
as filters — rather than treating a single high SHAP score as
sufficient evidence on its own.

The dataset used is the same public **METABRIC** breast cancer dataset
as the [WGCNA analysis](https://github.com/nuzlanrasjid/wgcna-analysis-metabric) this project
builds on (available via [Kaggle](https://www.kaggle.com/datasets/raghadalharbi/breast-cancer-gene-expression-profiles-metabric)), using the gene modules and clinical traits identified there as input.

## Methods

**1. Feature selection and validation.** Restricted gene features to
those assigned to the significant WGCNA modules (`blue`, `turquoise`,
`brown`, `yellow`), and added five clinical traits (age at diagnosis,
tumor size, tumor stage, lymph nodes examined positive, Nottingham
Prognostic Index). Gene and trait names were validated against the raw
dataset's columns, including a case-insensitive fallback check, to
confirm no features were silently dropped due to naming mismatches.

```python
chosen_gene = [gen for gen in all_module_genes if gen in df.columns]
unmatched_genes = [gen for gen in all_module_genes if gen not in df.columns]
```

**2. Leakage control.** Excluded features that directly define the
prediction target (e.g. ER/HER2/PR receptor status) from the model
inputs, since these would trivially leak the PAM50 subtype label
rather than provide genuine predictive signal.

**3. Model training.** Trained three independent classifiers — XGBoost,
Random Forest, and SVM (RBF kernel) — on an 80/20 stratified
train-test split, with features standardized for SVM.

```python
xgb_model = XGBClassifier(objective="multi:softprob", num_class=len(le.classes_),
                           n_estimators=300, max_depth=4, learning_rate=0.05)
```

**4. SHAP interpretability.** Computed SHAP values per model —
`TreeExplainer` for XGBoost and Random Forest, `KernelExplainer` for
SVM, validating the resulting array shape against `(n_samples,
n_features, n_classes)` before plotting, since multiclass SHAP output
can otherwise be misread as feature-interaction values by some
plotting calls.

**5. Cross-model biomarker candidate ranking.** For a given PAM50
class, ranked each gene's mean(|SHAP value|) separately per model,
then averaged ranks (not raw SHAP values, which are not on a
comparable scale across explainer types) across all three models to
find genes that are *consistently* important rather than a top scorer
in only one model.

```python
rank_table["avg_rank"] = rank_table[["xgb_rank", "rf_rank", "svm_rank"]].mean(axis=1)
```

**6. Directional and stability checks.** For the top cross-model
candidates, generated a SHAP beeswarm plot restricted to that class to
confirm whether high or low expression consistently pushes predictions
in one direction (rather than a mixed, uninterpretable pattern), and
repeated the train-test split across 5 random seeds to confirm the
same candidates reappear in the top 10 rather than being an artifact
of one particular split.

## Results

![Accuracy comparison across XGBoost, Random Forest, and SVM for PAM50 subtype classification](/assets/wgcna-ml-analysis/perbandingan_akurasi_model.png)
All three models reached comparable accuracy on the 5-class PAM50
classification task (XGBoost ≈ 0.77, Random Forest ≈ 0.80, SVM ≈
0.80).
![Directional SHAP check for the top cross-model candidate genes on the Basal subtype](/assets/PASTE-PROJECT-SLUG-HERE/shap_directional_xgb_Basal.png)

For the Basal subtype, `egfr` and `gata3` emerged as the
strongest biomarker candidates: both ranked consistently high across
all three models (by rank agreement rather than raw SHAP magnitude),
showed a clean, single-direction relationship in the SHAP beeswarm
plot — low GATA3 and high EGFR expression both pushing predictions
toward Basal — and remained in the top 10 across all 5 resampled
train-test splits. Both directions are consistent with established
Basal-like breast cancer biology, where GATA3 (a luminal-lineage
marker) is characteristically low and EGFR is characteristically
overexpressed. Full per-model SHAP plots, the cross-model rank
agreement table, and the stability check results are available in the
linked repository.
