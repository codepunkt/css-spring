import spring from '../index'

describe('css-spring', () => {
  test('matches snapshots', () => {
    expect(
      spring(
        {
          opacity: 0,
        }, {
          opacity: 1,
        })
    ).toMatchSnapshot()

    expect(
      spring(
        {
          'padding-left': '-50px',
        },
        {
          'padding-left': '50px',
        },
        {
          preset: 'wobbly',
          precision: 5,
        }
      )
    ).toMatchSnapshot()

    expect(
      spring(
        {
          'padding-left': '-50rem',
          opacity: true,
          'margin-right': '0em',
        },
        {
          'padding-left': '50px',
          opacity: 1,
          'margin-right': '127em',
        },
        {
          preset: 'gentle',
          damping: 50,
          stiffness: 80,
        }
      )
    ).toMatchSnapshot()
  })
})
