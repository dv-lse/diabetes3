System.config({
  baseURL: "/treatment-selection-tool",
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },
  bundles: {
    "build.js": [
      "index.js",
      "app.js",
      "styles.css!github:systemjs/plugin-css@0.1.27.js",
      "slider.js",
      "slider.css!github:systemjs/plugin-css@0.1.27.js",
      "npm:d3@4.2.5.js",
      "npm:d3@4.2.5/build/d3.js",
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "npm:process@0.11.9.js",
      "npm:process@0.11.9/browser.js",
      "github:jspm/nodelibs-buffer@0.1.0.js",
      "github:jspm/nodelibs-buffer@0.1.0/index.js",
      "npm:buffer@3.6.0.js",
      "npm:buffer@3.6.0/index.js",
      "npm:isarray@1.0.0.js",
      "npm:isarray@1.0.0/index.js",
      "npm:ieee754@1.1.8.js",
      "npm:ieee754@1.1.8/index.js",
      "npm:base64-js@0.0.8.js",
      "npm:base64-js@0.0.8/lib/b64.js",
      "npm:virtual-dom@2.1.1.js",
      "npm:virtual-dom@2.1.1/index.js",
      "npm:virtual-dom@2.1.1/vnode/vtext.js",
      "npm:virtual-dom@2.1.1/vnode/version.js",
      "npm:virtual-dom@2.1.1/vnode/vnode.js",
      "npm:virtual-dom@2.1.1/vnode/is-vhook.js",
      "npm:virtual-dom@2.1.1/vnode/is-thunk.js",
      "npm:virtual-dom@2.1.1/vnode/is-widget.js",
      "npm:virtual-dom@2.1.1/vnode/is-vnode.js",
      "npm:virtual-dom@2.1.1/create-element.js",
      "npm:virtual-dom@2.1.1/vdom/create-element.js",
      "npm:virtual-dom@2.1.1/vnode/handle-thunk.js",
      "npm:virtual-dom@2.1.1/vnode/is-vtext.js",
      "npm:virtual-dom@2.1.1/vdom/apply-properties.js",
      "npm:is-object@1.0.1.js",
      "npm:is-object@1.0.1/index.js",
      "npm:global@4.3.0/document.js",
      "npm:virtual-dom@2.1.1/h.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/index.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/hooks/ev-hook.js",
      "npm:ev-store@7.0.0.js",
      "npm:ev-store@7.0.0/index.js",
      "npm:individual@3.0.0/one-version.js",
      "npm:individual@3.0.0/index.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/hooks/soft-set-hook.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/parse-tag.js",
      "npm:browser-split@0.0.1.js",
      "npm:browser-split@0.0.1/index.js",
      "npm:x-is-array@0.1.0.js",
      "npm:x-is-array@0.1.0/index.js",
      "npm:virtual-dom@2.1.1/patch.js",
      "npm:virtual-dom@2.1.1/vdom/patch.js",
      "npm:virtual-dom@2.1.1/vdom/patch-op.js",
      "npm:virtual-dom@2.1.1/vdom/update-widget.js",
      "npm:virtual-dom@2.1.1/vnode/vpatch.js",
      "npm:virtual-dom@2.1.1/vdom/dom-index.js",
      "npm:virtual-dom@2.1.1/diff.js",
      "npm:virtual-dom@2.1.1/vtree/diff.js",
      "npm:virtual-dom@2.1.1/vtree/diff-props.js",
      "main-loop.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/svg.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/hooks/attribute-hook.js",
      "npm:virtual-dom@2.1.1/virtual-hyperscript/svg-attribute-namespace.js",
      "npm:babel-runtime@5.8.38/core-js/object/create.js",
      "npm:core-js@1.2.7/library/fn/object/create.js",
      "npm:core-js@1.2.7/library/modules/$.js",
      "npm:babel-runtime@5.8.38/helpers/to-consumable-array.js",
      "npm:babel-runtime@5.8.38/core-js/array/from.js",
      "npm:core-js@1.2.7/library/fn/array/from.js",
      "npm:core-js@1.2.7/library/modules/$.core.js",
      "npm:core-js@1.2.7/library/modules/es6.array.from.js",
      "npm:core-js@1.2.7/library/modules/$.iter-detect.js",
      "npm:core-js@1.2.7/library/modules/$.wks.js",
      "npm:core-js@1.2.7/library/modules/$.global.js",
      "npm:core-js@1.2.7/library/modules/$.uid.js",
      "npm:core-js@1.2.7/library/modules/$.shared.js",
      "npm:core-js@1.2.7/library/modules/core.get-iterator-method.js",
      "npm:core-js@1.2.7/library/modules/$.iterators.js",
      "npm:core-js@1.2.7/library/modules/$.classof.js",
      "npm:core-js@1.2.7/library/modules/$.cof.js",
      "npm:core-js@1.2.7/library/modules/$.to-length.js",
      "npm:core-js@1.2.7/library/modules/$.to-integer.js",
      "npm:core-js@1.2.7/library/modules/$.is-array-iter.js",
      "npm:core-js@1.2.7/library/modules/$.iter-call.js",
      "npm:core-js@1.2.7/library/modules/$.an-object.js",
      "npm:core-js@1.2.7/library/modules/$.is-object.js",
      "npm:core-js@1.2.7/library/modules/$.to-object.js",
      "npm:core-js@1.2.7/library/modules/$.defined.js",
      "npm:core-js@1.2.7/library/modules/$.export.js",
      "npm:core-js@1.2.7/library/modules/$.ctx.js",
      "npm:core-js@1.2.7/library/modules/$.a-function.js",
      "npm:core-js@1.2.7/library/modules/es6.string.iterator.js",
      "npm:core-js@1.2.7/library/modules/$.iter-define.js",
      "npm:core-js@1.2.7/library/modules/$.set-to-string-tag.js",
      "npm:core-js@1.2.7/library/modules/$.has.js",
      "npm:core-js@1.2.7/library/modules/$.iter-create.js",
      "npm:core-js@1.2.7/library/modules/$.hide.js",
      "npm:core-js@1.2.7/library/modules/$.descriptors.js",
      "npm:core-js@1.2.7/library/modules/$.fails.js",
      "npm:core-js@1.2.7/library/modules/$.property-desc.js",
      "npm:core-js@1.2.7/library/modules/$.redefine.js",
      "npm:core-js@1.2.7/library/modules/$.library.js",
      "npm:core-js@1.2.7/library/modules/$.string-at.js",
      "load.js",
      "npm:d3-queue@3.0.3.js",
      "npm:d3-queue@3.0.3/build/d3-queue.js",
      "npm:debounce@1.0.0.js",
      "npm:debounce@1.0.0/index.js",
      "npm:date-now@1.0.1.js",
      "npm:date-now@1.0.1/index.js"
    ]
  },

  map: {
    "babel": "npm:babel-core@5.8.38",
    "babel-runtime": "npm:babel-runtime@5.8.38",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.27",
    "d3": "npm:d3@4.2.5",
    "d3-queue": "npm:d3-queue@3.0.3",
    "debounce": "npm:debounce@1.0.0",
    "tape": "npm:tape@4.6.2",
    "virtual-dom": "npm:virtual-dom@2.1.1",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:brace-expansion@1.1.6": {
      "balanced-match": "npm:balanced-match@0.4.2",
      "concat-map": "npm:concat-map@0.0.1"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:commander@2.9.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "graceful-readlink": "npm:graceful-readlink@1.0.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:d3-brush@1.0.3": {
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-drag": "npm:d3-drag@1.0.1",
      "d3-interpolate": "npm:d3-interpolate@1.1.1",
      "d3-selection": "npm:d3-selection@1.0.2",
      "d3-transition": "npm:d3-transition@1.0.2"
    },
    "npm:d3-chord@1.0.2": {
      "d3-array": "npm:d3-array@1.0.1",
      "d3-path": "npm:d3-path@1.0.2"
    },
    "npm:d3-drag@1.0.1": {
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-selection": "npm:d3-selection@1.0.2"
    },
    "npm:d3-dsv@1.0.3": {
      "commander": "npm:commander@2.9.0",
      "iconv-lite": "npm:iconv-lite@0.4.13",
      "rw": "npm:rw@1.3.2"
    },
    "npm:d3-force@1.0.2": {
      "d3-collection": "npm:d3-collection@1.0.1",
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-quadtree": "npm:d3-quadtree@1.0.1",
      "d3-timer": "npm:d3-timer@1.0.3",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:d3-geo@1.2.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.1"
    },
    "npm:d3-interpolate@1.1.1": {
      "d3-color": "npm:d3-color@1.0.1"
    },
    "npm:d3-request@1.0.2": {
      "d3-collection": "npm:d3-collection@1.0.1",
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-dsv": "npm:d3-dsv@1.0.3",
      "xmlhttprequest": "npm:xmlhttprequest@1.8.0"
    },
    "npm:d3-scale@1.0.3": {
      "d3-array": "npm:d3-array@1.0.1",
      "d3-collection": "npm:d3-collection@1.0.1",
      "d3-color": "npm:d3-color@1.0.1",
      "d3-format": "npm:d3-format@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.1",
      "d3-time": "npm:d3-time@1.0.3",
      "d3-time-format": "npm:d3-time-format@2.0.2"
    },
    "npm:d3-shape@1.0.3": {
      "d3-path": "npm:d3-path@1.0.2"
    },
    "npm:d3-time-format@2.0.2": {
      "d3-time": "npm:d3-time@1.0.3"
    },
    "npm:d3-transition@1.0.2": {
      "d3-color": "npm:d3-color@1.0.1",
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-ease": "npm:d3-ease@1.0.1",
      "d3-interpolate": "npm:d3-interpolate@1.1.1",
      "d3-selection": "npm:d3-selection@1.0.2",
      "d3-timer": "npm:d3-timer@1.0.3"
    },
    "npm:d3-zoom@1.0.3": {
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-drag": "npm:d3-drag@1.0.1",
      "d3-interpolate": "npm:d3-interpolate@1.1.1",
      "d3-selection": "npm:d3-selection@1.0.2",
      "d3-transition": "npm:d3-transition@1.0.2"
    },
    "npm:d3@4.2.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.1",
      "d3-axis": "npm:d3-axis@1.0.3",
      "d3-brush": "npm:d3-brush@1.0.3",
      "d3-chord": "npm:d3-chord@1.0.2",
      "d3-collection": "npm:d3-collection@1.0.1",
      "d3-color": "npm:d3-color@1.0.1",
      "d3-dispatch": "npm:d3-dispatch@1.0.1",
      "d3-drag": "npm:d3-drag@1.0.1",
      "d3-dsv": "npm:d3-dsv@1.0.3",
      "d3-ease": "npm:d3-ease@1.0.1",
      "d3-force": "npm:d3-force@1.0.2",
      "d3-format": "npm:d3-format@1.0.2",
      "d3-geo": "npm:d3-geo@1.2.5",
      "d3-hierarchy": "npm:d3-hierarchy@1.0.2",
      "d3-interpolate": "npm:d3-interpolate@1.1.1",
      "d3-path": "npm:d3-path@1.0.2",
      "d3-polygon": "npm:d3-polygon@1.0.1",
      "d3-quadtree": "npm:d3-quadtree@1.0.1",
      "d3-queue": "npm:d3-queue@3.0.3",
      "d3-random": "npm:d3-random@1.0.1",
      "d3-request": "npm:d3-request@1.0.2",
      "d3-scale": "npm:d3-scale@1.0.3",
      "d3-selection": "npm:d3-selection@1.0.2",
      "d3-shape": "npm:d3-shape@1.0.3",
      "d3-time": "npm:d3-time@1.0.3",
      "d3-time-format": "npm:d3-time-format@2.0.2",
      "d3-timer": "npm:d3-timer@1.0.3",
      "d3-transition": "npm:d3-transition@1.0.2",
      "d3-voronoi": "npm:d3-voronoi@1.0.2",
      "d3-zoom": "npm:d3-zoom@1.0.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:debounce@1.0.0": {
      "date-now": "npm:date-now@1.0.1"
    },
    "npm:define-properties@1.1.2": {
      "foreach": "npm:foreach@2.0.5",
      "object-keys": "npm:object-keys@1.0.11"
    },
    "npm:error@4.4.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "camelize": "npm:camelize@1.0.0",
      "string-template": "npm:string-template@0.2.1",
      "xtend": "npm:xtend@4.0.1"
    },
    "npm:es-abstract@1.6.1": {
      "es-to-primitive": "npm:es-to-primitive@1.1.1",
      "function-bind": "npm:function-bind@1.1.0",
      "is-callable": "npm:is-callable@1.1.3",
      "is-regex": "npm:is-regex@1.0.3"
    },
    "npm:es-to-primitive@1.1.1": {
      "is-callable": "npm:is-callable@1.1.3",
      "is-date-object": "npm:is-date-object@1.0.1",
      "is-symbol": "npm:is-symbol@1.0.1"
    },
    "npm:ev-store@7.0.0": {
      "individual": "npm:individual@3.0.0"
    },
    "npm:fs.realpath@1.0.0": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:glob@7.1.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "fs.realpath": "npm:fs.realpath@1.0.0",
      "inflight": "npm:inflight@1.0.5",
      "inherits": "npm:inherits@2.0.3",
      "minimatch": "npm:minimatch@3.0.3",
      "once": "npm:once@1.4.0",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "path-is-absolute": "npm:path-is-absolute@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:global@4.3.0": {
      "process": "npm:process@0.5.2"
    },
    "npm:graceful-readlink@1.0.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:has@1.0.1": {
      "function-bind": "npm:function-bind@1.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.13": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inflight@1.0.5": {
      "once": "npm:once@1.4.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "wrappy": "npm:wrappy@1.0.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.3": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:minimatch@3.0.3": {
      "brace-expansion": "npm:brace-expansion@1.1.6",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:next-tick@0.2.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:once@1.4.0": {
      "wrappy": "npm:wrappy@1.0.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:path-is-absolute@1.0.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:resolve@1.1.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:resumer@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "through": "npm:through@2.3.8"
    },
    "npm:rw@1.3.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string.prototype.trim@1.1.2": {
      "define-properties": "npm:define-properties@1.1.2",
      "es-abstract": "npm:es-abstract@1.6.1",
      "function-bind": "npm:function-bind@1.1.0"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:tape@4.6.2": {
      "deep-equal": "npm:deep-equal@1.0.1",
      "defined": "npm:defined@1.0.0",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "function-bind": "npm:function-bind@1.1.0",
      "glob": "npm:glob@7.1.1",
      "has": "npm:has@1.0.1",
      "inherits": "npm:inherits@2.0.3",
      "minimist": "npm:minimist@1.2.0",
      "object-inspect": "npm:object-inspect@1.2.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "resolve": "npm:resolve@1.1.7",
      "resumer": "npm:resumer@0.0.0",
      "string.prototype.trim": "npm:string.prototype.trim@1.1.2",
      "through": "npm:through@2.3.8"
    },
    "npm:through@2.3.8": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:virtual-dom@2.1.1": {
      "browser-split": "npm:browser-split@0.0.1",
      "error": "npm:error@4.4.0",
      "ev-store": "npm:ev-store@7.0.0",
      "global": "npm:global@4.3.0",
      "is-object": "npm:is-object@1.0.1",
      "next-tick": "npm:next-tick@0.2.2",
      "x-is-array": "npm:x-is-array@0.1.0",
      "x-is-string": "npm:x-is-string@0.1.0"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:xmlhttprequest@1.8.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    }
  }
});
