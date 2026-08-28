---
title: "Differential Gene Expression Analysis with DESeq2 (Drosophila pasilla dataset)"
date: 2026-08-28
summary: "Built a DESeq2 differential expression pipeline in R to identify genes affected by pasilla knockdown in Drosophila melanogaster, from raw counts to an annotated volcano plot."
tools: [R, DESeq2, pheatmap, ggplot2, RNA-seq]
repo_url: "https://github.com/nuzlanrasjid/REPLACE-WITH-REPO-NAME"
log2fc: 1
neglogp: 1.3
---

## Overview

RNA-seq differential expression analysis is one of the most common
entry points into transcriptomics: given raw read counts across
samples, identify which genes change significantly between conditions.
This project runs a full DESeq2 workflow end-to-end — from count
matrix and sample metadata to a filtered gene list and a set of
diagnostic and results visualizations — on a two-condition experiment
with an additional library-type covariate.

The dataset used is the public **pasilla** dataset (Brooks et al.,
2011), RNA-seq of *Drosophila melanogaster* S2-DRSC cells with and
without knockdown of the splicing factor *pasilla*, available via
[GEO accession GSE18508](https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE18508).
Samples were sequenced as a mix of single-end and paired-end libraries
(7 samples: 4 untreated, 3 treated).

## Methods

**1. Data preparation.** Loaded the count matrix and sample metadata
into R, verified that sample names in the metadata matched the count
matrix columns (and were in the same order), and set `Treatment` and
`Sequencing` as factors.

**2. Model design.** Built a `DESeqDataSet` with design
`~ Sequencing + Treatment`, treating library type as a blocking
covariate so it doesn't confound the treatment effect of interest.
Set `untreated` as the reference level.

```r
dds <- DESeqDataSetFromMatrix(countData = count_data,
                               colData = coldata,
                               design = ~ Sequencing + Treatment)
dds$Treatment <- factor(dds$Treatment, levels = c("untreated", "treated"))
```

**3. Filtering and testing.** Removed genes with very low total counts,
then ran `DESeq()` and extracted results at FDR (padj) < 0.05. Final
significant gene list was defined as padj < 0.05 and
|log2FoldChange| > 1.

**4. Effect size shrinkage.** Applied `apeglm` shrinkage to the log2
fold changes to reduce noise from low-count genes before plotting.

```r
resLFC <- lfcShrink(dds, coef = "Treatment_treated_vs_untreated", type = "apeglm")
```

**5. Evaluation.** For each candidate gene, evaluated significance
using adjusted p-value (padj < 0.05) together with effect size
(|log2FoldChange| > 1), rather than p-value alone, to avoid flagging
genes with a statistically significant but biologically negligible
change.

## Results

![PCA plot of samples by treatment and sequencing type](/assets/dge-file/PCA%20Plot.png)
![Sample-to-sample distance heatmap](/assets/dge-file/Sample%20Distance%20Heatmap.png)
![Heatmap of top 10 differentially expressed genes with sample annotation](/assets/dge-file/Top%2010%20Genes%20Heatmap.png)
![MA plot before shrinkage](/assets/dge-file/MA%20Plot%20Before%20Shrinkage.png)
![MA plot after apeglm shrinkage](/assets/dge-file/MA%20Plot%20After%20Shrinkage.png)
![Volcano plot of differentially expressed genes](/assets/dge-file/Volcano%20Plot.png)
