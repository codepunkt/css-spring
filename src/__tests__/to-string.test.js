import { reduceProperties, toString } from '../to-string'

describe('format', () => {
  test('reduceProperties invokes formatter for each prop', () => {
    const formatter = jest.fn()

    reduceProperties({
      'padding-right': '12px',
      'padding-left': '12px',
    }, formatter)

    expect(formatter.mock.calls.length).toEqual(2)
  })

  test('reduceProperties returns reduced prop string', () => {
    expect(
      reduceProperties({
        'padding-right': '12px',
        'padding-left': '12px',
      })
    ).toEqual(
      'padding-right:12px;padding-left:12px;'
    )
  })

  test('format returns css string', () => {
    const formatter = jest.fn().mockImplementation((k, v) => `${k}:${v};`)
    const formatted = toString({
      '0%': { opacity: 0, left: '20px' },
      '100%': { opacity: 1, left: '200px' },
    }, formatter)

    expect(formatted).toEqual('0%{opacity:0;left:20px;}100%{opacity:1;left:200px;}')
    expect(formatter.mock.calls.length).toEqual(4)
  })
})
