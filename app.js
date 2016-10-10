import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'

import * as d3 from 'd3'

import loop from './main-loop'
import Slider from './slider'

import 'styles.css!'

const MARGINS = { top: 15, left: 50, bottom: 30, right: 15 }


// computations over state

function weighting_fn(dataset, weights) {
  let metrics = columns(dataset)
  let sum = metrics.reduce( (sum,key) => sum + weights[key], 0)
  if(sum > 0) {
    return (d,key) => d[key] * weights[key] / sum
  } else {
    return (d,key) => 0
  }
}

function series(dataset, weights) {
  let metrics = columns(dataset)
  let stack = d3.stack()
    .keys(metrics)
    .value(weighting_fn(dataset, weights))
    .order(d3.stackOrderReverse)
    .offset(d3.stackOffsetNone)
  return stack(dataset)
}

// state proper

function App(datasets) {
  let state
  let tripwire = loop(() => {

    // recompute layout (= weighted means)

    let dataset = datasets[state.dataset]
    let weights = mapKeys(state.weights, (slider) => slider.value)
    state.series = series(dataset, weights)

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


// view

App.render = function(state, datasets, width, height) {
  let all_metrics = metrics(datasets)
  let cur_dataset = datasets[state.dataset]

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
    let max = d3.max( flatten(state.series) )
    let y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, max])

    let x = d3.scaleBand()
      .range([0, width])
      .domain(cur_dataset.map( (d) => d.name).sort())
      .padding(.1)

    let y_fmt = d3.format('.2f')

    return h('div.graph-container',
      svg('svg', { class: 'graph',
                          viewBox: '0 0 ' + (width + MARGINS.left + MARGINS.right) + ' ' + (height + MARGINS.top + MARGINS.bottom),
                          preserveAspectRatio: 'xMinYMin' },
      svg('g', { transform: 'translate(' + [MARGINS.left, MARGINS.top] + ')' }, [

        // stacked bars
        state.series.map( (strip) => {
          return svg('g', strip.map( (d,i) => {
            // TODO.  this works because the series are in reverse order (see stack above)
            //        find a clearer way to access the weighted value for a drug
            let entire_weight = y_fmt(state.series[0][i][1])
            let series_weight = y_fmt(d[1] - d[0]) + ' - ' + strip.key + ' [' + y_fmt(d.data[strip.key]) + ']'

            return svg('path', { fill: state.colors ? color(strip.key) : 'lightgray',
                                 d: 'M' + x(d.data.name) + ' ' + Math.ceil(y(d[0])) +
                                    'h' + x.bandwidth() + 'V' + Math.floor(y(d[1])) +
                                    'h' + -x.bandwidth() + 'Z' },
                     svg('title', state.colors ? series_weight : entire_weight))
          }))
        }),

        // horizontal legend
        svg('g', { 'font-size': 12, fill: 'black', 'text-anchor': 'middle', transform: 'translate(0,' + height + ')' },
          state.series[0].map( (d) => svg('text', { x: x(d.data.name) + x.bandwidth() / 2, dy: '1.3em' }, d.data.name) )
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

export { App as default, series, weighting_fn }
