# Ramp Coding Rulebook data (for the ramp-qb-coding-daily routine and the `ramp-quickbooks-coding` skill)

**Business rules since 2026-10-17 come from Finance's playbook** "Ramp posting rules and deep-dive playbook — Alpha Schools
(LoE Ramp org → QuickBooks)", 14 Oct 2026, saved as `Projects\RAMP\Ramp_Posting_Rules_Playbook_2026-10-14.md`
(Dania, 2026-10-17: "update the skill and rulebook as per playbook"). Where the playbook is silent — Department, the
mark-ready gate, precedent mechanics, split handling — the earlier rules below still apply and are marked **(unchanged, playbook silent)**.
The difference list that drove this rewrite is `Projects\RAMP\Playbook_vs_Rulebook_Differences_2026-10-17.md`.

## Precedence

- **Category + Department**: `cardholder_rulings.txt` (per-cardholder rulings, e.g. MacKenzie Price) → `memo_keyword_rules.txt` (Ladder-1) →
  the precedent chain of section 4, which holds the two map files inside it (cardholder + merchant synced history → `cardholder_merchant_map.txt`
  → same memo → merchant history → `merchant_map.txt` → cardholder usual → Ramp current) → Needs review. Clarified 2026-10-29: for a row
  Ladder-1 does not code, the cardholder's own synced history with that merchant beats the map files (reviewers overturned map-based codings
  on that ground twice; the old wording "maps before precedent" was the engine's shortcut, not the rule). The playbook overlay (section 2) is applied on top of whatever those give: Ops-team capitalisation,
  refunds follow the original, holds.
- **Class**: the playbook ladder (section 1). `cardholder_class.txt` is the **fallback** (step 6), no longer the first rule.
  The 2026-09-29 rule "Teamroom first for every cardholder, even when the memo names another campus" is **withdrawn**.
- Two decisions per line: Class = who pays, Account (Category) = what the spend is. Department is ours (unchanged).

## 1. Class — apply in this order, first fit wins (playbook A1)

1. **Memo, receipt text or Ramp trip name names a campus or programme → that class.** Match campus words against
   `class_options.txt` (exact Ramp option names; "Alpha <City>" ↔ "<City>"), after stripping the cardholder's own name
   ("J.R. Houston" is not Houston). Goods bought for another campus go to the campus named; costs follow the campus served.
2. **Ops team build-out → Category Tangible Assets / FAC-Buildout, class = the site being built.** Ops team = Patrick Francia,
   Joshua Rockers, J.R. Houston, Austin Ray, Jim Liu, Robbie Forrest. Covers everything they spend on a build-out including
   flights, hotels, meals and Uber (so a Travel / Meals rule result is overridden to Tangible Assets for them). The site comes from
   rule 1; with no site named the line keeps the fallback class and is listed under "Ops capex, site unknown" — uncertain
   or multi-site capex is never split or guessed (playbook E4, B6.6).
3. **Summer programme → class `Alpha Summer Camps` (+ Department `Summer Camp`)** when the memo says camp / summer camp /
   session 0, or the cardholder is listed as Alpha Summer Camps in `cardholder_class.txt` and the Ramp transaction date falls
   in camp weeks (2026: 8-Jun to 24-Jul; Kirkland Session 0 ran to 21-Aug). The camps roster itself is not available to the
   agent — a guide whose pre-school-year spend might be camp goes to Needs review with that reason.
4. **Staff trips → class `Central`.** Memo (or trip name) says staff day(s), all-staff, training (week), onboarding, offsite,
   summit / conference, workshop travel, interview / candidate / hiring / relocation, admissions costs, mandated-reporter /
   CPR / compliance training. Exceptions that stay with the school: local staff-day costs in the guide's own city, shadow-day or
   roadshow support travel, cross-campus coverage / launch help (needs evidence — without it the trip goes to Central).
