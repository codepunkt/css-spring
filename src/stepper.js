// Taken from react-motion
// @see https://github.com/chenglou/react-motion/blob/master/src/stepper.js
const reusedTuple = [ 0, 0 ]

// eslint-disable-next-line max-params
const stepper = (secondPerFrame, x, v, destX, k, b, precision = 0.01) => {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  const Fspring = -k * (x - destX)

  // Damping, in kg / s
  const Fdamper = -b * v

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  const a = Fspring + Fdamper

  const newV = v + (a * secondPerFrame)
  const newX = x + (newV * secondPerFrame)

  stepper.count += 1

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX
    reusedTuple[1] = 0
    return reusedTuple
  }

  reusedTuple[0] = newX
  reusedTuple[1] = newV
  return reusedTuple
}

stepper.count = 0
export default stepper
