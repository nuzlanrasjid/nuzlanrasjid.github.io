---
title: "Predicting Soil Moisture & Temperature from Hyperspectral Data (PLSR)"
date: 2025-08-27
summary: "Built PLSR models in R to predict soil moisture and temperature from hyperspectral reflectance data, comparing raw spectra against SNV-preprocessed spectra."
tools: [R, PLSR, prospectr, pls, Hyperspectral Data]
repo_url: ""
notebook_url: ""
---

## Overview

Soil moisture and temperature are two key variables in precision
agriculture and environmental monitoring, but measuring them directly
across large areas is expensive and slow. This project tests whether
hyperspectral reflectance data (454–950 nm) can be used to predict
both variables using Partial Least Squares Regression (PLSR).

The dataset used in this project was sourced from [Kaggle](https://www.kaggle.com/datasets/binaryjoker/hyperspectral-benchmark-dataset-on-soil-moisture).

## Methods
**1. Load Libraries.** Loaded the libraries that will be utilized in this
analysis

```r
library(prospectr)
library(pls)
library(prospectr)
library(pls)
library(stats)
library(openxlsx)
```

**2. Data preparation.** Loaded the hyperspectral dataset in R, checked (optional)
the distribution of both target variables (soil moisture and soil
temperature) with histograms, boxplots, and a Shapiro-Wilk normality
test.

```r
# Read data
ds <- read.csv("soilmoisture_dataset.csv", check.names = FALSE)

# Load Y-axes
y1 <- ds$soil_moisture
y2 <- ds$soil_temperature
y1_dens_score <- density(y1)
y2_dens_score <- density(y2)

# Normality test visual histogram 
hist(y1, freq = FALSE, col = "blue", density = c (85), 
     main = "Soil Moisture Distribution") 
hist(y2, freq = FALSE, col = "green", density = c (85), 
     main = "Soil Temperature Distribution")

# normality test visual-histogram
polygon(y1_dens_score, border = "black") 
polygon(y2_dens_score, border = "black") 

# normality test visual-boxplot
boxplot(y1, main = "Soil Moisture Distribution")
boxplot(y2, main = "Soil Temperature Distribution")

# Shapiro-Wilk test used here as a supporting diagnostic, not a strict modeling requirement,
# since PLSR does not assume normality of the response variable.
shapiro.test(y1) 
shapiro.test(y2)
```

**2. Spectral filtering.** Selected only the valid spectral bands
between 454–950 nm from the dataset as predictors.

```r
# Exclude the first column (index column)
X <- ds[, -1]

# Extract column names to identify which columns represent the spectra
cols <- colnames(X)

# Coerce column names to numeric to isolate genuine spectral bands
spektrum <- suppressWarnings(as.numeric(cols))

# Retain only columns that resolve to valid numeric wavelengths
X <- X[, !is.na(spektrum)]
spektrum <- spektrum[!is.na(spektrum)]  # keep wavelength vector in sync with X

# Restrict analysis to the relevant spectral range (454–950 nm),
# where the reflectance signal for soil properties is expected
X <- X[, spektrum >= 454 & spektrum <= 950]
X <- as.matrix(X)
```

**3. Preprocessing comparison.** Built two versions of the data: raw
spectra, and spectra after Standard Normal Variate (SNV) correction,
to see whether preprocessing improved prediction accuracy.

```r
# SNV preprocessing
X_snv <- standardNormalVariate(as.matrix(X))

# Visual comparison: raw vs. SNV-corrected spectra
matplot(spektrum[spektrum >= 454 & spektrum <= 950],
        t(X), type = "l", main = "Before SNV Correction")
matplot(spektrum[spektrum >= 454 & spektrum <= 950],
        t(X_snv), type = "l", main = "After SNV Correction")
```

**4. Model selection.** Chose the optimal number of components for
each model based on the lowest adjusted CV error (RMSECV), checked
across a range of components rather than a single fixed value.

```r
# Assemble model-ready datasets
# Raw spectra datasets
ds_y1 <- data.frame(Target = y1, Spectra = I(X))
ds_y2 <- data.frame(Target = y2, Spectra = I(X))

# SNV-preprocessed datasets, for direct performance comparison
ds_y1_snv <- data.frame(Target = y1, Spectra = I(X_snv))
ds_y2_snv <- data.frame(Target = y2, Spectra = I(X_snv))


### 7. Fit PLSR models with cross-validation
# Baseline models (raw spectra)
model_y1 <- plsr(Target ~ Spectra,
                  data = ds_y1,
                  scale = TRUE,
                  validation = "CV")
model_y2 <- plsr(Target ~ Spectra,
                  data = ds_y2,
                  scale = TRUE,
                  validation = "CV")

# SNV-preprocessed models, to test whether preprocessing improves accuracy
model_y1_snv <- plsr(Target ~ Spectra,
                      data = ds_y1_snv,
                      scale = TRUE,
                      validation = "CV")
model_y2_snv <- plsr(Target ~ Spectra,
                      data = ds_y2_snv,
                      scale = TRUE,
                      validation = "CV")

# Running PLSR models with cross-validation
# Baseline models (raw spectra)
model_y1 <- plsr(Target ~ Spectra,
                  data = ds_y1,
                  scale = TRUE,
                  validation = "CV")
summary(model_y1)

model_y2 <- plsr(Target ~ Spectra,
                  data = ds_y2,
                  scale = TRUE,
                  validation = "CV")
summary(model_y2)

# SNV-preprocessed models, to test whether preprocessing improves accuracy
model_y1_snv <- plsr(Target ~ Spectra,
                      data = ds_y1_snv,
                      scale = TRUE,
                      validation = "CV")
summary(model_y1_snv)

model_y2_snv <- plsr(Target ~ Spectra,
                      data = ds_y2_snv,
                      scale = TRUE,
                      validation = "CV")
summary(model_y2_snv)
```

**5. Evaluation.** For each final model, calculated R² (cross-validated),
RMSECV, and RPD (Residual Prediction Deviation) as the main performance
metrics.

```r
# Determine optimal number of latent components
validationplot(model_y1, val.type = "RMSEP", main = "PLSR Soil Moisture")

# Model evaluation across a range of components
# Model y1 — scan candidate component counts to confirm the optimal choice
for (i in 8:12) {
  pred_cv_y1 <- model_y1$validation$pred[, 1, i]     # cross-validated predictions
  R2_cv_y1 <- cor(y1, pred_cv_y1)^2                   # cross-validated R²
  rmsecv_val_y1 <- RMSEP(model_y1,
                          estimate = "CV")$val[1, 1, i + 1]
  cat("ncomp =", i,
      "| R2 CV =", round(R2_cv_y1, 3),
      "| RMSECV =", round(rmsecv_val_y1, 3),
      "\n")
}

# Model y2 — same evaluation procedure
for (i in 5:10) {
  pred_cv_y2 <- model_y2$validation$pred[, 1, i]
  R2_cv_y2 <- cor(y2, pred_cv_y2)^2
  rmsecv_val_y2 <- RMSEP(model_y2,
                          estimate = "CV")$val[1, 1, i + 1]
  cat("ncomp =", i,
      "| R2 CV =", round(R2_cv_y2, 3),
      "| RMSECV =", round(rmsecv_val_y2, 3),
      "\n")
}

# Final measured vs. predicted plot — Model y1
n_opt_y1 <- 9
plot(y1,
     model_y1$validation$pred[, 1, n_opt_y1],  # cross-validated prediction at optimal ncomp
     main = paste("Measured vs Predicted (ncomp =", n_opt_y1, ")"),
     xlab = "Measured Soil Moisture",
     ylab = "Predicted Soil Moisture",
     pch = 19,
     col = "darkblue")
abline(0, 1, col = "red", lwd = 2)  # 1:1 reference line for perfect prediction

# Final measured vs. predicted plot — Model y2
n_opt_y2 <- 9
plot(y2,
     model_y2$validation$pred[, 1, n_opt_y2],
     main = paste("Measured vs Predicted (ncomp =", n_opt_y2, ")"),
     xlab = "Measured Soil Temperature",
     ylab = "Predicted Temperature",
     pch = 19,
     col = "darkgreen")
abline(0, 1, col = "brown", lwd = 2)

# --- Performance metrics: Model Y1 (Soil Moisture) ---
pred_y1 <- model_y1$validation$pred[, 1, n_opt_y1]
R2_y1 <- cor(y1, pred_y1)^2
RMSECV_y1 <- RMSEP(model_y1, estimate = "CV")$val[1, 1, n_opt_y1 + 1]
RPD_y1 <- sd(y1) / RMSECV_y1  # RPD > 2 generally indicates good predictive capability

cat("=== Model Y1 (Soil Moisture) ===\n")
cat("R2 (CV) =", round(R2_y1, 3), "\n")
cat("RMSECV =", round(RMSECV_y1, 3), "\n")
cat("RPD =", round(RPD_y1, 3), "\n\n")

# --- Performance metrics: Model Y2 (Soil Temperature) ---
pred_y2 <- model_y2$validation$pred[, 1, n_opt_y2]
R2_y2 <- cor(y2, pred_y2)^2
RMSECV_y2 <- RMSEP(model_y2, estimate = "CV")$val[1, 1, n_opt_y2 + 1]
RPD_y2 <- sd(y2) / RMSECV_y2

cat("=== Model Y2 (Soil Temperature) ===\n")
cat("R2 (CV) =", round(R2_y2, 3), "\n")
cat("RMSECV =", round(RMSECV_y2, 3), "\n")
cat("RPD =", round(RPD_y2, 3), "\n\n")

# Regression coefficient analysis
# Examining which spectral drive each model helps connect the
# statistical result back to underlying physical/biological interpretation

# Model y1 — Soil Moisture
coef_pls_y1 <- coef(model_y1, ncomp = n_opt_y1)

plot(spektrum,
     coef_pls_y1[, 1, 1],
     type = "l",
     lwd = 2,
     col = "darkblue",
     main = "PLSR Regression Coefficient - Soil Moisture",
     xlab = "Wavelength (nm)",
     ylab = "Coefficient")
abline(h = 0, col = "black", lty = 2)  # zero reference line

# Model y2 — Soil Temperature
coef_pls_y2 <- coef(model_y2, ncomp = n_opt_y2)

plot(spektrum,
     coef_pls_y2[, 1, 1],
     type = "l",
     lwd = 2,
     col = "darkgreen",
     main = "PLSR Regression Coefficient - Soil Temperature",
     xlab = "Wavelength (nm)",
     ylab = "Coefficient")
abline(h = 0, col = "black", lty = 2)
```
**5. Export.** For the results will be exported into Excel file.

```r
# Export results to a structured Excel workbook
wb <- createWorkbook()

# Sheet 1 — Predicted vs. actual values, for external validation/reporting
pred_df <- data.frame(
  Actual_SoilMoisture = y1,
  Predicted_SoilMoisture = pred_y1,
  Actual_SoilTemp = y2,
  Predicted_SoilTemp = pred_y2
)
addWorksheet(wb, "Prediction")
writeData(wb, "Prediction", pred_df)

# Sheet 2 — Summary performance metrics for both models
metrics_df <- data.frame(
  Model = c("Soil_Moisture", "Soil_Temperature"),
  ncomp = c(n_opt_y1, n_opt_y2),
  R2_CV = c(R2_y1, R2_y2),
  RMSECV = c(RMSECV_y1, RMSECV_y2),
  RPD = c(RPD_y1, RPD_y2)
)
addWorksheet(wb, "Metrics")
writeData(wb, "Metrics", metrics_df)

# Sheet 3 — Regression coefficients across the spectrum, for interpretability
coef_df <- data.frame(
  Wavelength = spektrum,
  Coefficient_SoilMoisture = coef_pls_y1[, 1, 1],
  Coefficient_SoilTemp = coef_pls_y2[, 1, 1]
)
addWorksheet(wb, "Regression_Coefficient")
writeData(wb, "Regression_Coefficient", coef_df)

# Save final workbook
saveWorkbook(wb, "PLSR_SoilMoisture_Temperature_Result.xlsx", overwrite = TRUE)
cat("Excel export completed\n")
```

## Results
![Before SNV Analysis](assets/plsr-file/Before%20SNV%20Analysis.png)

![After SNV Analysis](/assets/plsr-file/After%20SNV%20Analysis.png)

![Measured vs predicted soil moisture](/assets/plsr-file/Measured%20vs%20Predicted%20soil%20moisture.png)

![Measured vs predicted soil temperature](/assets/plsr-file/Measured%20vs%20Predicted%20soil%20temperature.png)

![PLSR regression coefficients soil moisture across the spectrum](/assets/plsr-file/PLSR%20regression%20-%20Soil%20Moisture.png)

![PLSR regression coefficients across the spectrum](/assets/plsr-file/PLSR%20regression%20-%20Soil%20temperature.png)
