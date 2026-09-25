# Ramp Coding Rulebook data (for the ramp-qb-coding-daily routine)

## Precedence (2026-09-25)
`memo_keyword_rules.txt` (Ladder-1 keyword rules) → `cardholder_merchant_map.txt` → `merchant_map.txt` → Needs review.
Class is separate (`cardholder_class.txt`). No memo or placeholder memo → never code.

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
