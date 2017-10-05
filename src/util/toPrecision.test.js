import toPrecision from './toPrecision'

describe('toPrecision', () => {
  test('returns stringified numbers with the given precision', () => {
    expect(toPrecision(5.53413, 3)).toEqual('5.534')
    expect(toPrecision(5.53493, 3)).toEqual('5.535')
    expect(toPrecision(5.53493, 0)).toEqual('6')
  })

  test('strips trailing zeroes', () => {
    expect(toPrecision(5.53493, 7)).toEqual('5.53493')
    expect(toPrecision(5.53993, 3)).toEqual('5.54')
  })

  test('uses precision 0 when unit is pixels', () => {
    expect(toPrecision(5.53493, 3, 'px')).toEqual('6')
  })
})
