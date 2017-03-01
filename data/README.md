EDITING DATASETS
================

* The draft weighted-means tool for loaded with these datasets is at this URL:
   https://dv-lse.github.io/treatment-selection-tool/

 * Adding, removing and revising datasets can be done via GitHub at this page's URL:
    https://github.com/dv-lse/treatment-selection-tool/tree/gh-pages/data

* Each prospective dataset is in a separate comma-separated file, one row for each drug and one for each measurement.  e.g.:

| name          | effectiveness | risk |
| ------------- | ------------- | ---- |
| *Ibuprofin*   | 0.7           | 1.2  |
| *Ponstan*     | 0.9           | 0.9  |
| ...           | ...           | ...  |

* The top-left column MUST be 'name'.  
  - Otherwise, drugs and measurements can be named as desired.  
  - Values should be decimal numbers, with any sum.

* You must be logged in to GitHub to add, edit or remove datasets.

* If a dataset is malformed - e.g. a row has the wrong number of columns - you will be notified of this in the file preview.
  - The visualisation itself will not flag a bad dataset, however.

* NB. Any change or deletion can be reversed at a later date, so do not worry about breaking the tool.


Previewing a dataset
====================

* Click the file name


Editing an existing dataset
===========================

* From a dataset preview, click the pencil.  You can edit or paste the file in CSV format.

* Click "Commit changes" when done.  (No need for an update title or description)

* Refresh the visualisation page to reload the data.


Adding a dataset
================

* Click "Create new file"

* Provide a file name for the dataset.  The extension must be '.csv'.

* Type or paste CSV data

  [ Alternatively, click "Upload files" and drag a CSV file into the upload box ]

* Click "Commit new file"

* Refresh the visualisation page to load the data.


Removing a dataset
==================

* From a file preview, click the trash icon

* Click "Commit changes"

* Refresh the visualisation page.
