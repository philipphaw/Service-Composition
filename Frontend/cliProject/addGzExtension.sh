#!/bin/bash
cd dist
sed -i '' -e 's/chunk.js/chunk.js.gz/g' inline.*.js
sed -i '' -e 's/bundle.js/bundle.js.gz/g' index.html
sed -i '' -e 's/bundle.css/bundle.css.gz/g' index.html