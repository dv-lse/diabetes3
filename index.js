import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import loop from './main-loop'

import Slider from './slider'

import 'styles.css!'

const METRICS = [ 'metric1', 'metric2', 'metric3' ]

// state

let state = {
}

METRICS.forEach( (m) => state[m] = Slider() )

// view

function render(state) {
  return h('div.weights',
    METRICS.map( (metric) => Slider.render(state[metric], metric) )
  )
/*
  [
    Slider.render(state.metric1, fmt, 'Metric 1'),
    svg('svg', {width: 800, height: 600},
      svg('circle', {cx: 400, cy: 300, r: state.metric1.value * 3, fill: 'pink'})
    )
  ])
*/
}

// main loop

loop( () => render(state) )
