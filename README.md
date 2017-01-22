# css-spring 🚀

[![NPM Version](https://img.shields.io/npm/v/css-spring.svg?style=flat&label=NPM%20Version)](http://npm.im/css-spring)
[![Build Status](https://img.shields.io/travis/codepunkt/css-spring.svg?style=flat&label=Build%20Status)](https://travis-ci.org/codepunkt/css-spring)
[![Code Coverage](https://img.shields.io/coveralls/codepunkt/css-spring.svg?style=flat&label=Code%20Coverage)](https://coveralls.io/github/codepunkt/css-spring?branch=master)
[![MIT License](https://img.shields.io/npm/l/css-spring.svg?style=flat&label=License)](http://opensource.org/licenses/MIT)

Generate physics based css-keyframe animations.

<table>
<tr>
<td>
   <pre lang="javascript">
import spring, { format } from 'css-spring'

const keyframes = spring(
  { left: 0 },
  { left: 250 },
  { preset: 'wobbly', precision: 5 }
)

const moveLeft = format(
  keyframes,
  format.PX_FORMATTER
)
   </pre>
</td>
<td>
  <img src="https://raw.githubusercontent.com/codepunkt/css-spring/master/example.gif" alt="css-spring example"/>
</td>
</tr>
</table>

## TOC

  - [Introduction](#introduction)
  - [Examples](#examples)
    - [styled-components](#styled-components)
    - [glamor](#glamor)
  - [API](#api)
    - [spring(start, target, options)](#springstart-target-options)
    - [format(keyframes, formatter)](#formatkeyframes-formatter)

## Introduction

Some introductory text

## Examples

This section lists some examples of popular css-in-js libraries such as `styled-components` and `glamor`. If you have additional examples, feel free to add them!

### styled-components

When used with the [styled-components](https://github.com/styled-components/styled-components) `keyframes` helper, generated keyframe animations can be applied to a styled component like this:

```javascript
import spring, { format } from 'css-spring'
import styled, { keyframes } from 'styled-components'

const springLeft = format(spring(
  { left: 50 }, { left: 250 }, { preset: 'gentle' }
))

const StyledDiv = styled.div`
  position: absolute;
  width: 100px;
  height: 50px;
  top: 50px;
  animation: ${keyframes`${springLeft}`} 1s linear infinite;
`
```

### glamor

When used with the `keyframes` method of [glamor](https://github.com/threepointone/glamor), no special formatting is needed for pixel values:

```jsx
import { css } from 'glamor';
import spring from 'css-spring';

const springLeft = css.keyframes('springLeft', spring(
  { left: 50 }, { left: 250 }, { preset: 'gentle' }
));

const MyComponent = () => (
  <div {...css({ animation: `${springLeft} 1s linear infinite` })}>
    gentle
  </div>
)
```

## API
### `spring(start, target, options)`
### `format(keyframes, formatter)`
