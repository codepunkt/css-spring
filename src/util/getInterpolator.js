const springer = require('springer').default

export const toSixDigits = hex =>
  hex.length === 3
    ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    : hex

export const interpolateColor = (a, b, amount) => {
  a = toSixDigits(a)
  b = toSixDigits(b)

  const ah = parseInt(a.replace(/#/g, ''), 16)
  const ar = ah >> 16,
    ag = (ah >> 8) & 0xff,
    ab = ah & 0xff
  const bh = parseInt(b.replace(/#/g, ''), 16)
  const br = bh >> 16,
    bg = (bh >> 8) & 0xff,
    bb = bh & 0xff
  const rr = ar + amount * (br - ar)
  const rg = ag + amount * (bg - ag)
  const rb = ab + amount * (bb - ab)

  return (
    '#' + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
  )
}

const getInterpolator = (tension, wobble, steps) => {
  const spring = springer(tension, wobble)

  return {
    fixed: value => [...Array(steps + 1)].map(_ => value),
    number: (start, end) =>
      [...Array(steps + 1)].map(
        (_, i) => start + (end - start) * spring(i / steps)
      ),
    hex: (start, end) =>
      [...Array(steps + 1)].map((_, i) =>
        interpolateColor(start, end, spring(i / steps))
      ),
  }
}

export default getInterpolator
