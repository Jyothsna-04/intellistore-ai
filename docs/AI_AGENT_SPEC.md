# AI Agent Specification — IntelliStore AI

> **Core AI Philosophy & Business Value**: All agents must adhere to the 3 mandatory questions (Problem, Action, Measurable Benefit) and track enterprise success metrics as specified in [PRODUCT_DIFFERENTIATOR.md](file:///c:/Users/jyoth/OneDrive/Desktop/Cloud_Project_1/IntelliStoreAI/docs/PRODUCT_DIFFERENTIATOR.md).

## Architecture: LangGraph Supervisor Pattern

```
User
  ↓
Storage Copilot (Supervisor)
  ↓
Specialist Agents (12 total)
  ↓
Merged Response with Reasoning + Confidence Score
```

The Supervisor never answers directly. It routes intent to specialists, collects structured JSON responses, merges them, and returns an explainable result.

---

## Agent Registry

| # | Agent | Responsibility | Milestone |
|---|---|---|---|
| 1 | **Storage Copilot** | Supervisor — intent routing, response merging | M9 |
| 2 | **Storage Optimization Agent** | Tier recommendations, usage analysis | M9 |
| 3 | **Duplicate Detection Agent** | Hash-based + semantic duplicate finding | M9 |
| 4 | **Archive Recommendation Agent** | Archive / delete / compress / keep decisions | M9 |
| 5 | **Cost Optimization Agent** | Storage cost estimation, savings forecasting | M9 |
| 6 | **File Classification Agent** | Classify by type, content, department, sensitivity | M9 |
| 7 | **Security & Compliance Agent** | PII, passwords, API keys, sensitive doc detection | M9 |
| 8 | **Semantic Search Agent** | Natural language search over file contents | M9 |
| 9 | **Storage Health Prediction Agent** | Forecast storage growth, predict issues | M9 |
| 10 | **Policy Enforcement Agent** | Enforce retention, compliance, sharing policies | M9 |
| 11 | **Report Generation Agent** | Auto-generate storage and compliance reports | M9 |
| 12 | **Workflow Automation Agent** | Trigger automated workflows based on file events | M9 |

---

## Supervisor Agent — Detailed Spec

**Role:** Storage Copilot

**Responsibilities:**
- Parse user intent from natural language
- Select which specialist agents to invoke (one or many)
- Pass structured context to each specialist
- Collect structured JSON responses
- Merge and deduplicate insights
- Compose final explainable response
- Maintain conversation memory per session
- Protect against prompt injection

**Routing Rules:**
- Storage/tier questions → Storage Optimization Agent
- "Duplicate" / "same file" → Duplicate Detection Agent
- "Archive" / "old files" / "cold storage" → Archive Recommendation Agent
- "Cost" / "savings" / "expensive" → Cost Optimization Agent
- "What is this file?" / "classify" → File Classification Agent
- "Sensitive" / "PII" / "password" / "secret" → Security & Compliance Agent
- Natural language file search → Semantic Search Agent
- "Running out of space" / "trend" → Storage Health Prediction Agent
- "Policy" / "retention" / "compliance" → Policy Enforcement Agent
- "Report" / "summary" / "export" → Report Generation Agent
- "Automate" / "trigger" / "workflow" → Workflow Automation Agent

**Supervisor never routes to multiple agents unnecessarily. Efficiency is part of its design.**

---

## Specialist Agent — Contract

Every specialist agent must implement this contract:

### Input (from Supervisor)
```json
{
  "intent": "string",
  "user_context": {
    "user_id": "uuid",
    "roles": ["EMPLOYEE", "MANAGER", "ADMIN"],
    "department": "string"
  },
  "file_context": {
    "file_ids": ["uuid"],
    "folder_ids": ["uuid"],
    "storage_metadata": {}
  },
  "conversation_history": [],
  "session_id": "uuid"
}
```

### Output (to Supervisor)
```json
{
  "agent_name": "string",
  "success": true,
  "findings": [],
  "recommendations": [
    {
      "type": "string",
      "title": "string",
      "description": "string",
      "reasoning": "string",
      "confidence": 0.92,
      "potential_impact": "string",
      "action_required": true,
      "action_type": "MOVE_TO_COLD | DELETE | ARCHIVE | COMPRESS | FLAG | NONE"
    }
  ],
  "metadata": {
    "processing_time_ms": 450,
    "files_analyzed": 120,
    "model_used": "gpt-4o"
  },
  "error": null
}
```

---

## Agent 2 — Storage Optimization Agent

**Purpose:** Analyze file access patterns and recommend storage tier movement.

**Inputs:**
- File access timestamps
- Current storage tier per file
- File age and size
- User activity patterns

**Logic:**
- HOT → WARM: Not accessed in 30 days
- WARM → COLD: Not accessed in 90 days
- COLD → ARCHIVE: Not accessed in 365 days
- Consider file size in tier recommendations
- Predict future storage growth from trends

**Output:** List of tier movement recommendations with reasoning.

---

## Agent 3 — Duplicate Detection Agent

**Purpose:** Find exact and near-duplicate files.

**Exact Duplicates:** SHA-256 hash comparison
**Near Duplicates:** Cosine similarity on sentence transformer embeddings (threshold: 0.92)

**Output:** Duplicate groups with similarity scores, space waste calculation, recommended action.

---

## Agent 4 — Archive Recommendation Agent

**Purpose:** Recommend which files to archive, compress, delete, or keep.

**Decision Factors:**
- Last accessed date
- File size
- Storage tier
- Duplicate status
- File classification
- Department policy
- Retention rules

**Output:** Per-file recommendation (ARCHIVE / COMPRESS / DELETE / KEEP) with reasoning.

---

## Agent 5 — Cost Optimization Agent

**Purpose:** Estimate current storage costs and identify savings.

**Tier Pricing Model (USD/GB/month):**
- HOT: $0.023
- WARM: $0.013
- COLD: $0.004
- ARCHIVE: $0.001

**Output:** Current estimated cost, potential savings, recommended actions to reduce cost.

---

## Agent 6 — File Classification Agent

**Purpose:** Auto-classify files by type and content.

**Classification Categories:**
- Document (PDF, DOCX, TXT)
- Spreadsheet (XLSX, CSV)
- Presentation (PPTX)
- Image (JPEG, PNG, GIF, WEBP)
- Video (MP4, AVI, MOV)
- Audio (MP3, WAV)
- Archive (ZIP, RAR, TAR)
- Source Code (Java, Python, JS, TS, etc.)
- Research Paper (academic PDFs)
- Medical Document (DICOM, clinical reports)
- Contract / Legal
- Financial Report
- Configuration / Infrastructure
- Unknown

**Output:** Classification label + confidence score per file.

---

## Agent 7 — Security & Compliance Agent

**Purpose:** Detect sensitive content before sharing, archiving, or public exposure.

**Detection Targets:**
- PII (emails, phone numbers, SSNs, passport numbers)
- Passwords (regex patterns, common password strings)
- API Keys (common key patterns: AWS, GitHub, OpenAI, etc.)
- Credit Card Numbers
- Private Keys / Certificates
- Medical Information (HIPAA triggers)
- Confidential / Internal Only markers

**Triggers:**
- On file upload (background scan)
- Before generating share links
- On AI Copilot share intent

**Output:** Risk level (NONE / LOW / MEDIUM / HIGH / CRITICAL) + findings list.

---

## Agent 8 — Semantic Search Agent

**Purpose:** Enable natural language queries over file contents.

**Method:**
- Query encoded via Sentence Transformers
- Cosine similarity search against pgvector index
- Re-ranked by relevance + recency + access frequency

**Output:** Ranked list of matching files with relevance score and excerpt.

---

## Agent 9 — Storage Health Prediction Agent

**Purpose:** Forecast storage growth and predict capacity issues.

**Method:**
- Linear regression on historical storage_statistics
- Predict days until quota exhaustion
- Identify fastest-growing departments

**Output:** Days until quota exhaustion, growth rate, top growth contributors, recommendations.

---

## Agent 10 — Policy Enforcement Agent

**Purpose:** Enforce retention policies, compliance rules, and sharing restrictions.

**Capabilities:**
- Flag files violating retention policies
- Block shares that violate data classification rules
- Enforce department-level sharing restrictions
- Trigger alerts for policy violations

**Output:** Policy violations list with severity and recommended remediation.

---

## Agent 11 — Report Generation Agent

**Purpose:** Generate structured storage and compliance reports on demand.

**Report Types:**
- Storage Utilization Report
- Duplicate Waste Report
- Cost Optimization Report
- Security Risk Report
- Compliance Audit Report
- Department Usage Report

**Output:** Structured JSON report + human-readable summary for PDF/CSV export.

---

## Agent 12 — Workflow Automation Agent

**Purpose:** Trigger automated actions based on file events and rules.

**Automation Examples:**
- Auto-archive files older than N days
- Auto-tag files by extension or department
- Auto-notify on quota threshold
- Auto-classify on upload
- Auto-scan on share request

**Output:** Workflow execution log, actions taken, errors.

---

## AI Safety Principles

1. **Never hallucinate.** Ground all recommendations in actual metadata from the database.
2. **Always explain.** Every recommendation includes reasoning + confidence score.
3. **Never expose system prompts.** User never sees internal routing logic.
4. **Never expose API keys.** All credentials via environment variables.
5. **Validate inputs.** Sanitize all user text before passing to LLM.
6. **Validate outputs.** Parse and validate all LLM responses as structured JSON.
7. **Fail gracefully.** Agent failures must not crash the Supervisor response.
8. **Rate limit.** Limit AI requests per user per minute.
9. **Audit.** Log every AI interaction (user ID, intent, agents invoked, response time).
10. **Model independence.** Switching from OpenAI to Ollama requires only a config change.

---

## LangGraph State Schema

```python
class IntelliStoreState(TypedDict):
    # Input
    user_message: str
    session_id: str
    user_context: dict
    conversation_history: list[dict]

    # Routing
    intent: str
    agents_to_invoke: list[str]

    # Agent results
    agent_responses: dict[str, AgentResponse]

    # Output
    final_response: str
    recommendations: list[dict]
    confidence_score: float
    error: Optional[str]
```

---

*Last updated: M0 Foundation — v0.1.0 | 12-agent architecture adopted*
