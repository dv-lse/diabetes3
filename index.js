import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import loop from './main-loop'

import {queue} from 'd3-queue'

import * as d3 from 'd3'

import Slider from './slider'

import 'styles.css!'

// pre-load datasets

const API_URL = 'https://api.github.com/repos/dv-lse/diabetes2/contents/data'

d3.json(API_URL, (err, files) => {
  if(err) throw err
  let paths = files.map( (f) => f.path )
  let loader = queue()
  paths.forEach( (ds) => loader.defer(d3.csv, ds))
  loader.awaitAll( (err, data) => {
    if(err) throw err
    let datasets = zipObject(data, (d,i) => paths[i])
    run(datasets)
  })

  function zipObject(list, fn) {
    let result = {}
    list.forEach( (d,i) => result[fn(d,i)] = d )
    return result
  }
})

// user interface

function run(datasets) {

  // setup

  let metrics = d3.set()
  d3.values(datasets).forEach( (data) => {
    project_metrics(data).forEach( (m) => metrics.add(m) )
  })

  const weight_scale = d3.scaleQuantize()
    .domain([0,100])
    .range(d3.range(0,6))

  // state

  let state = {
    dataset: d3.keys(datasets)[0],
    weights: {},
    weighted_dataset: null,
    channels: {
      setdataset: (ds) => state.dataset = ds
    }
  }
  metrics.each( (m) => state.weights[m] = Slider(weight_scale) )

  // logic

  function calculate_weights(state) {
    // calculate total sum of weights
    let sum_weights = 0
    d3.keys(state.weights).forEach( (metric) => {
      sum_weights += state.weights[metric].value
    })

    // for each item, weight its values
    let data = datasets[state.dataset].map( (d) => {
      let weighted_d = { name: d.name }
      let cumsum = 0.0
      metrics.each( (key) => {
        let value = (d[key] * state.weights[key].value) || 0.0
        weighted_d[key] = value
        cumsum += value
      })
      weighted_d.weighted_mean = sum_weights > 0 ? cumsum / sum_weights : 0
      return weighted_d
    })

    state.weighted_dataset = data
  }

  // view

  function render(state) {
    let all_metrics = metrics.values().sort()
    let active_metrics = d3.set( project_metrics(datasets[state.dataset]) )

    calculate_weights(state)

    return h('div', [
      h('div', JSON.stringify(state.weighted_dataset)),
      h('div.controls', [
        h('select.dataset', {
          onchange: function() {
            state.channels.setdataset(this.value)
          } },
          d3.keys(datasets).map( (ds) => {
            return h('option', { value: ds, selected: ds === state.dataset }, ds)
          })
        ),
        h('div.weights', all_metrics.map( (metric) => {
          return Slider.render(state.weights[metric], metric, active_metrics.has(metric))
        }))
      ])
    ])
  /*
    [
      Slider.render(state.metric1, fmt, 'Metric 1'),
      svg('svg', {width: 800, height: 600},
        svg('circle', {cx: 400, cy: 300, r: state.metric1.value * 3, fill: 'pink'})
      )
    ])
  */

  }

  function project_metrics(dataset) {
    return dataset.columns.filter( (d) => d !== 'name')
  }

  // main loop

  loop( () => render(state) )
}
