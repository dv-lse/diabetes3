import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'

import * as d3 from 'd3'

import loop from './main-loop'
import Slider from './slider'

import 'styles.css!'

const MARGINS = { top: 15, left: 50, bottom: 30, right: 15 }

// state proper

function App(datasets) {
  let state
  let tripwire = loop(() => {

    // layout computation

    let graph, width, height
    graph = d3.select('.graph-container').node()      // NB does not exist during bootstrap
    if(graph) {
      let rect = graph.getBoundingClientRect()
      width = rect.width
    } else {
      // TODO remove dependency on DOM
      width = window.innerWidth
      tripwire()                                      // render twice during bootstrap
    }
    height = width * 0.7

    return App.render(state, datasets, width, height)
  })

  state = {
    dataset: d3.keys(datasets)[0],
    colors: false,
    rescale: true,
    weights: metrics(datasets).reduce( (o,v) => {
      o[v] = Slider(tripwire, [0,6], 3)
      return o
    }, {}),
    tripwire: tripwire,
    channels: {
      setdataset: (ds) => { state.dataset = ds; tripwire() },
      setcolors: (c) => { state.colors = c; tripwire() },
      setrescale: (rs) => { state.rescale = rs; tripwire() }
    }
  }

  return state
}


// utility

// return a function from metric names to proportional weights
//   (i.e. from 0 to 1)
App.weights = function(raw_weights, metrics) {
  let sum_weights, weights
  if(metrics) { raw_weights = only(metrics, raw_weights) }
  sum_weights = d3.sum( d3.values(raw_weights) )
  weights = mapKeys(raw_weights, (rw) => (rw && sum_weights) ? rw / sum_weights : 0)
  return weights
}


// view

App.render = function(state, datasets, width, height) {
  let all_metrics = metrics(datasets)
  let cur_dataset = datasets[state.dataset]

  let cur_metrics = columns(cur_dataset)
  let slider_values = mapKeys(state.weights, (s) => s.value)
  let weight = App.weights(slider_values, cur_metrics)

  let weight_fmt = d3.format('.0%')

  let stack = d3.stack()
    .keys(cur_metrics)
    .value((d,k) => d[k] * weight[k])
    .order(d3.stackOrderReverse)
    .offset(d3.stackOffsetNone)

  let color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    .domain(all_metrics)

  width -= MARGINS.left + MARGINS.right
  height -= MARGINS.top + MARGINS.bottom

  return h('div.content', [
    render_graph(),
    h('div.controls', [
      render_dataset(),
      render_sliders(),
      render_options()
    ])
  ])


  function render_graph() {
    let y = d3.scaleLinear()
      .range([height, 0])
    let y_fmt = d3.format('.2f')

    let observations = cur_dataset.map( (d) => d.name).sort()
    let x = d3.scaleBand()
      .range([0, width])
      .domain(observations)
      .padding(.1)

    let bars
    if(state.colors) {
      // stacked bars
      let series = stack(cur_dataset)
      let max = d3.max( flatten(series) )
      y.domain([0, state.rescale ? max : 1.0])
      bars = series.map( (strip) => {
        return svg('g', strip.map( (d,i) => {
          let calc_label = y_fmt(d.data[strip.key]) + ' @ ' + weight_fmt(weight[strip.key])
          let val_label = y_fmt(d[1] - d[0]) + ' - ' + strip.key + ' [' + calc_label + ']'
          return svg('path', { fill: color(strip.key),
                               d: 'M' + Math.round(x(d.data.name)) + ' ' + Math.ceil(y(d[0])) +
                                  'h' + Math.round(x.bandwidth()) + 'V' + Math.floor(y(d[1])) +
                                  'h' + Math.round(-x.bandwidth()) + 'Z' },
                   svg('title', val_label))
        }))
      })
    } else {
      // plain bars
      let data = cur_dataset.map( (bar) => {
        return {
          key: bar.name,
          value: d3.sum( d3.keys(weight).map( (k) => bar[k] * weight[k]) )
        }
      })
      let max = d3.max(data, (d) => d.value)
      y.domain([0, state.rescale ? max : 1.0])
      bars = data.map( (d) => {
        return svg('path', { fill: 'lightgray',
                             d: 'M' + Math.round(x(d.key)) + ' ' + Math.ceil(y(d.value)) +
                                'h' + Math.round(x.bandwidth()) + 'V' + height +
                                'h' + Math.round(-x.bandwidth()) + 'Z' },
                 svg('title', y_fmt(d.value)))
      })
    }

    return h('div.graph-container',
      svg('svg', { class: 'graph',
                   width: width + MARGINS.left + MARGINS.right,
                   height: height + MARGINS.top + MARGINS.bottom },
      svg('g', { transform: 'translate(' + [MARGINS.left, MARGINS.top] + ')' }, [

        // bar chart
        bars,

        // horizontal legend
        svg('g', { 'font-size': 12, fill: 'black', 'text-anchor': 'middle', transform: 'translate(0,' + height + ')' },
          observations.map( (d) => svg('text', { x: x(d) + x.bandwidth() / 2, dy: '1.3em' }, d) )
        ),

        // vertical legend
        svg('g', { 'font-size': 10, fill: 'none', 'text-anchor': 'end' },
          y.ticks().map( (d) => {
            return svg('g', { transform: 'translate(0,' + Math.round(y(d)) + ')' }, [
              svg('line', { stroke: 'black', x1: -8, x2: -2, y1: 0.5 }),
              svg('text', { fill: 'black', x: -8, dy: '0.3em' }, y_fmt(d))
            ])
          }).concat([
            svg('path', { stroke: 'black', d: 'M-6,0H-2V' + height + 'H-6'})
          ])),
      ]))
    )
  }

  function render_dataset() {
    return h('select.dataset', {
      onchange: function() {
        state.channels.setdataset(this.value)
      } },
      d3.keys(datasets).map( (ds) => {
        return h('option', { value: ds, selected: ds === state.dataset }, ds)
      })
    )
  }

  function render_sliders() {
    return h('div.weights', all_metrics.map( (metric) => {
      let active = cur_dataset.columns.indexOf(metric) >= 0

      return h('div.slider.' + (active ? 'active' : 'inactive'), [
               h('div.slider-title', metric),
               Slider.render(state.weights[metric], active, color(metric))
             ])
    }))
  }

  function render_options() {
    return h('div.options', [
      h('label', [
        h('input', { type: 'checkbox',
                     checked: state.colors,
                     onchange: function() {
                       state.channels.setcolors(this.checked)
                     }
                   }),
        'Color weights'
      ]),
      h('label', [
        h('input', { type: 'checkbox',
                     checked: state.rescale,
                     onchange: function() {
                       state.channels.setrescale(this.checked)
                     }
                   }),
        'Rescale'
      ])
    ])
  }
}


// utility functions

function columns(data) {
  let result
  if(data.columns) {
    result = data.columns.slice(1)                 // 1st column is 'name'
  } else {
    result = d3.keys(data[0]).filter( (k) => k !== 'name')
  }
  result.sort()
  return result
}

function metrics(datasets) {
  let result = d3.set()
  d3.values(datasets).forEach( (data) => {
    columns(data).forEach( (m) => result.add(m) )
  })
  return result.values().sort()
}

function flatten(arr) {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat
}

function mapKeys(o, f) {
  return d3.keys(o).reduce( (r,k) => { r[k] = f(o[k]); return r }, {})
}

function only(props, hash) {
  let result = Object.create({})
  props.forEach( (key) => result[key] = hash[key])
  return result
}

export default App
