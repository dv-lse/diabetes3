import {h} from 'virtual-dom'

import loop from './main-loop'

import Slider from './slider'

import 'styles.css!'

// state

let state = {
  metric1: Slider()
}

// view

const fmt = (d) => '' + d

function render(state) {
  return h('div.contents', [
    Slider.render(state.metric1, fmt, 'Metric 1')
  ])
}

// main loop

loop( () => render(state) )
