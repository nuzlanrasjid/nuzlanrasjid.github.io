---
title: "Predicting Soil Moisture & Temperature from Hyperspectral Data (PLSR)"
date: 2025-08-27
summary: "Built PLSR models in R to predict soil moisture and temperature from hyperspectral reflectance data, comparing raw spectra against SNV-preprocessed spectra."
tools: [R, PLSR, prospectr, pls, Hyperspectral Data]
repo_url: "https://github.com/nuzlanrasjid/plsr-hyperspectral-data-analysis"
log2fc: 1.8
neglogp: 3.1
---

## Overview

Soil moisture and temperature are two key variables in precision
agriculture and environmental monitoring, but measuring them directly
across large areas is expensive and slow. This project tests whether
hyperspectral reflectance data (454–950 nm) can be used to predict
both variables using Partial Least Squares Regression (PLSR).

The dataset used in this project was sourced from [Kaggle](https://www.kaggle.com/datasets/binaryjoker/hyperspectral-benchmark-dataset-on-soil-moisture).

## Methods

**1. Data preparation.** Loaded the hyperspectral dataset in R, checked
the distribution of both target variables (soil moisture and soil
temperature) with histograms, boxplots, and a Shapiro-Wilk normality
test. The test used here as a supporting diagnostic, not a strict modeling 
requirement, because PLSR does not assume normality of the response variable.


**2. Spectral filtering.** Selected only the valid spectral bands, in this case,
using between 454–950 nm from the dataset as predictors.

**3. Preprocessing comparison.** Built two versions of the data: raw
spectra, and spectra after Standard Normal Variate (SNV) correction,
to see whether preprocessing improved prediction accuracy.

```r
library(prospectr)

X_snv <- standardNormalVariate(as.matrix(X))
```

**4. Model selection.** Choose the optimal number of components for
each model based on the lowest adjusted CV error (RMSECV), checked
across a range of components rather than a single fixed value.

```r
library(pls)

# PLSR model with cross-validation
model_y1 <- plsr(Target ~ Spectra,
                  data = ds_y1,
                  scale = TRUE,
                  validation = "CV")
```

**5. Evaluation.** For each final model, calculated R² (cross-validated),
RMSECV, and RPD (Residual Prediction Deviation) as the main performance
metrics.


## Results
![Before SNV Analysis](/assets/plsr-file/Before%20SNV%20Analysis.png)

![After SNV Analysis](/assets/plsr-file/After%20SNV%20Analysis.png)

![Measured vs predicted soil moisture](/assets/plsr-file/Measured%20vs%20Predicted%20soil%20moisture.png)

![Measured vs predicted soil temperature](/assets/plsr-file/Measured%20vs%20Predicted%20soil%20temperature.png)

![PLSR regression coefficients soil moisture across the spectrum](/assets/plsr-file/PLSR%20regression%20-%20Soil%20Moisture.png)
![PLSR regression coefficients soil temperature across the spectrum](/assets/plsr-file/PLSR%20regression%20-%20Soil%20temperature.png)
