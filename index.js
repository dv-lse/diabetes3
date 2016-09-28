import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'
import loop from './main-loop'

import {queue} from 'd3-queue'

import * as d3 from 'd3'

import Slider from './slider'

import 'styles.css!'

// pre-load datasets

const API_URL = 'https://api.github.com/repos/dv-lse/diabetes3/contents/data'

d3.json(API_URL, (err, files) => {
  if(err) throw err

  // TODO. cache busting code can be removed once github pages editing not longer needed
  let cache_bust = Math.floor(Math.random() * 1000)
  let paths = files.map( (f) => f.path )

  let loader = queue()
  paths.forEach( (path) => loader.defer(d3.csv, path + '?' + cache_bust ))
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
    weights: {},                       // i.e. slider values
    channels: {
      setdataset: (ds) => state.dataset = ds
    }
  }
  metrics.each( (m) => state.weights[m] = Slider(weight_scale, 3) )

  // view

  let color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    .domain(metrics.values())

  function render(state) {
    let cur_dataset = datasets[state.dataset]
    let all_metrics = metrics.values().sort()
    let active_metrics = d3.set( project_metrics(cur_dataset) )

    const width = 800
    const height = 300
    const margins = { top: 15, left: 50, bottom: 70, right: 15 }

    let sum_weights = d3.sum( active_metrics.values().map( (key) => state.weights[key].value ))

    let stack = d3.stack()
      .keys(active_metrics.values())
      .value( (d,key) => sum_weights > 0 ? d[key] * state.weights[key].value / sum_weights : 0 )
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone)

    let series = stack(cur_dataset)

    // TODO.  um, surely there's a better way
    let max = d3.max(series.map( (d1) => d3.max(d1.map( (d2) => d2[1]))))

    let y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, max])

    let x = d3.scaleBand()
      .range([0, width])
      .domain(cur_dataset.map( (d) => d.name).sort())
      .padding(.1)

    let y_fmt = d3.format('.2f')

    return h('div', [
      svg('svg.viz', {width: width + margins.left + margins.right, height: height + margins.top + margins.bottom },
        svg('g', {transform: 'translate(' + [margins.left, margins.top] + ')' }, [

          // stacked bars
          series.map( (strip) => {
            return svg('g.series', strip.map( (d,i) => {
              return svg('path', { fill: color(strip.key),
                                   d: 'M' + x(d.data.name) + ' ' + y(d[0]) + 'h' + x.bandwidth() + 'V' + y(d[1]) + 'h' + -x.bandwidth() + 'Z' })
            }))
          }),

          // horizontal legend
          svg('g.axis.y', { 'font-size': 10, fill: 'black', 'text-anchor': 'end', transform: 'translate(0,' + height + ')' },
            series[0].map( (d) => svg('text', { transform: 'translate(' + x(d.data.name) + ')rotate(-90)', dx: -5, dy: '0.7em' }, d.data.name) )
          ),

          // vertical legend
          svg('g.axis.x', { 'font-size': 10, fill: 'none', 'text-anchor': 'end' },
            y.ticks().map( (d) => {
              return svg('g.tick', { transform: 'translate(0,' + y(d) + ')' }, [
                svg('line', { stroke: 'black', x1: -8, x2: -2, y1: 0.5 }),
                svg('text', { fill: 'black', x: -8, dy: '0.3em' }, y_fmt(d))
              ])
            }).concat([
              svg('path.domain', { stroke: 'black', d: 'M-6,0H-2V' + height + 'H-6'})
            ])),
        ])),
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
          let active = active_metrics.has(metric)
          return h('div.slider.' + (active ? 'active' : 'inactive'), [
                   h('div.slider-title', metric),
                   Slider.render(state.weights[metric], active, color(metric))
                 ])
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
