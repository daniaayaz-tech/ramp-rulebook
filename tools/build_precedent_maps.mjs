// Extend cardholder_merchant_map.txt and merchant_map.txt from QuickBooks-synced 2026 history (Dania 2026-09-29: no memo -> code by
// cardholder + merchant precedent). Existing curated entries are kept; only new keys are appended.
//   node tools/build_precedent_maps.mjs <precedents.json> <ramp_option_uuids.json> [dry]
// precedents.json comes from scratchpad kw3/build_precedents.mjs (cardholder_merchant_recent = last ~100 days, cardholder_merchant = 2026).
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const HERE = dirname(fileURLToPath(import.meta.url)), REPO = join(HERE, '..')
const P = JSON.parse(readFileSync(process.argv[2], 'utf8')), OU = JSON.parse(readFileSync(process.argv[3], 'utf8'))
const DRY = process.argv[4] === 'dry'
const t = v => String(v ?? '').trim(), lc = v => t(v).toLowerCase()
const nameKey = n => { const p = lc(n).replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean); return p.length ? p[0] + ' ' + p[p.length - 1] : '' }
const canon = (v, map) => Object.keys(map).find(n => n.toLowerCase() === lc(v)) || null
// "Summer Camp" is a seasonal department; a year-round map must not carry it. Use the category's standing department instead.
const YEAR_ROUND = { 'Administration:Travel': 'ADM-Travel', 'Program:Workshops': 'All Levels', 'Program:Motivation Model': 'All Levels', 'Administration:Meals and Entertainment': 'ADM-Staff Amenities', 'Administration:Office Supplies': 'ADM-Office supplies', 'Food Services:Lunch Program': 'STU-Lunch', 'Program:Software': 'STA-Staff Software', 'Administration:Marketing': 'MKT-Other Marketing cost', 'Tangible Assets': 'FAC-Buildout', 'Facilities/Support:Repairs and Maintenance': 'FAC-Other facilities cost' }
const fixDept = (cat, dep) => lc(dep) === 'summer camp' ? (YEAR_ROUND[cat] || null) : dep
// --- cardholder + merchant ---
const chmPath = join(REPO, 'cardholder_merchant_map.txt')
const chmLines = readFileSync(chmPath, 'utf8').split('\n')
const have = new Set(); const nameOf = new Map()
for (const l of chmLines) { if (!l || l.startsWith('#')) continue; const p = l.split('|'); if (p.length >= 5) have.add(nameKey(p[0]) + '|' + lc(p[1])) }
// display names for cardholders / merchants come from the synced history keys; rebuild from the precedent source rows is not available here,
// so keep the key form "first last" (title-cased) and the merchant as seen in the key (lower-case) - the matcher lower-cases both sides.
const title = s => s.replace(/\b\w/g, c => c.toUpperCase())
const addChm = []
const pick = (e, min, share) => e && e.n >= min && e.cd_share >= share && e.category && e.department ? e : null
const keys = new Set([...Object.keys(P.cardholder_merchant_recent), ...Object.keys(P.cardholder_merchant)])
for (const k of keys) {
  if (have.has(k)) continue
  const e = pick(P.cardholder_merchant_recent[k], 2, 60) || pick(P.cardholder_merchant[k], 3, 60)
  if (!e) continue
  const cat = canon(e.category, OU.category), dep0 = canon(e.department, OU.department); if (!cat || !dep0) continue
  const dep = fixDept(cat, dep0); if (!dep) continue
  const [ch, mer] = k.split('|')
  addChm.push(`${title(ch)}|${mer}|${OU.category[cat]}/${OU.department[dep]}|${cat}|${dep}`)
  have.add(k)
}
// --- merchant map (grouped by coding) ---
const mmPath = join(REPO, 'merchant_map.txt')
const mmLines = readFileSync(mmPath, 'utf8').split('\n')
const mapped = new Set(); const groups = new Map()
for (const l of mmLines) { if (!l || l.startsWith('#')) continue; const [ids, list] = l.split('|'); if (!list) continue; groups.set(ids, list.split(';').map(t).filter(Boolean)); for (const m of list.split(';')) if (t(m)) mapped.add(lc(m)) }
const addMm = []
for (const [m, e] of Object.entries(P.merchant)) {
  if (mapped.has(m) || e.n < 5 || e.cat_share < 70 || !e.category) continue
  const cat = canon(e.category, OU.category), dep0 = canon(e.department, OU.department); if (!cat || !dep0) continue
  const dep = fixDept(cat, dep0); if (!dep) continue
  const ids = `${OU.category[cat]}/${OU.department[dep]}`
  groups.set(ids, [...(groups.get(ids) || []), m]); addMm.push(`${m} -> ${cat} / ${dep} (${e.cat_share}% of ${e.n})`); mapped.add(m)
}
console.log(`cardholder+merchant: existing ${have.size - addChm.length}, adding ${addChm.length} | merchant map: adding ${addMm.length} merchants`)
if (DRY) { console.log(addChm.slice(0, 8).join('\n')); console.log(addMm.slice(0, 8).join('\n')); process.exit(0) }
const stamp = `# Extended 2026-09-29 from QuickBooks-synced 2026 history (tools/build_precedent_maps.mjs): cardholder+merchant with >=2 synced rows in the last ~100 days or >=3 in 2026, >=60% on one Category/Department. Per Dania: no memo -> code by cardholder + merchant precedent.`
writeFileSync(chmPath, chmLines.filter(l => l !== '').join('\n') + '\n' + stamp + '\n' + addChm.join('\n') + '\n')
const head = mmLines.filter(l => l.startsWith('#'))
writeFileSync(mmPath, [...head, `# Extended 2026-09-29 with merchants that synced >=5 times in 2026 with >=70% on one Category (tools/build_precedent_maps.mjs).`, ...[...groups].map(([ids, list]) => `${ids}|${list.join(';')}`)].join('\n') + '\n')
console.log('written', chmPath, 'and', mmPath)
