// Regenerates the two README figures, light and dark:  node make-figures.mjs
//
// They are generated rather than exported so the numbers stay editable: change
// a count below and the SVG follows, instead of the figure drifting out of
// sync with the text the way a baked PNG would.
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const OUT = fileURLToPath(new URL('./assets/', import.meta.url))
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

// Brand tokens. Cyan carries information, coral carries action, exactly as on
// the site. Everything else is GitHub's own palette so the figure sits in the
// page instead of on top of it.
//
// Light mode does NOT reuse the brand accents: #22d3ee is 1.8:1 on white and
// #fb4d3d is 3.4:1, both under AA. The darker pair clears 4.5:1.
const T = {
  dark: { ink: '#e6edf3', muted: '#8b949e', line: '#30363d', panel: '#161b22', cyan: '#22d3ee', coral: '#fb4d3d' },
  light: { ink: '#1f2328', muted: '#59636e', line: '#d1d9e0', panel: '#f6f8fa', cyan: '#0b7285', coral: '#c2321f' },
}

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif"
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── Figure 1: the loop ───────────────────────────────────────────────────────
const STAGES = [
  { n: '01', title: 'Field research', lines: ['Interviews inside real', 'clinics, not a lab'] },
  { n: '02', title: 'Design & systems', lines: ['Figma: variables with', 'modes, components'] },
  { n: '03', title: 'Directed build', lines: ['My calls, Claude Code', 'writes the code'] },
  { n: '04', title: 'Adoption', lines: ['Demos, sales, and what', 'people do next'] },
]

function loop(theme) {
  const c = T[theme]
  const W = 880, H = 186, pad = 8
  const colW = (W - pad * 2 - 30 * 3) / 4
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Four stages: field research, design and systems, directed build, adoption.">
<style>text{font-family:${FONT}}</style>`

  STAGES.forEach((st, i) => {
    const x = pad + i * (colW + 30)
    const isLast = i === STAGES.length - 1
    // The last stage is coral because that is where the work lands.
    const accent = isLast ? c.coral : c.cyan

    s += `\n<rect x="${x}" y="30" width="${colW}" height="${H - 46}" rx="10" fill="${c.panel}" stroke="${c.line}"/>`
    s += `\n<rect x="${x + 1}" y="30" width="${colW - 2}" height="3" rx="1.5" fill="${accent}"/>`
    s += `\n<text x="${x + 18}" y="66" font-size="12" font-weight="700" fill="${accent}" letter-spacing="1.4">${st.n}</text>`
    s += `\n<text x="${x + 18}" y="94" font-size="16" font-weight="700" fill="${c.ink}">${esc(st.title)}</text>`
    st.lines.forEach((ln, j) => {
      s += `\n<text x="${x + 18}" y="${119 + j * 18}" font-size="13" fill="${c.muted}">${esc(ln)}</text>`
    })

    if (!isLast) {
      const cx = x + colW + 8, cy = H / 2 + 8
      s += `\n<path d="M${cx} ${cy} h12" stroke="${c.line}" stroke-width="2" stroke-linecap="round"/>`
      s += `\n<path d="M${cx + 10} ${cy - 4} l5 4 -5 4" fill="none" stroke="${c.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
    }
  })

  s += `\n<text x="${pad}" y="16" font-size="12" font-weight="600" fill="${c.muted}" letter-spacing="1.2">FROM FIELD RESEARCH TO ADOPTION</text>`
  return s + `\n</svg>\n`
}

// ── Figure 2: the four published design systems ──────────────────────────────
// Counts are the ones in each file's own public description on Figma
// Community. Cite them exactly; never round.
const SYSTEMS = [
  { name: 'PickPal', vars: '374 variables', comps: '28 component sets', note: 'Own product' },
  { name: 'Wallapop Meet', vars: '349 variables', comps: '39 components', note: 'Unofficial concept' },
  { name: 'FlySplit', vars: '186 variables', comps: '44 components', note: "Master's thesis" },
  { name: 'World Press Photo', vars: '178 variables', comps: '33 components', note: 'Student concept' },
]

function systems(theme) {
  const c = T[theme]
  const W = 880, H = 150, pad = 8
  const colW = (W - pad * 2 - 16 * 3) / 4
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Four design systems published on Figma Community: PickPal, Wallapop Meet, FlySplit and World Press Photo, with their variable and component counts.">
<style>text{font-family:${FONT}}</style>`

  SYSTEMS.forEach((sy, i) => {
    const x = pad + i * (colW + 16)
    s += `\n<rect x="${x}" y="30" width="${colW}" height="${H - 46}" rx="10" fill="${c.panel}" stroke="${c.line}"/>`
    s += `\n<text x="${x + 16}" y="58" font-size="10" font-weight="700" fill="${c.muted}" letter-spacing="1.1">${esc(sy.note.toUpperCase())}</text>`
    s += `\n<text x="${x + 16}" y="82" font-size="15" font-weight="700" fill="${c.ink}">${esc(sy.name)}</text>`
    s += `\n<text x="${x + 16}" y="104" font-size="12" fill="${c.cyan}">${esc(sy.vars)}</text>`
    s += `\n<text x="${x + 16}" y="121" font-size="12" fill="${c.muted}">${esc(sy.comps)}</text>`
  })

  s += `\n<text x="${pad}" y="16" font-size="12" font-weight="600" fill="${c.muted}" letter-spacing="1.2">DESIGN SYSTEMS AT FIGMA.COM/@JM_FUSTER</text>`
  return s + `\n</svg>\n`
}

for (const theme of ['dark', 'light']) {
  writeFileSync(`${OUT}loop-${theme}.svg`, loop(theme))
  writeFileSync(`${OUT}systems-${theme}.svg`, systems(theme))
}
console.log('4 SVG escritos en assets/')
