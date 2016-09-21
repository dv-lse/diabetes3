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
    .range(d3.range(0,5))

  // state

  let state = {
    dataset: d3.keys(datasets)[0],
    channels: {
      setdataset: (ds) => state.dataset = ds
    }
  }
  metrics.each( (m) => state[m] = Slider(weight_scale) )

  // view

  function render(state) {
    let all_metrics = metrics.values().sort()
    let active_metrics = d3.set( project_metrics(datasets[state.dataset]) )

    return h('div.controls', [
      h('select.dataset', {
        onchange: function() {
          state.channels.setdataset(this.value)
        } },
        d3.keys(datasets).map( (ds) => {
          return h('option', { value: ds, selected: ds === state.dataset }, ds)
        })
      ),
      h('div.weights', all_metrics.map( (metric) => {
        return Slider.render(state[metric], metric, active_metrics.has(metric))
      }))
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
