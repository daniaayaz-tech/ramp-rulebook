# Ramp Coding Rulebook data (for the ramp-qb-coding-daily routine)

## Precedence (2026-09-25, extended 2026-09-29)
`memo_keyword_rules.txt` (Ladder-1 keyword rules) → `cardholder_merchant_map.txt` → `merchant_map.txt` → precedent chain → Needs review.
Class is separate (`cardholder_class.txt`, Teamroom first for everyone).

### Rules set by Dania on 2026-09-29 ("code everything")
- **No memo (blank or placeholder "Finance - NA" / "Finance updated memo")**: never write a memo, but DO code by precedent, in this order:
  cardholder + merchant synced in the last ~100 days → cardholder + merchant synced in 2026 → `cardholder_merchant_map.txt` →
  the same memo synced before (≥2 rows) → merchant synced ≥3 times at ≥50% on one Category → `merchant_map.txt` →
  the cardholder's usual coding (≥5 synced rows, ≥40%) → Ramp's current coding. Only a row with none of these stays in Needs review.
- **Memo but no rule**: derive a Ladder-1 rule when the memo generalises (vendor, product, item + context) and code by it; a bare generic
  word (Food, Dinner, Lunch, Coffee, Meal, Snack, Test charge) or a person's name is coded by the precedent chain instead.
- **Rulebook tie** (two rules, same priority, different Category): break it with the precedent chain among the tied options; if no
  precedent, take the first rule and note it.
- **Class**: the Teamroom campus (`cardholder_class.txt`) is first priority for every cardholder, even when the memo names another campus.
  Cardholders missing from the file keep Ramp's class, else their synced class.
- **Refunds / negative amounts**: coded by their memo like any charge and staged.
- **Receipts are not a gate.** Same-day duplicate clusters are staged. Disputed rows are coded but not staged.
- **Split transactions** (more than one line item): Ramp keeps the Category AND the Class of a split on the line items; a header write (`ramp_edit_transaction` / `POST /accounting/codings`) sets only the Department there. Write every line with REST `PATCH /transactions/{id}` `line_items[]` (amounts in cents, must sum to the total; the array REPLACES the whole split) carrying `accounting_field_selections` for BOTH `QuickbooksCategory` (GL external id) and `QuickbooksClass` (class external id, e.g. Alpha South Bay = 1000000015) - omitting the class wipes it (2026-09-29 mistake: 44 splits synced with no class). Department is not splittable (422) and stays on the header. Ramp refuses the PATCH with 403 "Cannot manage splits" once the row is marked ready and there is NO API to un-mark: un-mark in the Ramp UI (detail page "Ready" toggle, shortcut M, or Ready to sync tab -> Mark not ready) first, then code the lines, then mark ready. Check for splits (line_items > 1) BEFORE any bulk mark-ready. A split whose line amounts do not add up cannot be marked ready (ACCOUNTING_7008); the MCP `ramp_split` tool (transaction_id, line_items[{amount in cents, memo}], rationale) re-splits it but drops all line selections, so PATCH the lines afterwards.
- **Rules the reviewers judged too broad** (bare london, material, staff, doordash, open, parent, merch, roar, buildout and the
  2026-09-28 mismatch patterns) defer to the precedent chain; the 2026-09-29 reviewer fixes are already in Ladder-1.
