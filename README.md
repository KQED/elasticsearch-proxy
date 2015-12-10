# elasticsearch-proxy

## About
A proxy between ww2 and the Elasticsearch content cluster. Has endpoints for retrieving documents from Elasticsearch and adding documents to Elasticsearch

## Requirements
- Node.js ^4.x.x
- npm

## Getting Started
- Clone or fork the repo
- Navigate to the repo directory
- run ``npm install`` in the terminal
- copy over test.sh to exports.sh and put in your Elasticsearch url endpoints
- run ``source exports.sh``
- run ``node server.js``
- You can interact with the server.js api endpoints using HTTP requests
  - Locally, the server will be ``localhost:8080``

## Run Tests
  - Run tests using ``npm test``
    - These tests are dependant upon test.sh existing, so make sure you don't overwrite the script when you create exports.sh

## Endpoints
- GET ``/radio/keywords``
  - Will retrieve radio Elasticsearch documents with a keyword or set of keywords
  - Request query parameter of keywords is required, ex. ``/radio/keywords?keywords=Paris``
- GET ``/radio/programs``
  - Will retrieve radio Elasticsearch documents filtered by specific program (ex. Forum)
  - Request query paramter of program is required
  - User can also optionally pass in a keyword or series of keywords, ex. ``/radio/programs?program=Forum&keyword=Paris``
- GET ``/radio/dates``
  - Will retrieve radio Elasticsearch documents given a date range
  - Request query parameter startDate is required
    - Date should be passed in using the YYYY-MM-DD format, ex. ``/radio/dates?startDate=2015-11-25``
    - User can optionally pass in an endDate, otherwise the date range will default to just the startDate value (1 day)
  - User can also optionally pass in a program query parameter to filter a program's content based on date range
- POST ``/radio/posts``
  - Adds WordPress post data to Elasticsearch
  - Data should be in a JSON object and a parameter of ID is required
  - Endpoint will be restricted by IP
- DELETE ``/radio/posts``
  - Removes WordPress post data to Elasticsearch
  - Data should be in a JSON object and a parameter of ID is required
  - Endpoint will be restricted by IP
- PUT ``/radio/posts``
  - Updates WordPress post data to Elasticsearch, creates a new document if it doesn't already exist
  - Data should be in a JSON object and a parameter of ID is required
  - Endpoint will be restricted by IP
