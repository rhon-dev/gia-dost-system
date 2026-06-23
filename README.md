# DOST DPMIS — Grants-In-Aid (GIA) Proposal System

Frontend for the DOST GIA Proposal Workflow System. Full interactive SPA — login, 6-step proposal wizard, admin review/endorse/approve, accounting, reports, user management, and public tracking. All logic runs client-side (vanilla JS, no framework, no build step).

## How to run

Open `index.html` in a browser. No server needed.

Roles accessible from the login screen:

- **Proponent** — create proposals, 6-step wizard, track status
- **Administrator** — review / endorse / approve, return proposals
- **Super Admin** — user management, account approvals, system overview

---

## Project structure

```text
accounting/       Accounting officer queue
admin/            Admin review + proposal detail
approver/         Approver queue
auth/             Login, register, forgot password
assets/css/       Shared stylesheet
assets/js/        app.js (shared behavior), dpmis-runtime.js, dpmis-logic.js (SPA engine + logic)
config/           Reserved for backend config (empty)
includes/         Reserved for PHP includes (empty)
reports/          Reserved for reports output (empty)
superadmin/       User management, reports
uploads/          Reserved for file uploads (empty, must stay outside public/ in production)
user/             Proponent dashboard, proposal wizard, my-proposals
index.html        Main SPA entry point
```

---

## Current state

| Area | Status |
| --- | --- |
| Login + role selection | Done (frontend) |
| 6-step proposal wizard (Type → Info → Narrative → Team → Budget/LIB → Docs) | Done (frontend) |
| 15% counterpart funding rule enforcement | Done (frontend) |
| Proposal detail + workflow progress + audit trail | Done (frontend) |
| Admin action inbox | Done (frontend) |
| Super Admin user + account approval tables | Done (frontend) |
| Public proposal tracker | Done (frontend) |
| Reports (breakdown by stage) | Done (frontend) |
| **Real backend / database** | **Not started** |
| **Authentication (real)** | **Not started** |
| **File uploads** | **Not started** |

---

## Remaining work — Backend & Database (PHP + MySQL)

> Stack: **PHP** backend, **MySQL Workbench** for schema design and DB management.

---

### Phase 0 — Clarify requirements BEFORE writing any backend code

Answer these with your supervisor in writing before Phase 2:

1. Can a proposal be rejected at every stage, or only some?
2. When rejected — does it die, or can the user revise and resubmit?
3. Is there more than one approver? (e.g. small proposals need 1 approval, large ones need 2)
4. Do different offices have separate admin queues, or one shared queue?

These four answers determine the entire database design.

---

### Phase 1 — Wireframes (Figma, before any HTML)

All pages linked with Figma prototyping so the team can click through before coding. Catch missing pages (like "Revision Requested" state) for free.

Pages needed beyond what is currently built:

- Email verification after register
- Pending Approval screen (account waiting for Super Admin activation)
- Forgot Password / Reset Password
- "Revision Requested" state view for proponents
- Proposal Timeline page (visual history of every action)
- Notification Center
- Audit Log viewer (Super Admin only)

---

### Phase 2 — Database Design (MySQL Workbench)

Design the ERD in MySQL Workbench before running any `CREATE TABLE`.

**Use one `ProposalAction` table instead of three separate tables (Endorsements, Approvals, Accounting).** Identical shape — one `action_type` field handles all. Adding a new stage later = one new enum value, not a new table.

```sql
-- Core tables

Users
  id, name, email, password_hash,
  role (Submitter | EndorsingAdmin | Approver | Accounting | SuperAdmin),
  department_id, is_approved, date_approved, approved_by_id, created_at

Department
  id, name, default_endorser_id, default_approver_id

Proposals
  id, title, description,
  status  -- ENUM: draft, submitted, under_review, revision_requested,
          --       endorsed, rejected, approved, accounting, completed
  submitted_by_id, department_id,
  current_revision,  -- increments each resubmit after revision_requested
  date_created, date_updated

ProposalAction            -- replaces Endorsements + Approvals + Accounting
  id, proposal_id, action_type,
  -- action_type ENUM: endorse, approve, reject, request_revision,
  --                   accounting_process, return_for_clarification
  performed_by_id, remarks,
  previous_status, new_status, created_at

Attachment
  id, proposal_id, file_path, original_filename,
  uploaded_by_id, file_size, content_type, uploaded_at

Notification
  id, user_id, message, link, is_read, created_at
```

**Add a transition rules table (or PHP array) mapping `current_status → [allowed_next_statuses]`.** Every status change must pass through one validation function. This prevents illegal jumps (e.g. Draft → Completed via a direct URL edit).

---

### Phase 3 — PHP Project Setup

