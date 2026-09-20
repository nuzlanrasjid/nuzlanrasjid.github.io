---
title: "Differential Gene Expression Analysis with DESeq2 (<em>Drosophila melanogaster</em> dataset)"
date: 2026-08-28
summary: "Built a DESeq2 differential expression pipeline in R to identify genes affected by pasilla knockdown in Drosophila melanogaster, from raw counts to an annotated volcano plot."
tools: [R, DESeq2, pheatmap, ggplot2, RNA-seq]
repo_url: "https://github.com/nuzlanrasjid/dge-analysis-deseq2"
log2fc: 4
neglogp: 1.3
---

## Overview

RNA-seq differential expression analysis is one of the most common
entry points into transcriptomics: given raw read counts across
samples, identify which genes change significantly between conditions.
This project runs a DESeq2 workflow from count matrix and sample metadata
to a filtered gene list and a set of diagnostic and results visualizations 
on a two-condition experiment with an additional library-type covariate.

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
`Sequencing` as factors, which was important to define them as categorical
variables for the DGE analysis.

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
using adjusted p-value (padj < 0.05) with effect size
(|log2FoldChange| > 1), rather than p-value alone, to avoid labeling
genes with a statistically significant but biologically negligible
change.

**6. Functional enrichment (GO and KEGG).** Over-representation analysis
was run with `clusterProfiler` and `org.Dm.eg.db`, separately for up- and
down-regulated genes, with all genes tested by DESeq2 as the background.
Unlike the volcano plot and DEG table (padj < 0.05 and |log2FC| > 1;
[n_deg] genes), enrichment used all genes with padj < 0.05
([n_up] up, [n_down] down). The fold-change cutoff highlights clearly
changed genes, but enrichment tests need enough genes to keep statistical
power, and padj already controls the false discovery rate. Terms with
adjusted p < 0.05 were considered significant, and redundant GO terms were
reduced with `simplify`. KEGG was queried on [date]. Results are
exploratory and do not show causal mechanisms.

```r
ego_up <- enrichGO(gene = up_genes, universe = universe, OrgDb = org.Dm.eg.db,
                   keyType = "FLYBASE", ont = "BP",
                   pvalueCutoff = 0.05, qvalueCutoff = 0.05, readable = TRUE)
```

## Results
![PCA plot of samples by treatment and sequencing type](/assets/dge_analysis/PCA%20plot.png)
This plot illustrates the QC step, highlighting that the samples are separated into clearly distinct groups
![Sample-to-sample distance heatmap](/assets/dge_analysis/heatmap%20treatment.png)
![Heatmap of top 10 differentially expressed genes with sample annotation](/assets/dge_analysis/heatmap%20with%20annotation.png)
The highest expressed gene is FBgn0026562, as indicated by the orange-to-red color spectrum.
![Volcano plot of differentially expressed genes](/assets/dge_analysis/Volcano%20Plot.png)
The plot differentiates between the two groups of genes (i.e., upregulated and downregulated) based on the set thresholds.
![cnetplot gene-concept network](assets/dge_analysis/Gene-Concept%20Network.png)
The figure depicts 15 GO terms divided into two distinct groups. The first group is associated with cell junctions and
the epithelial barrier, while the other is related to carbohydrate/energy metabolism (at the bottom). Both groups are linked
by a single shared gene, namely *Cht2*.
![dotplot side-by-side](/assets/dge_analysis/dotplot%20side-by-side.png)
The plot in the upregulated section shows genes related to cellular structural and tissue development 
functions. In contrast, the downregulated section shows genes related to the immune system.
