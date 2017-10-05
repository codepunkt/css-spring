import React from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'
import spring from 'css-spring'

const start = `transform: translateX(0px);`
const end = `transform: translateX(100px);`

const AnimateWrapper = styled.div`
  height: 60px;
  width: 60px;
  background: #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  margin: 5px;
  font-weight: bold;
  border: 1px solid #ccc;
  animation: ${({ tension, wobble }) =>
      keyframes`${spring(start, end, { tension, wobble })}`}
    2s linear infinite;
`

const AnimateRowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-right: 175px;
`

const AnimateRow = ({ wobble }) =>
  <AnimateRowWrapper>
    {[...new Array(11)].map((v, i) =>
      <Animate tension={i / 10} wobble={wobble} />
    )}
  </AnimateRowWrapper>

const Animate = ({ tension, wobble }) =>
  <AnimateWrapper tension={tension} wobble={wobble}>
    <div>
      t {tension}
    </div>
    <div>
      w {wobble}
    </div>
  </AnimateWrapper>

const Matrix = () =>
  React.Children.toArray([
    <AnimateRow wobble={0} />,
    <AnimateRow wobble={0.1} />,
    <AnimateRow wobble={0.2} />,
    <AnimateRow wobble={0.3} />,
    <AnimateRow wobble={0.4} />,
    <AnimateRow wobble={0.5} />,
    <AnimateRow wobble={0.6} />,
    <AnimateRow wobble={0.7} />,
    <AnimateRow wobble={0.8} />,
    <AnimateRow wobble={0.9} />,
    <AnimateRow wobble={1} />,
  ])

ReactDOM.render(<Matrix />, document.querySelector('#app'))