```text
dost-gia/
  config/
    db.php          # DB credentials — never commit this; add to .gitignore
    constants.php   # status enums, allowed transitions
  src/
    models/         # Proposal.php, User.php, ProposalAction.php, Attachment.php
    controllers/    # ProposalController.php, WorkflowController.php, etc.
    middleware/     # auth check, permission check
  public/           # index.html + assets (this repo's frontend)
  uploads/          # file uploads — NOT publicly browsable
  .gitignore        # exclude: config/db.php, uploads/, *.sqlite
```

Set up Git branches from day one — `main` protected, one branch per feature, merge via Pull Request even on a small team.

---

### Phase 4 — Authentication

- Register → email verification → Pending (Super Admin activates) → login enabled
- Roles assigned by Super Admin at activation (not self-selected — security hole)
- Forgot Password (password reset token table + PHP Mailer)
- Session-based auth (PHP `$_SESSION`) or JWT if building an API
- Skip MFA for now

---

### Phase 5 — Proposal Module

- Create / edit proposal (edit only while `status = draft` OR `revision_requested` — enforce server-side, not just by hiding the button)
- Draft autosave (JS `setInterval` POST to `/api/proposals/autosave`)
- File uploads — **validate on every upload from day one:**
  - Whitelist extensions: `.pdf`, `.docx`, `.xlsx`
  - Max file size (e.g. 10 MB)
  - Check actual MIME type server-side (`mime_content_type()` in PHP), not just the extension — a renamed `.exe` must not pass
  - Store files outside `public/` so they are not directly accessible by URL
- View proposal + full action timeline (uses `ProposalAction` table)

---

### Phase 6 — Workflow Engine

The single most important piece of backend code:

```text
Draft
  ↓ submit
Submitted
  ↓ admin review
  ├─→ Revision Requested ──→ user edits & resubmits ──→ Submitted
  └─→ Endorsed
        ↓ approver review
        ├─→ Rejected ──→ END (user notified)
        └─→ Approved
              ↓ accounting
              ├─→ Returned for Clarification ──→ back to Approver
              └─→ Completed
```

Write one `transition(proposal_id, action_type, actor_id, remarks)` PHP function that:

1. Checks actor has permission for this `action_type`
2. Checks transition is legal from current status
3. Inserts into `ProposalAction`
4. Updates `proposals.status`
5. Inserts into `Notification` for the next-stage user

All workflow actions call this function. Nothing bypasses it.

---

### Phase 7 — Dashboards

Connect the frontend to real data via PHP endpoints (or a simple REST API):

- **Proponent**: my proposals, status badges, "needs action" banner (revision requested)
- **Admin/Approver/Accounting**: pending queue filtered by role, recently completed actions
- **Super Admin**: pending activations, user list with role management, system-wide stats

Add Chart.js charts for proposal counts by status (the frontend already has the UI structure).

---

### Phase 8 — Reports

- Filterable by: date range, status, department, submitter
- Export: Excel (`PhpSpreadsheet`) and PDF (`mPDF` or `TCPDF`)
- For large reports (500+ rows), generate async and notify user when ready — don't block the HTTP request

---

### Phase 9 — Audit Trail & Polish

- Log every status change, login, and file upload with actor + timestamp
  - `AuditLog` table: `user_id`, `action`, `target_type`, `target_id`, `ip_address`, `created_at`
- UI consistency pass across all pages
- Seed script (`seed_demo.php`) that populates realistic data so reviewers see a working system, not an empty one

---

### Phase 10 — Buffer + Demo Prep

- Fix week-9 bugs
- Rehearse full walkthrough (submit → endorse → approve → accounting → complete + rejection path)
- Basic deployment notes (Apache/Nginx vhost config, MySQL import script)

---

## Common pitfalls

1. **Role checks scattered in views** — put all permission logic in one middleware/helper. `canPerformAction($user, $actionType)` everywhere.
2. **Status transitions checked per-view instead of in one function** — works until someone adds a new transition.
3. **Testing only the happy path** — explicitly test: reject at every stage, revision-request then resubmit, upload a disallowed file type, try to edit a Submitted proposal by direct URL.
4. **No seed data script** — write this early so everyone demos a populated system.
5. **`config/db.php` committed to Git** — add it to `.gitignore` on day one.

---

## Team split suggestion

| Member | Owns |
| --- | --- |
| 1 | Auth: register, login, sessions, account approval |
| 2 | Database schema (MySQL Workbench ERD), migrations, schema doc as single source of truth |
| 3 | Proposal module: create/edit/view, file upload + validation |
| 4 | Workflow engine: `transition()` function, ProposalAction history, timeline view |
| 5 | Frontend: PHP templates, dashboards, design consistency across all pages |

Rotate an "integration lead" each week — whoever merges branches and resolves conflicts.

---

## License

Add a license file if this will be open-sourced.
