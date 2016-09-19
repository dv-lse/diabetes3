State
=====

- dataset: name of current dataset
- weights: hash of { metric[m] -> [0.0-1.0] }, shared across datasets
- datasets: names of available datasets
- data: hash of { dataset[n] -> rows }

* if we use virtual dom, animations between states become difficult
* if we use d3, the update loop becomes complex


Layout
======

- composite page: use two columns
- within each slider: use flexbox
