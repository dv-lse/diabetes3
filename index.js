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
    let max = 0
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
    let cur_dataset = datasets[state.dataset]
    let all_metrics = metrics.values().sort()
    let active_metrics = d3.set( project_metrics(cur_dataset) )

    let max = d3.max(cur_dataset, (d) => {
      let sum = 0
      active_metrics.each( (metric) => sum += +d[metric] )
      return sum
    })

    const width = 800
    const height = 300
    const margins = { top: 15, left: 50, bottom: 70, right: 15 }

    // TODO.  move out of the render function
    calculate_weights(state)

    let data = state.weighted_dataset || []

    let y = d3.scaleLinear()
      .range([300, 0])
      .domain([0, max])

    let y_fmt = d3.format('.2f')

    let color = d3.scaleOrdinal()
      .range(d3.schemeCategory10)
      .domain(data.map( (d) => d.name ))

    return h('div', [
      svg('svg.viz', {width: width + margins.left + margins.right, height: height + margins.top + margins.bottom },
        svg('g', {transform: 'translate(' + [margins.left, margins.top] + ')' },
          data.map( (d,i) => {
            return svg('g', { transform: 'translate(' + [ i*20, y(d.weighted_mean) ] + ')'}, [
              svg('circle', { r: 5, fill: color(d.name) }),
              svg('text', { transform: 'rotate(-90)', 'text-anchor': 'end', dy: '.3em', dx: '-10px', fill: 'gray' },
                d.name)
            ])
          }).concat([
            svg('g.axis', { 'font-size': 10, fill: 'none', 'text-anchor': 'end', transform: 'translate(-20)' },
              y.ticks().map( (d) => {
                return svg('g.tick', { transform: 'translate(0,' + y(d) + ')' }, [
                  svg('line', { stroke: 'black', x1: -6, x2: 0, y1: 0.5 }),
                  svg('text', { fill: 'black', x: -8, dy: '0.3em' }, y_fmt(d))
                ])
            }).concat([
              svg('path.domain', { stroke: 'black', d: 'M-6,0H0V' + y(0) + 'H-6'})
            ]))
          ])
        )
      ),
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

  }

  function project_metrics(dataset) {
    return dataset.columns.filter( (d) => d !== 'name')
  }

  // main loop

  loop( () => render(state) )
}
