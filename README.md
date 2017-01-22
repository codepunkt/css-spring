# css-spring 🚀
[![NPM Version](https://img.shields.io/npm/v/css-spring.svg?style=flat&label=NPM%20Version)](http://npm.im/css-spring)
[![Build Status](https://img.shields.io/travis/codepunkt/css-spring.svg?style=flat&label=Build%20Status)](https://travis-ci.org/codepunkt/css-spring)
[![Code Coverage](https://img.shields.io/coveralls/codepunkt/css-spring.svg?style=flat&label=Code%20Coverage)](https://coveralls.io/github/codepunkt/css-spring?branch=master)
[![MIT License](https://img.shields.io/npm/l/css-spring.svg?style=flat&label=License)](http://opensource.org/licenses/MIT)

Generates physics based css-keyframe animations.

```javascript
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
```

![Example image](https://raw.githubusercontent.com/codepunkt/css-spring/master/example.gif)

## TOC

  - [Introduction](#introduction)
  - [Examples](#examples)
    - [styled-components](#styled-components)
  - [API](#api)
    - [spring(start, target, options)](#springstart-target-options)
    - [format(keyframes, formatter)](#formatkeyframes-formatter)

## Introduction

Some introductory text

## Examples

Some example text

### styled-components

styled-components example

## API
### `spring(start, target, options)`
### `format(keyframes, formatter)`
