import test from 'tape'

import App from '../app'

// ONLY tests the central weighted-mean calculation

const DATASETS = {
  'drugs-1.csv':[
    {name:'drug_3',metric_1:0.9,metric_2:0.7,metric_3:0.5},
    {name:'drug_2',metric_1:0.7,metric_2:0.2,metric_3:0.1},
    {name:'drug_1',metric_1:0.3,metric_2:0.11,metric_3:0.5}],
  'drugs-2.csv':[
    {name:'drug_3',fooble:0.7,barble:0.7,bibble:0.5,buble:0.1},
    {name:'drug_2',fooble:0.7,barble:0.2,bibble:0.01,buble:0.7},
    {name:'drug_1',fooble:0.2,barble:0.01,bibble:0.5,buble:0.9}]
  }

test('Weighted mean for own weights is correct', (t) => {
  const metrics = [ 'metric_1', 'metric_2', 'metric_3' ]
  const sliders = { metric_1: 1, metric_2: 0, metric_3: 0.5 }
  const sum = 1 + 0 + 0.5

  const expected = [ [0.9*1/sum, 0.7*0/sum, 0.5*0.5/sum],    // drug_3
                     [0.7*1/sum, 0.2*0/sum, 0.1*0.5/sum],   // drug_2
                     [0.3*1/sum, 0.11*0/sum, 0.5*0.5/sum] ]  // drug_1

  const dataset = DATASETS['drugs-1.csv']
  const weight = App.weights(sliders)

  const means = dataset.map( (d) => {
    return metrics.map( (k) => d[k] * weight[k] )
  })

  t.deepEqual(means, expected)
  t.end()
})
