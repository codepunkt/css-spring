import format, { reduceProperties } from '../format'

describe('format', () => {
  test('has formatters for em, rem and px', () => {
    expect(format.EM_FORMATTER)
      .toEqual(expect.any(Function))
    expect(format.REM_FORMATTER)
      .toEqual(expect.any(Function))
    expect(format.PX_FORMATTER)
      .toEqual(expect.any(Function))
  })

  test('em formatter works', () => {
    expect(format.EM_FORMATTER('margin-left', '42'))
      .toEqual('margin-left:42em;')
    expect(format.REM_FORMATTER('margin-left', '42'))
      .toEqual('margin-left:42rem;')
    expect(format.PX_FORMATTER('margin-left', '42'))
      .toEqual('margin-left:42px;')
  })

  test('reduceProperties invokes formatter for each prop', () => {
    const formatter = jest.fn()

    reduceProperties({
      'padding-right': '12',
      'padding-left': '12',
    }, formatter)

    expect(formatter.mock.calls.length).toEqual(2)
  })

  test('reduceProperties returns reduced prop string', () => {
    expect(
      reduceProperties({
        'padding-right': '12',
        'padding-left': '12'
      }, format.PX_FORMATTER)
    ).toEqual(
      'padding-right:12px;padding-left:12px;'
    )
  })

  test('format returns css string', () => {
    const formatter = jest.fn().mockImplementation((k, v) => `${k}:${v};`)
    const formatted = format({ '0%': { opacity: 0 }, '100%': { opacity: 1 } }, formatter)

    expect(formatted).toEqual('0%{opacity:0;}100%{opacity:1;}')
    expect(formatter.mock.calls.length).toEqual(2)
  })
})
