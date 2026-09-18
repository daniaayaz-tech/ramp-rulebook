# Ramp Coding Rulebook data (for the ramp-qb-coding-daily routine)

`merchant_map.txt` — one line per (Category/Department) combo:
`<CategoryOptionUUID>/<DepartmentOptionUUID>|merchant1;merchant2;...`

Generated from Ramp_Coding_Rulebook_v5.xlsx (Merchant Fallback sheet), mapped to QuickBooks tracking-category option UUIDs. The daily coding routine clones this repo and greps this file for each transaction's merchant (memo keywords take priority over merchant).

## cardholder_class.txt
`Cardholder|QuickBooks Class name|Class option UUID` — Class per cardholder, derived from the "Active contractors" Google Sheet (Teamroom column) → exact QuickBooks Class name. Teamroom wins over the reference xlsx; cardholders in neither fall back to Ramp location. Regenerate whenever the sheet changes.

## class_options.txt
`Class name|Class option UUID|active` — all QuickBooks Class options as they exist in Ramp, for validating names and resolving UUIDs.

## Teamroom → QuickBooks Class translation (non-literal names)
Austin Spyglass → Austin K-8 · Austin CO2 / Austin High School → Alpha High School · Central, EDU.COO/CFO/… → Alpha School LLC · New York → Alpha Anywhere Center · Oklahoma City → Alpha Oklahoma City (Reno) · Woodlands → Alpha The Woodlands · Founders → Founders Hub · TSA.Lakeway → Texas Sports Academy · GT.Georgetown → GT School Georgetown · PAM.HISD → HISD · Phoenix → Alpha Scottsdale · Brownsville → Brownsville K-8. Otherwise `EDU.School.Alpha.<Location>.<Level>.<Mode>` → `Alpha <Location>`.
