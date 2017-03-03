#!/bin/bash

cd ..
npm run build -- --env.phonegap
rm -rf phonegap/www
mkdir phonegap/www
cp build/* phonegap/www/
cd phonegap
