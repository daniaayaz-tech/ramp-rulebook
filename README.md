# Ramp Coding Rulebook data (for the ramp-qb-coding-daily routine)

`merchant_map.txt` — one line per (Category/Department) combo:
`<CategoryOptionUUID>/<DepartmentOptionUUID>|merchant1;merchant2;...`

Generated from Ramp_Coding_Rulebook_v5.xlsx (Merchant Fallback sheet), mapped to QuickBooks tracking-category option UUIDs. The daily coding routine clones this repo and greps this file for each transaction's merchant (memo keywords take priority over merchant).
