const toPrecision = (num, precision, unit) =>
  Number(num.toFixed(unit === 'px' ? 0 : precision)).toString()

module.exports = toPrecision
