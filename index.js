import debounce from 'debounce'

import load from './load'
import App from './app'


// bootstrap UI

const API_URL = 'https://api.github.com/repos/dv-lse/diabetes3/contents/data' + '?_=' + Date.now()

load(API_URL, (datasets) => {
  let state = App(datasets)
  window.onresize = debounce(state.tripwire, 300)
  // start main loop
  state.tripwire()
})
