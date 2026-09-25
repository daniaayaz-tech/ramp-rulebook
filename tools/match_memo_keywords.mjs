// Reference matcher for memo_keyword_rules.txt (the same algorithm the QC runs used).
//   import { loadRules, matchMemo } from './tools/match_memo_keywords.mjs'
//   const rules = loadRules('memo_keyword_rules.txt')
//   matchMemo('Workshop Supplies for L4', rules)
//   -> { status: 'coded', category, department, categoryUuid, departmentUuid, priority, rows: [..], fired: [...] }
//   -> { status: 'tie', ... }            same priority, different Category: do NOT code
//   -> { status: 'department-tie', ... } same Category, different Department: code Category only
//   -> { status: 'no-rule' } | { status: 'no-memo' }
// CLI: node tools/match_memo_keywords.mjs "memo text"
import { readFileSync } from 'node:fs'

export const normalise = memo => ' ' + String(memo || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' '
export const isPlaceholder = memo => !String(memo || '').trim() || /^finance\s*-?\s*na$/i.test(memo) || /finance updated memo/i.test(memo)

export function loadRules(path) {
  const rules = []
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue
    const p = line.split('|')
    const cells = [p[1], p[2], p[3], p[4]].map(s => s.trim()).filter(Boolean)
    const [categoryUuid, departmentUuid] = p[5].split('/')
    rules.push({
      priority: Number(p[0]), cells, categoryUuid, departmentUuid, category: p[6], department: p[7], row: Number(p[8]), note: p[9] || '',
      regexes: cells.map(cell => new RegExp(' (?:' + cell.split('/').map(v => normalise(v).trim()).filter(Boolean).join('|') + ') ')),
    })
  }
  return rules
}

export function matchMemo(memo, rules) {
  if (isPlaceholder(memo)) return { status: 'no-memo' }
  const m = normalise(memo)
  const fired = rules.filter(r => r.regexes.every(re => re.test(m)))
  if (!fired.length) return { status: 'no-rule' }
  const best = Math.min(...fired.map(r => r.priority))
  const top = fired.filter(r => r.priority === best)
  const cats = new Set(top.map(r => r.categoryUuid)), deps = new Set(top.map(r => r.departmentUuid))
  const base = { priority: best, rows: top.map(r => r.row), fired: fired.map(r => ({ row: r.row, priority: r.priority, cells: r.cells, category: r.category, department: r.department })) }
  if (cats.size > 1) return { status: 'tie', ...base, options: top.map(r => `${r.category} / ${r.department}`) }
  const r = top[0]
  if (deps.size > 1) return { status: 'department-tie', category: r.category, categoryUuid: r.categoryUuid, departmentOptions: [...new Set(top.map(x => x.department))], ...base }
  return { status: 'coded', category: r.category, department: r.department, categoryUuid: r.categoryUuid, departmentUuid: r.departmentUuid, ...base }
}

if (process.argv[1] && process.argv[1].endsWith('match_memo_keywords.mjs') && process.argv[2]) {
  const rules = loadRules(new URL('../memo_keyword_rules.txt', import.meta.url))
  console.log(JSON.stringify(matchMemo(process.argv.slice(2).join(' '), rules), null, 1))
}
