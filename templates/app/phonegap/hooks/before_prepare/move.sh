#!/bin/bash
set -e

rm -rf ./www/*
cp ../build/* ./www/
rm ./www/index.html
mv ./www/index-cordova.html ./www/index.html
