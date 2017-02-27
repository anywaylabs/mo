#!/bin/bash

cd ..
npm run build
rm -rf phonegap/www
mkdir phonegap/www
cp build/* phonegap/www/
cd phonegap
