#!/bin/bash
cd dist
gzip 0.*.chunk.js
gzip 1.*.chunk.js
gzip 2.*.chunk.js
gzip inline.*.js
gzip main.*.js
gzip vendor.*.js
gzip styles.*.bundle.css
