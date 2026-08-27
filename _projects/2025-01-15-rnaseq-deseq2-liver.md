---
title: "Differential Expression Analysis of RNA-seq Data in Liver Tissue"
date: 2025-01-15
summary: "An RNA-seq pipeline from raw counts to a list of significant genes using DESeq2, including volcano plot visualization and enrichment analysis."
tools: [Python, R, DESeq2, Bioconductor, pandas]
repo_url: "https://github.com/usernamekamu/nama-repo-deseq2"
notebook_url: ""
log2fc: 2.1
neglogp: 3.4
---

## Overview

Describe the context here: where the RNA-seq data came from (e.g.
GEO/SRA), how many samples per group, and the biological question you
wanted to answer.

## Methods

1. QC raw reads with FastQC
2. Alignment / quantification (e.g. Salmon, STAR)
3. Import into R, run `DESeq2`
4. Filter genes with `padj < 0.05` and `|log2FoldChange| > 1`

```r
dds <- DESeqDataSetFromMatrix(countData = counts,
                               colData = coldata,
                               design = ~ condition)
dds <- DESeq(dds)
res <- results(dds)
```

## Results

Summarize the key findings: how many genes were significantly up/down,
which pathways emerged from the enrichment analysis, and include the
volcano plot or heatmap if you have one.

## Next steps

Note any limitations or follow-up work (e.g. qPCR validation,
integration with proteomics data, etc.).
