import {queue} from 'd3-queue'
import * as d3 from 'd3'

// dataset loading and parsing

function load(url, fn) {
  d3.json(url, (err, dataFiles) => {
    if(err) alert(err)

    let loader = queue()
    dataFiles.forEach( (d) => loader.defer(d3.csv, d.download_url + '?_=' + d.sha ))
    loader.awaitAll( (err, data) => {
      if(err) alert(err)
      let datasets = zipObject(data, (d,i) => dataFiles[i].name)
      fn(datasets)
    })
  })
}

function zipObject(list, fn) {
  let result = {}
  list.forEach( (d,i) => result[fn(d,i)] = d )
  return result
}

export default load
