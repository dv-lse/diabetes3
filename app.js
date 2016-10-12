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
      height = rect.height
    } else {
      // TODO remove dependency on DOM
      width = window.innerWidth
      height = window.innerHeight
      tripwire()                                      // render twice during bootstrap
    }

    return App.render(state, datasets, width, height)
  })

  state = {
    dataset: d3.keys(datasets)[0],
    colors: false,
    weights: metrics(datasets).reduce( (o,v) => {
      o[v] = Slider(tripwire, [0,6], 3)
      return o
    }, {}),
    tripwire: tripwire,
    channels: {
      setdataset: (ds) => { state.dataset = ds; tripwire() },
      setcolors: (c) => { state.colors = c; tripwire() }
    }
  }

  return state
}


// utility

// return a function from metric names to proportional weights
//   (i.e. from 0 to 1)
App.weights = function(sliders, metrics) {
  let slider_values = mapKeys(sliders, (s) => s.value)
  let raw_weights = only(metrics, slider_values)
  let sum_weights = d3.sum( d3.values(raw_weights) )
  let weights = mapKeys(raw_weights, (rw) => rw && sum_weights ? rw / sum_weights : 0)
  return weights
}


// view

App.render = function(state, datasets, width, height) {
  let all_metrics = metrics(datasets)
  let cur_dataset = datasets[state.dataset]

  let cur_metrics = columns(cur_dataset)
  let weight = App.weights(state.weights, cur_metrics)

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
      render_colors()
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
      y.domain([0, max])
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
      y.domain([0, d3.max(data, (d) => d.value)])
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
                          viewBox: '0 0 ' + (width + MARGINS.left + MARGINS.right) + ' ' + (height + MARGINS.top + MARGINS.bottom),
                          preserveAspectRatio: 'xMinYMin' },
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

  function render_colors() {
    return h('div.colors',
      h('label', [
        h('input', { type: 'checkbox',
                     checked: state.colors,
                     onchange: function() {
                       state.channels.setcolors(this.checked)
                     }
                   }),
        'Color the weights'
      ])
    )
  }
}


// utility functions

function columns(data) {
  if(data.columns) {
    return data.columns.slice(1)                 // 1st column is 'name'
  } else {
    return d3.keys(data).filter( (k) => k !== 'name')
  }
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
