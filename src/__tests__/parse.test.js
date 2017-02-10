import {
  combine,
  parseHexColor,
  parseNumber,
  parseStyles,
  parseValues,
  split,
} from '../parse'

describe('parse', () => {
  describe('combine', () => {
    test('returns value for unknown props', () => {
      expect(combine('foo', 'bar')).toEqual('bar')
    })
    test('returns value for non-array values', () => {
      expect(combine('border', 'bar')).toEqual('bar')
    })
    test('returns combined value for array values', () => {
      expect(combine('border', [ '1px', 'solid', '#f00' ]))
        .toEqual('1px solid #f00')
    })
  })

  describe('parseStyles', () => {
    test('only parses props that exist in both start and end styles', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { padding: '10px 10px 0 0' })
      ).toEqual([])
    })
    test('only parses props that have the same number of values', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { margin: '10px 0 0' })
      ).toEqual([])
    })
    test('fails parse on equal number of props but different type', () => {
      expect(
        parseStyles({ margin: '0 0 10px 10px' }, { margin: '10px foo 0 0' })
      ).toEqual([])
    })
    test('returns parsed information object', () => {
      expect(
        parseStyles(
          { border: '0 solid #f00', opacity: 0 },
          { border: '10px solid #f00', opacity: 1 }
        )
      ).toEqual([
        { prop: 'border', start: 0, end: 10, unit: 'px' },
        { prop: 'border', fixed: 'solid' },
        { prop: 'border', fixed: '#f00' },
        { prop: 'opacity', start: 0, end: 1, unit: '' },
      ])
    })
  })

  describe('parseValues', () => {
    test('returns fixed when both values are equal', () => {
      expect(parseValues('solid', 'solid')).toEqual({ fixed: 'solid' })
    })
    test('returns rgb colors when both values are colors', () => {
      expect(parseValues('#f00', '#00f'))
        .toEqual({ rgb: [[ 255, 0, 0 ], [ 0, 0, 255 ]]})
    })
    test('returns undefined otherwise', () => {
      expect(parseValues('solid', '1px')).toEqual(undefined)
      expect(parseValues(0, '#f00')).toEqual(undefined)
    })
    test('returns start, end and unit otherwise', () => {
      expect(parseValues('1px', '10px'))
        .toEqual({ start: 1, end: 10, unit: 'px' })
      expect(parseValues(0, 1))
        .toEqual({ start: 0, end: 1, unit: '' })
      expect(parseValues(0, '10rem'))
        .toEqual({ start: 0, end: 10, unit: 'rem' })
      expect(parseValues('0px', 1))
        .toEqual({ start: 0, end: 1, unit: 'px' })
    })
  })

  describe('split', () => {
    test('returns value for unknown props', () => {
      expect(split('foo', 'bar')).toEqual('bar')
    })
    test('returns value for non-splittable values', () => {
      expect(split('border', 'bar')).toEqual('bar')
    })
    test('returns splitted value otherwise', () => {
      expect(split('border', '1px solid #f00'))
        .toEqual([ '1px', 'solid', '#f00' ])
    })
  })

  describe('parseHexColor', () => {
    test('parses hex color shorthand', () => {
      expect(parseHexColor('#f00')).toEqual([ 255, 0, 0 ])
    })
    test('parses hex color', () => {
      expect(parseHexColor('#00ff00')).toEqual([ 0, 255, 0 ])
    })
    test('doesnt parse when not a hex color', () => {
      expect(parseHexColor('wat')).toEqual(undefined)
    })
  })

  describe('parseNumber', () => {
    test('returns undefined when value can not be parsed', () => {
      expect(parseNumber('5.')).toEqual(undefined)
      expect(parseNumber('foo')).toEqual(undefined)
      expect(parseNumber('bar5')).toEqual(undefined)
    })
    test('parses unitless numbers', () => {
      expect(parseNumber('.5')).toEqual({ unit: '', value: 0.5 })
      expect(parseNumber('-.5')).toEqual({ unit: '', value: -0.5 })
      expect(parseNumber('-0.6')).toEqual({ unit: '', value: -0.6 })
      expect(parseNumber('42')).toEqual({ unit: '', value: 42 })
    })
    test('parses numbers with units', () => {
      expect(parseNumber('.75em')).toEqual({ unit: 'em', value: 0.75 })
      expect(parseNumber('-.4rem')).toEqual({ unit: 'rem', value: -0.4 })
      expect(parseNumber('-1.9mm')).toEqual({ unit: 'mm', value: -1.9 })
      expect(parseNumber('1337px')).toEqual({ unit: 'px', value: 1337 })
    })
  })
})
