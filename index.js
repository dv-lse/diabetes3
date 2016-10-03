import {h} from 'virtual-dom'
import svg from 'virtual-dom/virtual-hyperscript/svg'

import {queue} from 'd3-queue'
import * as d3 from 'd3'

import debounce from 'debounce'

import loop from './main-loop'

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
  let state
  let tick = loop(() => {
    let controls = d3.select('.controls').node() // TODO.  will not work once DV embedded in website shell
    let width = controls ? controls.getBoundingClientRect().left : 720
    let height = window.innerHeight
    let result = render(state, width, height)
    if(!controls) tick()                         // if sizes estimated, immediately re-render
    return result
  })

  state = {
    dataset: d3.keys(datasets)[0],
    colors: false,
    weights: metrics.values().reduce( (o,v) => {
      o[v] = Slider(tick, weight_scale, 3)
      return o
    }, {}),
    channels: {
      setdataset: (ds) => { state.dataset = ds; tick() },
      setcolors: (c) => { state.colors = c; tick() }
    }
  }

  // view

  let color = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    .domain(metrics.values())

  function render(state, width, height) {
    let cur_dataset = datasets[state.dataset]
    let all_metrics = metrics.values().sort()
    let active_metrics = d3.set( project_metrics(cur_dataset) )

    const margins = { top: 15, left: 50, bottom: 70, right: 15 }
    width -= margins.left + margins.right
    height -= margins.top + margins.bottom

    let sum_weights = d3.sum( active_metrics.values().map( (key) => state.weights[key].value ))

    let weighting_fn = (d,key) => sum_weights > 0 ? d[key] * state.weights[key].value / sum_weights : 0

    let stack = d3.stack()
      .keys(active_metrics.values())
      .value(weighting_fn)
      .order(d3.stackOrderReverse)
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
      svg('svg', { width: width + margins.left + margins.right, height: height + margins.top + margins.bottom },
        svg('g', { transform: 'translate(' + [margins.left, margins.top] + ')' }, [

          // stacked bars
          series.map( (strip) => {
            return svg('g', strip.map( (d,i) => {
              // TODO.  this works because the series are in reverse order (see stack above)
              //        find a clearer way to access the weighted value for a drug
              let entire_weight = y_fmt(series[0][i][1])
              let series_weight = y_fmt(weighting_fn(d.data, strip.key)) + ' - ' + strip.key + ' [' + y_fmt(d.data[strip.key]) + ']'

              return svg('path', { fill: state.colors ? color(strip.key) : 'lightgray',
                                   d: 'M' + x(d.data.name) + ' ' + y(d[0]) + 'h' + x.bandwidth() + 'V' + y(d[1]) + 'h' + -x.bandwidth() + 'Z' },
                       svg('title', state.colors ? series_weight : entire_weight))
            }))
          }),

          // horizontal legend
          svg('g', { 'font-size': 12, fill: 'black', 'text-anchor': 'middle', transform: 'translate(0,' + height + ')' },
            series[0].map( (d) => svg('text', { x: x(d.data.name) + x.bandwidth() / 2, dy: '1.3em' }, d.data.name) )
          ),

          // vertical legend
          svg('g', { 'font-size': 10, fill: 'none', 'text-anchor': 'end' },
            y.ticks().map( (d) => {
              return svg('g', { transform: 'translate(0,' + y(d) + ')' }, [
                svg('line', { stroke: 'black', x1: -8, x2: -2, y1: 0.5 }),
                svg('text', { fill: 'black', x: -8, dy: '0.3em' }, y_fmt(d))
              ])
            }).concat([
              svg('path', { stroke: 'black', d: 'M-6,0H-2V' + height + 'H-6'})
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
        })),
        h('div.colors',
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
      ])
    ])

  }

  function project_metrics(dataset) {
    return dataset.columns.filter( (d) => d !== 'name')
  }

  // start main loop
  d3.select(window)
    .on('resize.visualisation', debounce(tick, 150))

  // bootstrap UI
  tick()
}
