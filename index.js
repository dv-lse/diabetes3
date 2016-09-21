import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import loop from './main-loop'

import * as d3 from 'd3'

import Slider from './slider'

import 'styles.css!'

const METRICS = [ 'metric1', 'metric2', 'metric3' ]

const weight_scale = d3.scaleQuantize()
  .domain([0,100])
  .range(d3.range(0,5))

// state

let state = {
}

METRICS.forEach( (m) => state[m] = Slider(weight_scale) )

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
