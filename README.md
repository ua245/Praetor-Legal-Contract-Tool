![Banner](docs/images/praetor_legal_banner.png)

# Praetor ⚖️
**Autonomous redlining for scanned contracts (signatures, handwriting, annotations included).**

> **Status: Work in Progress (WIP).**  
> Praetor is actively being built and optimized. Expect breaking changes, incomplete features, and shifting architecture as we iterate on multi-modal RAG + VLM inference.

---

## Overview
**Praetor** processes raw *visual* contract scans (including messy scans, signatures, handwritten notes, margin annotations) and produces **clause-aware redlines** automatically. The goal is to replace clunky legacy legal tech with a fast, highly reactive UI that feels “instant” for real-world contract review.

We’re using this phase (hackathon/rapid iteration cycle) to:
- Optimize **multi-modal Retrieval-Augmented Generation (RAG)**
- Reduce **Vision-Language Model (VLM)** inference latency
- Enable **data-center scaling** so redlining is interactive rather than batch-only

---

## What Praetor Does
- Ingests scanned PDFs/images of contracts
- Extracts visual + textual context (including handwriting/signature regions)
- Retrieves relevant clause examples and policy guidance (multi-modal RAG)
- Drafts suggested edits (“redlines”) with clause citations and rationale
- Targets a **reactive front-end** experience (near real-time feedback)

---

## Why This Matters
Most legal tooling breaks down when documents aren’t pristine text PDFs. Praetor is built for **real inputs**:
- low-quality scans
- mixed layouts
- stamps, handwritten edits, initials
- multi-page, multi-section contracts

---

## Core Tech Stack
### Languages
- **Python**

### Libraries
- **vLLM** (LLM inference serving / throughput optimization)
- **OpenCV** (document vision, preprocessing, region handling)
- **LangChain** (RAG orchestration)

### Frameworks / Models
- **LLaVA** (vision-language extraction & grounding)
- **Hugging Face** ecosystem (models, tokenizers, datasets, fine-tuning)

### Algorithmic Motifs
- **Transformer blocks**
- **Semantic search** (retrieval for clause grounding + consistency)

---

## Data
### Dataset
- **Contract Understanding Atticus Dataset (CUAD)**

### Pipeline (High Level)
1. **Vision extraction** from scanned pages (layout + regions + visual cues)
2. **Multi-modal retrieval** to find relevant clause patterns and context
3. **Fine-tuned LLM drafting** to propose edits/redlines
4. **Structured output** for UI rendering (diffs, clause references, rationale)

---

## Current Performance & Known Limitations (WIP)
- **100-page scanned PDFs can instantly exceed local VRAM limits** (crashes on consumer GPUs).
- **Vision-language processing is too latent** for real-time UI interaction on local workstations.
- We likely need:
  - better batching + streaming
  - quantization and/or speculative decoding
  - multi-GPU or server-backed inference (data center scaling)
  - smarter page/region triage (don’t VLM every pixel of every page)

---

## Roadmap (Foreseeable Future)
### Near-term
- [ ] Robust PDF ingestion (page streaming; fail-safe for massive docs)
- [ ] Preprocessing improvements (deskew, denoise, contrast, region proposals)
- [ ] Chunking strategy: page → section → clause
- [ ] Multi-modal RAG: retrieval that references both text and visual cues
- [ ] Output schema for redlines (JSON diff format + citations)

### Performance / Scaling
- [ ] vLLM serving with batching + KV cache reuse
- [ ] Quantization experiments (4-bit/8-bit) without legal accuracy collapse
- [ ] Async pipeline (UI gets partial results quickly)
- [ ] Offload VLM to GPUs; keep retrieval lightweight on CPU

### Product
- [ ] “Explain this redline” button (citations + risk reasoning)
- [ ] Review/accept workflow with audit trail
- [ ] Export: Word-compatible suggestions, PDF annotations, or unified diff

---
