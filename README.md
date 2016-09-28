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


Staging deploy to Github Pages
==============================

git checkout gh-pages
git rebase master

jspm bundle index.js --inject --minify

git add config.js build.*
git commit --amend --no-edit
git push github gh-pages --force


Move Github Edits on gh-pages back to master
============================================

# cherry pick each new commit in order
git checkout master
git cherry-pick <HASH>   # for each new commit on github/gh-pages
# update the gh-pages branch
git checkout gh-pages
git rebase master
# delete the old cherry-picked commits
git checkout github/gh-pages
git reset --hard gh-pages
