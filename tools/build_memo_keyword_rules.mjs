// Regenerates memo_keyword_rules.txt from the Google Sheet "Ramp Rule Book - Final", tab Ladder-1.
// Run locally (needs Projects\GSheets\credentials.json for the sheet and Projects\RAMP\.env for Ramp REST):
//   node tools/build_memo_keyword_rules.mjs
// Then review `git diff memo_keyword_rules.txt`, commit and push. The cloud routine reads the pushed file.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const PROJECTS = join(HERE, '..', '..')
const g = await import('file:///' + join(PROJECTS, 'GSheets', 'gsheets.mjs').replace(/\\/g, '/'))
const ramp = await import('file:///' + join(PROJECTS, 'RAMP', 'ramp-client.mjs').replace(/\\/g, '/'))

const SHEET_ID = '1j3lN8nGfYp-YuIhiFcK0xVpdZVfnfQzrgQy1TFdSC-E'
const CATEGORY_FIELD = 'afb1e8df-773e-49e0-9c25-f6ae7f97876e'
const DEPARTMENT_FIELD = '95bebd93-094f-4d5f-9104-59c07cbc118e'
const t = v => String(v ?? '').trim()

// 1. option name -> Ramp option UUID (ramp_id), live from Ramp
async function options(fieldId) {
  const map = new Map()
  let url = `/accounting/field-options?field_id=${fieldId}&page_size=100`
  while (url) { const r = await ramp.rampFetch(url); for (const o of r.data || []) map.set(t(o.value), { uuid: o.ramp_id, active: o.is_active }); url = r.page?.next || null }
  return map
}
const [cats, deps] = await Promise.all([options(CATEGORY_FIELD), options(DEPARTMENT_FIELD)])
console.log(`Ramp options: ${cats.size} categories, ${deps.size} departments`)

// 2. Ladder-1 rows
const raw = await g.read(SHEET_ID, "'Ladder-1'!A1:I")
const rules = []
const problems = []
for (let i = 1; i < raw.length; i++) {
  const r = raw[i]; const row = i + 1
  const k = [r[0], r[1], r[2], r[3]].map(t)
  if (!k.some(Boolean)) continue
  const priority = Number(r[5]); const category = t(r[6]); const department = t(r[7]); const note = t(r[8])
  const c = cats.get(category); const d = deps.get(department)
  if (!Number.isInteger(priority) || priority < 1 || priority > 4) { problems.push(`row ${row}: bad priority "${r[5]}"`); continue }
  if (k.filter(Boolean).length !== 5 - priority) problems.push(`row ${row}: ${k.filter(Boolean).length} keyword cells but priority ${priority} (expected ${5 - k.filter(Boolean).length})`)
  if (!c) { problems.push(`row ${row}: category "${category}" not found in Ramp`); continue }
  if (!d) { problems.push(`row ${row}: department "${department}" not found in Ramp`); continue }
  if (!c.active || !d.active) problems.push(`row ${row}: inactive option (${!c.active ? category : department})`)
  rules.push({ row, priority, k, category, department, cu: c.uuid, du: d.uuid, note })
}
// duplicate keyword sets
const seen = new Map()
for (const r of rules) { const key = r.k.filter(Boolean).map(x => x.toLowerCase()).sort().join('|'); if (seen.has(key)) problems.push(`rows ${seen.get(key)} and ${r.row}: duplicate keyword set`); else seen.set(key, r.row) }
rules.sort((a, b) => a.priority - b.priority || a.row - b.row)

const header = [
  `# Memo keyword rules for Ramp -> QuickBooks coding. GENERATED ${new Date().toISOString().slice(0, 10)} from Google Sheet "Ramp Rule Book - Final" (${SHEET_ID}), tab Ladder-1, ${rules.length} rules.`,
  '# Do not hand-edit: change the sheet, then run tools/build_memo_keyword_rules.mjs and push.',
  '# Format: Priority|Keyword 1|Keyword 2|Keyword 3|Keyword 4|CategoryOptionUUID/DepartmentOptionUUID|Category name|Department name|Ladder-1 row|Source note',
  '# Matching: lower-case the memo, replace every non-alphanumeric character with a space. A keyword cell lists spelling/plural variants',
  '#   separated by " / "; the cell matches when ANY variant appears as a whole word or whole phrase. A rule fires only when ALL of its',
  '#   non-empty keyword cells match. Case is ignored. Among firing rules the LOWEST Priority number wins (1 = 4 keywords ... 4 = 1 keyword).',
  '#   If rules tie at the winning priority with different Category -> do NOT code, leave in Needs review. Same Category, different',
  '#   Department -> code the Category and leave Department for review. No memo or placeholder memo ("Finance - NA") -> never code.',
  '# Precedence in the coding routine: THIS FILE > cardholder_merchant_map.txt > merchant_map.txt > Needs review.',
  `# Tracking categories: Category=${CATEGORY_FIELD} Department=${DEPARTMENT_FIELD}`,
]
const lines = rules.map(r => [r.priority, ...r.k, `${r.cu}/${r.du}`, r.category, r.department, r.row, r.note.replace(/\|/g, '/')].join('|'))
writeFileSync(join(HERE, '..', 'memo_keyword_rules.txt'), [...header, ...lines].join('\n') + '\n')
console.log(`wrote memo_keyword_rules.txt: ${rules.length} rules; by priority`, rules.reduce((a, r) => (a[r.priority] = (a[r.priority] || 0) + 1, a), {}))
if (problems.length) { console.log(`\n${problems.length} problem(s) in Ladder-1 (rows skipped or flagged):`); problems.forEach(p => console.log('  ' + p)) } else console.log('no problems found in Ladder-1')
