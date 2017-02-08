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
          background: '#bada55',
        },
        {
          'padding-left': '50px',
          background: '#f00',
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
          border: '1px solid #f00',
        },
        {
          'padding-left': '50px',
          opacity: 1,
          'margin-right': '127em',
          border: '10px solid #f00',
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
