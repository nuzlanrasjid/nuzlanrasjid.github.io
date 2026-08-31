---
title: "Gene Co-expression Network Analysis (WGCNA) on Breast Cancer Transcriptomic Data"
date: 2026-09-01
summary: "Built a WGCNA gene co-expression network pipeline in R to identify modules of co-expressed genes in breast cancer transcriptomic data and link them to clinical traits including PAM50 subtype."
tools: [R, WGCNA, dplyr, fastDummies]
repo_url: "https://github.com/nuzlanrasjid/"
log2fc: 2
neglogp: 1.8
---

## Overview

Weighted Gene Co-expression Network Analysis (WGCNA) is a widely used
approach for finding structure in high-dimensional expression data:
rather than testing genes one at a time, it groups genes with similar
expression patterns into "modules" and relates each module — as a
single summary profile — to sample-level traits. This project runs a
full WGCNA workflow end-to-end — from a raw expression table to
detected gene modules and a module–trait correlation heatmap — on a
large clinical cohort with multiple trait types (continuous and
categorical).

The dataset used is the public **METABRIC** breast cancer dataset
(available via [Kaggle](https://www.kaggle.com/datasets/raghadalharbi/breast-cancer-gene-expression-profiles-metabric)),
containing mRNA expression z-scores for 489 genes across 1,904
patients, alongside clinical annotations such as PAM50 molecular
subtype, tumor size, and tumor stage.

## Methods

**1. Data preparation.** Loaded the raw METABRIC table into R and
programmatically separated it into three column groups — clinical
annotations, somatic mutation flags, and gene expression values —
based on naming pattern and data type. Built a sample × gene
expression matrix and a matching sample × trait matrix, and verified
that both were aligned to the same sample order.

```r
cols_mutation <- names(df)[grepl("_mut$", names(df))]
is_numeric_col <- sapply(df, is.numeric)
cols_gene <- setdiff(names(df)[is_numeric_col], c(cols_clinical, cols_mutation))
```

**2. Data quality check.** Ran `goodSamplesGenes()` to flag genes or
samples with excessive missing values before network construction,
which is a required step in the standard WGCNA workflow.

**3. Network construction and module detection.** Used
`pickSoftThreshold()` to select the soft-thresholding power that best
approximates a scale-free topology (R² ≈ 0.9), then built the
weighted co-expression network and detected gene modules with
`blockwiseModules()`, based on average-linkage hierarchical
clustering of the topological overlap matrix (TOM).

```r
net <- blockwiseModules(df_expr, power = soft_power,
                         TOMType = "unsigned", minModuleSize = 15,
                         mergeCutHeight = 0.25, numericLabels = TRUE)
```

**4. Module summarization.** Computed a module eigengene for each
detected module with `moduleEigengenes()` — the first principal
component of each module's expression profile — condensing dozens of
genes per module into a single representative value per sample.

**5. Module–trait relationships and evaluation.** Correlated module
eigengenes against clinical traits using Pearson correlation and
Student's p-value (`corPvalueStudent()`). Continuous traits (tumor
size, tumor stage) were used directly; PAM50 subtype — a nominal,
unordered category — was one-hot encoded rather than integer-encoded,
to avoid implying a false ranking between subtypes. Identifier and
batch-like numeric columns (`patient_id`, `cohort`) and the
near-constant `cancer_type` variable (1,903 of 1,904 samples in a
single category) were excluded from correlation, as neither carries
a meaningful biological signal to test against.

```r
trait_categorical <- dummy_cols(df_clinical["pam50_subtype"],
                                 select_columns = "pam50_subtype",
                                 remove_selected_columns = TRUE)
moduleTraitCor <- cor(MEs, traits_combined, use = "pairwise.complete.obs")
```

## Results

![Cluster dendrogram with detected gene modules](/assets/wgcna_metabric/dendrogram_modul.png)

![Module-trait relationship heatmap across tumor size, tumor stage, and PAM50 subtype](/assets/wgcna_metabric/module_trait_relationship.png)

The network resolved into **6 distinct gene modules** (plus one
unassigned/grey module) at the selected soft-thresholding power.
Module–trait correlations revealed biologically plausible patterns —
notably, the *blue* and *turquoise* modules show opposing correlation
trends across PAM50 subtypes (Basal vs. Luminal A), consistent with
known transcriptomic differences between these breast cancer
subtypes. Full correlation coefficients, p-values, and per-module
gene lists are available in the linked repository.
