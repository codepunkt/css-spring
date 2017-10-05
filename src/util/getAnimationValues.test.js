import getAnimationValues, { getLastPropertyValue } from './getAnimationValues'

describe('getLastPropertyValue', () => {
  test('gets the children of the last property value', () => {
    expect(
      getLastPropertyValue(
        [
          {
            property: 'left',
            value: { children: { toArray: () => [1, 2, 3] } },
          },
          {
            property: 'left',
            value: { children: { toArray: () => [4, 5, 6] } },
          },
          {
            property: 'left',
            value: { children: { toArray: () => [7, 8, 9] } },
          },
        ],
        'left'
      )
    ).toEqual([7, 8, 9])
  })
})

describe('getAnimationValues', () => {
  test('gets', () => {
    expect(
      getAnimationValues(
        [
          {
            property: 'left',
            value: { children: { toArray: () => [1, 2, 3] } },
          },
        ],
        [
          {
            property: 'left',
            value: { children: { toArray: () => [4, 5, 6] } },
          },
        ]
      )
    ).toEqual({ left: { start: [1, 2, 3], end: [4, 5, 6] } })
  })
})
