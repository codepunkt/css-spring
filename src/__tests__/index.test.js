import spring from '../index'
import { initCache } from '../cache'

describe('css-spring', () => {
  test('matches snapshots', () => {
    expect(
      spring({ opacity: 0 }, { opacity: 1 })
    ).toMatchSnapshot()

    expect(
      spring(
        { 'padding-left': -50 },
        { 'padding-left': 50 },
        { preset: 'wobbly', precision: 5 }
      )
    ).toMatchSnapshot()

    expect(
      spring(
        { 'padding-left': -50, 'opacity': true, 'margin-right': 0 },
        { 'padding-left': 50, opacity: 1, 'margin-right': 127 },
        { preset: 'gentle', damping: 50, stiffness: 80 }
      )
    ).toMatchSnapshot()
  })
})