5. **People not attached to a school** (real-estate roamers, central staff) → `Central`. Decided by Dania 2026-10-23:
   `cardholder_class.txt` maps every central-team cardholder (Teamroom Central, EDU.COO/CFO, finance, real estate) to Central;
   the six Ops-team members keep `Alpha School LLC` as their fallback because QuickBooks carries all build-out capex there
   (card lines since July: Tangible Assets 1,809 on Alpha School LLC, 0 on Central).
   **Bare destination rule (Dania 2026-10-23):** a memo that names only a city with a hotel, flight or ride and no purpose
   ("Hotel stay in Dorado 7–20 June", "Flight to Chicago") is a staff trip without coverage evidence → `Central` (rule 4), not the
   named campus. The named campus wins only when the memo states a purpose for it: visit, support, launch, coverage, workshop,
   training at that campus for its students, supplies / lunch / transport for that campus.
6. **Fallback → the cardholder's Crossover teamroom school = `cardholder_class.txt`.** Ramp department "Alpha Zero" is a
   placeholder (use the Ramp location); "Expansion schools" mixes Ops with new-school guides (Ops → rule 2, guides → the school
   they were hired for; unknown → Needs review).
7. **Not enough evidence → book to the fallback and flag; never guess a different campus.**

**Fixed mappings** (playbook): New York = `Alpha Anywhere Center`; Founders School = `Founders Hub`; HISD-partnership trips =
`HISD`; Springfield pilot = `SEZP`; student trips and competitions = the students' school; Marketing class = central marketing
team only (campus-run events, merch and set-up stay with the school; there is no "Marketing" class option in Ramp today);
Armonk ≠ Port Chester; Sausalito ≠ Marin County; Redmond = Kirkland; Orlando = Winter Park (**no `Alpha Winter Park` option in
Ramp — `Alpha Orlando` is used until Finance adds it**). A programme with no class → Needs review, raise it (as for SEZP).
Added by Dania 2026-10-23: **TSA Carrollton = `Carrolton Sports Academy`** (Texas Sports Academy's Carrollton site, own QuickBooks
file; never `Alpha Carrolton`, which is a different school). **"Alpha Anywhere" the online programme is NOT `Alpha Anywhere Center`**
(the NYC school); it has no class yet → leave the current class, list it under Needs review "class to be created" until Finance adds one.

**Never post to** `GT School Georgetown`, `GT Anywhere`, `GT Summer Camp`, `Unbound`, `Alpha World Ventures` — their costs sit
centrally on purpose. `cardholder_class.txt` maps those cardholders to `Central` (13 GT cardholders changed 2026-10-17).

## 2. Account (Category) — playbook A2, and what it changed in this repo

| Spend | Category (Department we use) |
|---|---|
| Student workshop supplies, field trips, activities, escape rooms, workshop vendors, AI tools used with students | Program:Workshops (All Levels / grade) |
| Student prizes, emporium, rewards, student offsites | Program:Motivation Model (All Levels / grade) |
| AI tools for admin use; all other software / apps (Canva, Notion, Adobe, Plaud, Zoom, Calendly, domains) | Program:Software (STA-Staff Software / ADM-Apps/Software / MKT-Apps/software) |
| Flights, hotels, Uber / Lyft, car rental, fuel, parking, tolls, meals while travelling | Administration:Travel (ADM-Travel; MKT-Travel for marketing-team sources) |
| Space rental, co-working (WorkSuites, WeWork, Peerspace, COhatch) | Facilities/Support:Rent (FAC-Rent) |
| Repairs, handyman, cleaning, organiser services, keys / locksmiths, plumbing, movers | Facilities/Support:Repairs and Maintenance (FAC-Repairs / FAC-Other facilities cost) |
| Internet, phone, local utility bills | Facilities/Support:Utilities (FAC-Internet / FAC-Other Utilities / FAC-Electricity/Water) |
| Build-out, fit-out, furniture, signage, pre-opening devices, pre-opening legal / permits (Ops team or a campus before opening) | Tangible Assets (FAC-Buildout) |
| Storage units, device subscriptions, shipping, business cards, workshop consumables | the normal expense account — **never Tangible Assets** |
| Event venue / event services / event supplies (student or campus events) | Program:Events (All Levels) |
| Uniform patches, branded merch, swag, custom apparel | Administration:Marketing (MKT-Other Marketing cost) |