- **Staging gate (Dania 2026-09-30, tightened 2026-10-04)**: a row is coded only when Category, Department AND Class are all set (Department is no longer optional; when the rule or precedent gives none, use the default department for the category: Workshops / Motivation Model / Academic -> All Levels, Software -> STA-Staff Software, Travel -> ADM-Travel, Meals and Entertainment -> ADM-Staff Amenities, Office Supplies -> ADM-Office supplies, HR Expenses -> ADM-HR expenses, Marketing -> MKT-Other Marketing cost, Tangible Assets -> FAC-Buildout, Repairs and Maintenance -> FAC-Other facilities cost, Utilities -> FAC-Internet, Janitorial -> FAC-Janitorial; Summer Camp only in camp season). **Dania 2026-10-04: the September-close exception is over - a row may be marked Ready to Sync ONLY if it ALSO has a non-placeholder memo AND a receipt actually attached** (receipt_uuids non-empty, missing_receipt false). Rows without memo or receipt are still coded (memo stays blank, never written) but stay in Needs review. Before marking ready, re-read every object from Ramp and check memo, receipt and the three fields on every line (splits: Category and Class on each line item); hold disputed rows and splits. Reference implementation: kw3/gate_and_mark.mjs. Applies to reimbursements too (object_type REIMBURSEMENT; rejected or pending ones never).
- **New keywords (Dania 2026-09-30)**: every pass mines the memos no rule reached into candidate rules (keyword + combination, backed by synced precedent); strong candidates go into Ladder-1 the same day, weak ones to the "Proposed" tab for Dania to approve. Rows coded by precedent are recoded when a new rule disagrees.
- **Marking ready in bulk**: REST `POST /accounting/ready-to-sync` `{object_ids:[≤500], object_type:"TRANSACTION"}`; one bad id fails
  the whole batch, so bisect on error.

`tools/build_precedent_maps.mjs <precedents.json> <ramp_option_uuids.json>` extends the two map files from synced 2026 history
(cardholder+merchant: ≥2 synced rows in the last ~100 days or ≥3 in 2026 at ≥60% on one Category/Department; merchants: ≥5 synced rows
at ≥70% on one Category). Existing curated lines are kept; "Summer Camp" is replaced by the category's year-round department.

## memo_keyword_rules.txt
Generated from the Google Sheet **"Ramp Rule Book - Final"**, tab **Ladder-1** (the source of truth; do not hand-edit the file).
Regenerate with `node tools/build_memo_keyword_rules.mjs` (needs `Projects\GSheets\credentials.json` and `Projects\RAMP\.env`
next to this repo), review the diff, commit, push. The script also validates the sheet: priority must equal 5 − keyword-cell
count, no duplicate keyword sets, every Category/Department must exist in Ramp.

Format: `Priority|Keyword 1|Keyword 2|Keyword 3|Keyword 4|CategoryOptionUUID/DepartmentOptionUUID|Category name|Department name|Ladder-1 row|Source note`

Matching: lower-case the memo and replace every non-alphanumeric character with a space. A keyword cell lists variants
separated by ` / ` (plurals, spellings, phrases) and matches when ANY variant appears as a whole word/phrase. A rule fires only
when ALL its non-empty keyword cells match. Lowest Priority number wins (1 = 4 keywords … 4 = 1 keyword). Ties at the winning
priority with different Category → leave in Needs review (fix = add a more specific combination row to Ladder-1). Case is ignored.

`merchant_map.txt` — one line per (Category/Department) combo:
`<CategoryOptionUUID>/<DepartmentOptionUUID>|merchant1;merchant2;...`

Generated from Ramp_Coding_Rulebook_v5.xlsx (Merchant Fallback sheet), mapped to QuickBooks tracking-category option UUIDs. The daily coding routine clones this repo and greps this file for each transaction's merchant (memo keywords take priority over merchant).

## cardholder_class.txt
`Cardholder|QuickBooks Class name|Class option UUID` — Class per cardholder, derived from the "Active contractors" Google Sheet (Teamroom column) → exact QuickBooks Class name. Teamroom wins over the reference xlsx; cardholders in neither fall back to Ramp location. Regenerate whenever the sheet changes.

## class_options.txt
`Class name|Class option UUID|active` — all QuickBooks Class options as they exist in Ramp, for validating names and resolving UUIDs.

## Teamroom → QuickBooks Class translation (non-literal names)
Austin Spyglass → Austin K-8 · Austin CO2 / Austin High School → Alpha High School · Central, EDU.COO/CFO/… → Alpha School LLC · New York → Alpha Anywhere Center · Oklahoma City → Alpha Oklahoma City (Reno) · Woodlands → Alpha The Woodlands · Founders → Founders Hub · TSA.Lakeway → Texas Sports Academy · GT.Georgetown → GT School Georgetown · PAM.HISD → HISD · Phoenix → Alpha Scottsdale · Brownsville → Brownsville K-8. Otherwise `EDU.School.Alpha.<Location>.<Level>.<Mode>` → `Alpha <Location>`.
