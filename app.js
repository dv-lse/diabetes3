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
    ranked: false,
    weights: metrics(datasets).reduce( (o,v) => {
      o[v] = Slider(tripwire, [0,5], 3)
      return o
    }, {}),
    tripwire: tripwire,
    channels: {
      setranked: (r) => { state.ranked = r; tripwire() }
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
  let raw_weight_fmt = d3.format('d')

  let color = d3.scaleOrdinal()
    .range(d3.schemeCategory20)
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

    let data = cur_dataset.map((bar) => {
      let arcs = d3.pie()
        .sort(d3.ascending)
        .value((k) => bar[k] * weight[k])
        (d3.keys(weight))
      return {
        data: bar,
        arcs: arcs,
        sum: d3.sum(arcs, (d) => d.value)
      }
    })
    data.sort( (a,b) => state.ranked ? d3.descending(a.sum, b.sum) : d3.ascending(a.data.name, b.data.name))

    let observations = data.map( (d) => d.data.name )
    let max = d3.max(data, (d) => d.sum)

    let x = d3.scaleBand()
      .range([0, width])
      .domain(observations)
      .padding(.1)

    let y = d3.scaleLinear()
      .range([height - x.bandwidth() / 2, x.bandwidth() / 2])
      .domain([0, max])
    let y_fmt = d3.format('.2f')


    let coords = (flower) => {
      return [ Math.round(x(flower.data.name)+x.bandwidth() / 2), Math.round(y(flower.sum)) ]
    }

    let arc = d3.arc()
      .innerRadius(x.bandwidth() * .3)
      .outerRadius(x.bandwidth() * .5)

    let bars = data.map( (flower) => {
      let center = coords(flower)
      return svg('g', { transform: 'translate(' + center + ')' },
      [
        svg('line', { x1: 0, x2: 0, y1: height - Math.round(y(flower.sum)), y2: 0, stroke: 'lightgrey' }),
        svg('circle', { fill: 'lightgrey', r: 2 }),
        svg('text', { x: -x.bandwidth() / 2, dx: '-1em', dy: '-0.3em', transform: 'rotate(-90)',
                      'font-size': 12, 'text-anchor': 'end', fill: 'grey' }, flower.data.name)
      ].concat(
        flower.arcs.map((a) => {
          let calc_label = y_fmt(flower.data[a.data]) + ' @ ' + weight_fmt(weight[a.data])
          let val_label = y_fmt(a.value) + ' - ' + a.data + ' [' + calc_label + ' ]'
          return svg('path', { d: arc(a), fill: color(a.data) },
            svg('title', val_label))
        }))
      )
    })

    return h('div.graph-container',
      svg('svg', { class: 'graph',
                   width: width + MARGINS.left + MARGINS.right,
                   height: height + MARGINS.top + MARGINS.bottom },
      svg('g', { transform: 'translate(' + [MARGINS.left, MARGINS.top] + ')' }, [

        // bar chart
        bars,

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
    let max = d3.sum(d3.values(state.weights), (d) => d.value)
    let x = d3.scaleLinear()
      .range([5, 195])
      .domain([0,max])

    return h('div.weights',
      [ h('div.slider-legend', h('div.slider-plusminus'))
      ].concat(
        all_metrics.map( (metric) => {
          let active = cur_dataset.columns.indexOf(metric) >= 0

          return h('div.slider.' + (active ? 'active' : 'inactive'), [
                   h('div.slider-title', metric),
                   Slider.render(state.weights[metric], active, color(metric)),
                   h('div.slider-readout', raw_weight_fmt(state.weights[metric].value))
                 ])
        }))
    )
  }

  function render_options() {
    return h('div.options', [
      h('label', [
        h('input', { type: 'checkbox',
                     checked: state.ranked,
                     onchange: function() {
                       state.channels.setranked(this.checked)
                     }
                   }),
        'Ranked'
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