Capitalise vs expense: new site before opening or a defined refresh project → Tangible Assets; repair / IT work at an operating
site → expense; land / building purchases incl. their legal → Tangible Assets (never Other Long Term Assets); PODS / U-Haul during a
build-out were left capitalised by Finance, storage units are always expense. `Other Expenses:Renovations/Furnishings` is not in
the playbook and is **retired** from the rulebook (its rows became Tangible Assets, Software or Travel).

Applied 2026-10-17: 316 Ladder-1 rows re-coded in the Google Sheet with a column-I note (list: `Projects\RAMP\reviews\Playbook_Ladder1_changes_2026-10-17.csv`) (travel words → Travel; event supplies /
venue / event meals → Program:Events; Plaud / Canva / Notion / Adobe / Dropbox / Zoom / domains → Software; branded merch →
Marketing; internet / hotspot / Starlink → Utilities; Renovations/Furnishings rows retired). Rows that pair travel words with
student-trip words (student, field trip, alphax, t2p / test2pass, iac, squad, camping, disney, pumpkin patch, …) deliberately
stayed on Workshops / Motivation Model — student trips are programme cost. `merchant_map.txt`: the 127-merchant "Tangible Assets /
ADM-Travel" line (Hertz, Turo, hotels, restaurants) and the travel merchants inside the Marketing, Meals, HR and Workshops lines
moved to Administration:Travel; co-working → Rent; movers, cleaning, handyman, locksmiths, plumbing → Repairs and Maintenance;
Canva / Adobe / GoDaddy / Zoom / Calendly / Squarespace … → Software; AT&T / Comcast / VIASAT → Utilities; patches / apparel /
swag vendors → Marketing. `cardholder_merchant_map.txt`: Renovations/Furnishings rules retired (Ops team → Tangible Assets,
other cardholders' capitalised travel / meals → Travel, software → Software); 28 Workshops / Motivation hotel-or-parking rules
were left for Dania (student trips?) — `Projects\RAMP\reviews\Playbook_cardholder_travel_rows_to_confirm_2026-10-17.txt`.

## 3. Holds, refunds, dates, thresholds, reasons (playbook A3, E12–E14, B1, B3.7)

- **Hold, do not post**: personal-looking charges (fashion retail, weekend leisure, a partner's or family travel) and the same
  receipt claimed twice → do not code, do not stage, list for Dania (repayment through Ramp).
- **Placeholder memos / receipts**: "Finance Updated memo", "Finance - NA", "Finance updated memo" and the "Receipt – Finance"
  placeholder image are a sync-unblock fill-in, not evidence → treat as no memo and no receipt (coded by the precedent chain,
  memo never written, never staged — see the gate below).
- **Charges under repayment are staged (Dania 2026-10-28, widened 2026-10-29).** Ramp repayments (Expenses > Card transactions >
  ⋮ > Repayments) copy the original charge's coding and can only sync to QuickBooks after the original has synced. So a charge with
  **any** repayment status (requested by reviewer, awaiting payment / in progress, or repaid) is coded as an ordinary expense by the
  normal rules and marked Ready to Sync **regardless of the period cutoff date** ("repayments are exclusive of cutoff time and receipt
  and memo"; refined by Dania 2026-10-30: a repayment original WITHOUT memo or receipt waits until the 25th of the month so the
  cardholder can add them, and from the 25th it is staged anyway, whatever its date; with memo + receipt it is staged at once). Such rows sit in Needs review rather than Waiting for cardholder, because requesting repayment exempts
  the cardholder from memo and receipt. The usual holds (>= $1,000, disputed, split, multi-campus) still apply. Note "personal charge
  under repayment <id>" in the run report. Repayments repaid before Ramp's August-2026 autosync cutoff never sync on their own:
  Finance syncs them by hand from the Repayments page (Sync Repayment / Mark as synced).
- **Refunds / credits follow the original charge**: find the original by merchant, amount and date (synced or unsynced); copy its
  Category, Department and Class. No original found → Needs review. (Replaces "refunds are coded by their memo".)
- **Dates**: every date rule (camp weeks, staff days, opening windows, precedent windows) uses the **Ramp transaction date**,
  never the QuickBooks accounting date (bumped to the 1st after a close).
- **Possible duplicates** (same person, merchant, amount, day): code them, stage them, and list them in the run report for a
  receipt check (Dania 2026-10-30; until then they were held) — only a same-receipt double claim is a true duplicate and a person
  has to look at the receipts.
- **Lines of $1,000 or more**: coded, staged, and listed in the run report for a hand-check (playbook B1 review threshold; Dania
  relaxed the staging block on 2026-10-30).
- **Reason on every changed line**: the `rationale` of every write (and the run CSV) is one short phrase plus the source, e.g.
  "Ladder-1 row 1208 (flight + workshop) → Travel; staff trip → Central", "refund of Delta 2026-09-14 $412.30 → same coding".
  Ramp comments are not posted (they notify cardholders) unless Dania asks.
- **Deep-dive triggers the agent cannot resolve → Needs review with the trigger named**: memo names a campus other than the
  cardholder's and the campus is not a Ramp class option; travel by a school guide outside their home city with no staff-trip or
  student words; "Expansion schools" guides; June–August spend by a guide that may be camp (no roster); one charge for several
  campuses with no quantity basis (never split evenly); a Crossover teamroom change in the last 60 days. The agent does not have
  Crossover, Rhodes, the camps roster, the central events calendar, QuickBooks push-down history, Navan or receipt OCR (playbook B8).

## 4. Rules that are unchanged (playbook silent)

- **No memo (blank or placeholder)**: never write a memo, but DO code by precedent, in this order: cardholder + merchant synced
  in the last ~100 days → cardholder + merchant synced in 2026 → `cardholder_merchant_map.txt` → the same memo synced before
  (≥2 rows) → merchant synced ≥3 times at ≥50% on one Category → `merchant_map.txt` → the cardholder's usual coding (≥5 synced
  rows, ≥40%) → Ramp's current coding. Only a row with none of these stays in Needs review (Dania 2026-09-29).
- **Memo but no rule**: derive a Ladder-1 rule when the memo generalises (vendor, product, item + context) and code by it; a bare
  generic word (Food, Dinner, Lunch, Coffee, Meal, Snack, Test charge) or a person's name is coded by the precedent chain.
- **Per-cardholder rulings (`cardholder_rulings.txt`, Dania 2026-10-29)**: **MacKenzie Price has no rulebook rules** - code her rows from her own
  synced history (cardholder + merchant in the last ~100 days → cardholder + merchant 2026 → her usual coding), default
  Administration:Marketing / MKT-Other Marketing cost (76% of her 552 synced 2026 rows, hotels, flights and dinners included - the
  playbook travel table is not applied to her); class by the ladder, fallback Central. Ladder-1, the map files and the playbook
  account table are skipped for a cardholder with a ruling.
- **Rulebook tie** (two rules, same priority, different Category): break it with the precedent chain among the tied options; if no
  precedent, take the first rule and note it.
- **Department** comes from the Ladder-1 row / map / precedent; when none gives one, the category default: Workshops / Motivation
  Model / Academic / **Events** → All Levels, Software → STA-Staff Software, Travel → ADM-Travel, Meals and Entertainment →
  ADM-Staff Amenities, Office Supplies → ADM-Office supplies, HR Expenses → ADM-HR expenses, Marketing → MKT-Other Marketing cost,
  Tangible Assets → FAC-Buildout, Repairs and Maintenance → FAC-Other facilities cost, Utilities → FAC-Internet, **Rent → FAC-Rent**,
  Janitorial → FAC-Janitorial; Summer Camp only with the Alpha Summer Camps class / camp season.
- **Staging gate (Dania 2026-10-30; replaces the 2026-09-30 / 2026-10-04 gate):** a row is coded only when Category, Department
  AND Class are all set. Once the coding is complete it is marked Ready to Sync, with these conditions on memo and receipt:
  - **Month-end window = the 25th of a month to its last day.** Inside the window, rows with a Ramp transaction date **on or before the
    20th of that month** are staged even without a memo or receipt ("at month end after the 25th stage even those which have no memo,
    no receipt, but the posting date should be on or before the 20th"). Outside the window the cutoff is the 20th of the previous
    month, so a row that became eligible never loses it. Rows dated after the cutoff need a non-placeholder memo AND a receipt actually
    attached (`receipt_uuids` non-empty) — cardholders get until the 25th to add them. Ramp-Daily/config.json holds the two day
    numbers (`memoReceiptRule`: relaxFromDay 25, cutoffDay 20) and an optional fixed override; moved only on Dania's instruction.
  - **Repayment originals ignore the 20th** (Dania 2026-10-30): a charge with any repayment status is staged on any date once it has
    memo + receipt; without them it waits until the 25th and is then staged whatever its posting date. Repayments are read over REST
    (`GET /repayments`, scope `repayments:read`, granted 2026-10-30 — see section 6).
  - **Never staged**: disputed rows (Dania 2026-10-30), personal-looking charges (section 3), and rows whose coding cannot be
    completed (no class, class not active, category not in Ramp, split with a missing line field, memo naming several campuses,
    not CLEARED) — these stay in Needs review and are listed.
  - The former blocks — ≥ $1,000, possible duplicate, refund without an original — are staged and listed in the run report instead.
  - Re-read every object from Ramp before marking ready. **Reimbursements are in the daily run too (Dania 2026-10-30):** same engine
    and the same gate, with these specifics: only approved-and-later states are eligible (PENDING = awaiting approval and REJECTED,
    DRAFT, CANCELED, DELETED never sync); mileage and per-diem claims are exempt from the receipt requirement; the personal-looking
    check does not apply (an out-of-pocket claim is personal money by definition); repayments and disputes do not exist for them.
    Coding is written with the connector tool `ramp_edit_reimbursement` (header write; Ramp stores Department on the header and
    Category + Class on the single line, exactly like synced ones) and staged with `object_type: REIMBURSEMENT`. Precedent for
    the chain = synced card rows AND synced reimbursements (data/synced_reimb_2026.json, 10,923 rows on 2026-10-30).
  - History: the 2026-10-04 gate required memo + receipt on every row; one-off close exceptions on 2026-09-30, 2026-10-04 and
    2026-10-29 (rows dated ≤ 20 Oct) staged without them before this became the standing rule.
- **Split transactions** (more than one line item): Ramp keeps Category AND Class on the line items; a header write sets only the
  Department. Write every line with REST `PATCH /transactions/{id}` `line_items[]` (amounts in cents, sum to the total; the array
  REPLACES the split) carrying `accounting_field_selections` for BOTH `QuickbooksCategory` and `QuickbooksClass` — omitting the
  class wipes it (2026-09-29: 44 splits synced with no class). Department is not splittable (422). Ramp refuses the PATCH with 403
  "Cannot manage splits" once the row is marked ready and there is NO API to un-mark (Ramp UI only). Check `line_items > 1` BEFORE any
  bulk mark-ready; a split whose lines do not add up cannot be marked ready (ACCOUNTING_7008); `ramp_split` drops line selections.
- **Ramp re-runs its AUTOMATIC coding after an edit** (seen 2026-10-17: a Class-only write reset Department on 4 rows and Category +
  Department on 2 rows of 250, source AUTOMATIC). After ANY write, re-read Category, Department, Class and Vendor on the row and
  restore anything Ramp changed — verifying only the field you wrote is not enough.
- **Class options get renamed - resolve class by UUID, never by name (2026-10-29).** Ramp renamed option 18f801bb "Alpha Miami Beach" to
  "Alpha Miami Beach (71st St)" and 68792a8d "Alpha Miami Beach (Biarritz)" to plain "Alpha Miami Beach", so the plain name now points at the
  ex-Biarritz site. `cardholder_class.txt` names can go stale but its UUIDs stay right: write the UUID, pull `/accounting/field-options`
  (`ramp_id`) fresh before every pass, and treat a memo saying "Miami Beach" as the 71st St school unless it says Biarritz.
- **Rules the reviewers judged too broad** (bare london, material, staff, doordash, open, parent, merch, roar, buildout and the
  2026-09-28 mismatch patterns) defer to the precedent chain.
- **New keywords (Dania 2026-09-30)**: every pass mines the memos no rule reached into candidate rules backed by synced precedent;
  strong candidates go into Ladder-1 the same day with a column-I note, weak ones to the "Proposed" tab. Candidates must respect the
  playbook table above (a travel word is never mined into Workshops again).
- **Marking ready in bulk**: REST `POST /accounting/ready-to-sync` `{object_ids:[≤500], object_type:"TRANSACTION"}`; bisect on error.
- `tools/build_precedent_maps.mjs <precedents.json> <ramp_option_uuids.json>` extends the two map files from synced 2026 history;
  existing curated lines are kept; "Summer Camp" is replaced by the category's year-round department. **Run it only after the
  synced history reflects the playbook** — otherwise it re-imports the old Workshops / Tangible travel codings.

## 5. Open decisions for Dania (2026-10-17)

1. ~~Central staff and Ops fallback class~~ — decided 2026-10-23: central staff → `Central`, Ops team → `Alpha School LLC` (section 1 step 5).
2. GT cardholders → `Central` is applied (2,338 synced rows went to GT School Georgetown in 2026) — confirm.
3. ~~The 250 Teamroom class overrides of 2026-10-16~~ — reverted 2026-10-17 on Dania's instruction (all 250 restored and verified).
4. Classes missing in Ramp: Alpha Winter Park, Marketing, Alpha Redmond, Alpha Sausalito, Alpha Marin County, Unbound, and a class
   for the "Alpha Anywhere" online programme (decision 2, 2026-10-23).
5. Build-out buyers beyond the six Ops names (Aaron Crute, Andrew Jordan, Andrea Ewalefo, Alice Lee, Creighton North, Samuel Anderson,
   Taraya Voelker, Tara Stephenson, Kevin Kongslie, Greg Foote, Althea Kearney): their capitalised travel / meals now code to Travel.
   Add any of them to the Ops list if Finance treats them as Ops.
6. Duplicates and $1,000+ lines are now coded but not staged — relax if too many rows pile up in Needs review.

## 6. The daily run (desktop scheduled task `ramp-qb-coding-daily`, since 2026-10-29)

- **When**: every day at 12:15 PM Pakistan (cron 12:05 + the app's ~10-minute dispatch delay), while Dania's Claude desktop app is
  open; a missed run fires at the next launch. Saved in Auto mode (2026-10-30) so it needs no approvals; Dania can also start it
  with "Run now" on the task's page. Code: Projects/Ramp-Daily (README.md there is the operating manual; prompt in
  .claude/scheduled-tasks/ramp-qb-coding-daily/SKILL.md).
- **What it does**: (1) `plan` pulls every never-synced Needs-review row (Ramp date from 1 Sep 2026) and the repayments list over
  REST, refreshes the field options and the synced-history precedent snapshot, codes every row by this repo's precedence
  (cardholder_rulings → Ladder-1 → precedent chain with the two map files → Ramp current; playbook overlay; class ladder with
  cardholder_class.txt by UUID) and writes slices; (2) subagents write Category + Department + Class in one call per row through
  the Ramp connector (`ramp_edit_transaction`; REST cannot write header coding) — memo-based class moves go to a reviewer agent
  first (move vs keep, decision 4 and the traps in section 1); (3) `verify` re-reads every written row; (4) `stage` re-checks each
  candidate live and marks Ready to Sync by the gate in section 4; (5) `report` writes
  Projects/RAMP/reviews/Ramp_daily_run_<date>.csv (every row with an Object column = Card / Reimbursement, its coding, basis, holds,
  repayment status and gate result) and a short message.
- **Never**: syncs to QuickBooks (Dania clicks Sync all), writes or passes a memo (placeholders stay blank), edits a synced row,
  changes this repo, config.json or any Ramp setting. Reimbursements ARE in scope since 2026-10-30 (Dania: "add reimbursements to the
  daily run too"; they had been excluded on 2026-10-29): `plan` pulls never-synced approved reimbursements, writes go through
  `ramp_edit_reimbursement` (r_slice / rjudge_batch files), staging uses object_type REIMBURSEMENT; PENDING / REJECTED never.
- **Held rows in the report**: no memo / no receipt after the cutoff, disputed, personal-looking, several campuses, incomplete
  coding; listed with the ≥ $1,000 rows, possible duplicates, kept judge rows and any memo no rule reached (for Ladder-1).
- **Repayments over REST**: `GET /repayments` needs scope `repayments:read`; Dania added it to the API client on 2026-10-30 and the
  pipeline now names its scopes explicitly in the token request (Ramp grants only a default set when none are named). 752 originals
  with a repayment status were visible that night; the 5 in the queue (AWAITING_PAYMENT, no receipt) were staged under the
  month-end rule. If the call ever fails again the run logs "repayments unavailable" and applies the ordinary rule.
- **Known gap**: cardholders missing from cardholder_class.txt keep their Ramp class (listed as "cardholder not in file").
- **Changing it**: rules live in this repo (the run reads the files fresh each day); the window / cutoff days and scan window live in
  Ramp-Daily/config.json; the schedule and prompt in the scheduled task. Dania approves every such change first.

## File formats

### memo_keyword_rules.txt
Generated from the Google Sheet **"Ramp Rule Book - Final"**, tab **Ladder-1** (the source of truth; do not hand-edit the file).
Regenerate with `node tools/build_memo_keyword_rules.mjs` (needs `Projects\GSheets\credentials.json` and `Projects\RAMP\.env`
next to this repo), review the diff, commit, push. The script also validates the sheet: priority must equal 5 − keyword-cell
count, no duplicate keyword sets, every Category/Department must exist in Ramp.

Format: `Priority|Keyword 1|Keyword 2|Keyword 3|Keyword 4|CategoryOptionUUID/DepartmentOptionUUID|Category name|Department name|Ladder-1 row|Source note`

Matching: lower-case the memo and replace every non-alphanumeric character with a space. A keyword cell lists variants
separated by ` / ` (plurals, spellings, phrases) and matches when ANY variant appears as a whole word/phrase. A rule fires only
when ALL its non-empty keyword cells match. Lowest Priority number wins (1 = 4 keywords … 4 = 1 keyword). Ties at the winning
priority with different Category → precedent chain, else first rule + note (section 4). Case is ignored.

### merchant_map.txt
One line per (Category/Department) combo: `<CategoryOptionUUID>/<DepartmentOptionUUID>|merchant1;merchant2;...`
Merchant match is exact after lower-casing. Memo keywords and cardholder+merchant rules take priority over this file.

### cardholder_merchant_map.txt
`Cardholder|Merchant|CategoryOptionUUID/DepartmentOptionUUID|Category name|Department name` — match cardholder (first + last
token, case-insensitive) AND merchant (exact, case-insensitive).

### cardholder_rulings.txt
`Cardholder|mode|Default Category|Default Department|note` - per-cardholder rulings applied before Ladder-1 for that cardholder only.
`history-first` = code from the cardholder's own synced history (cardholder + merchant ≤100 days → 2026 → cardholder usual), else the
default; class still follows the ladder. One line today: MacKenzie Price (2026-10-29).

### cardholder_class.txt
`Cardholder|QuickBooks Class name|Class option UUID` — the **fallback** class per cardholder (playbook A1 step 6), derived from the
"Active contractors" Google Sheet (Teamroom column) → exact QuickBooks Class name; GT / Unbound / World Ventures cardholders →
Central. Cardholders in neither fall back to Ramp location. Regenerate whenever the sheet changes (keep the Central overrides).

### class_options.txt
`Class name|Class option UUID|active` — all QuickBooks Class options as they exist in Ramp, for validating names and resolving UUIDs
(regenerated 2026-10-17; 108 options, 100 active).

### Teamroom → QuickBooks Class translation (non-literal names)
Austin Spyglass → Austin K-8 · Austin CO2 / Austin High School → Alpha High School · Central, EDU.COO/CFO/finance/real estate →
Central (Ops team only: Alpha School LLC; Dania 2026-10-23) · New York → Alpha Anywhere Center · Oklahoma City → Alpha Oklahoma City (Reno) · Woodlands → Alpha The Woodlands ·
Founders → Founders Hub · TSA.Lakeway → Texas Sports Academy · GT.Georgetown → Central (never GT School Georgetown) · PAM.HISD → HISD ·
Phoenix → Alpha Scottsdale · Brownsville → Brownsville K-8 · Redmond → Alpha Kirkland · Orlando → Alpha Orlando (Winter Park pending).
Otherwise `EDU.School.Alpha.<Location>.<Level>.<Mode>` → `Alpha <Location>`.
