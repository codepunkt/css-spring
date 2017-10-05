import spring from './index'

describe('css-spring', () => {
  test('matches snapshots', () => {
    expect(
      spring(
        `
    left: calc(10px + 10rem);
    opacity: .5;
    padding: 50rem 0em 10px 10rem;
    transform: translate(10px 3em) rotate(25deg) scale(.5);
    border: 1px solid #00f;
  `,
        `
    left: calc(200px + 0rem);
    opacity: 1;
    padding: -200rem 10em 0px 20rem;
    transform: translate(5px 2em) rotate(15deg) scale(1);
    border: 3px solid #ff0000;
  `
      )
    ).toMatchSnapshot()

    expect(
      spring(`border: 1px solid #00f;`, `border: 25px solid #bada55;`, {
        precision: 5,
        keyframePrecision: 3,
      })
    ).toMatchSnapshot()

    expect(
      spring(`border: 1px dashed #00f;`, `border: 25px solid #bada55;`)
    ).toMatchSnapshot()
  })
})
