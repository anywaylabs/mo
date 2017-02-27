#!/bin/bash

current=$(cat config.xml | grep -oE versionCode=\"\\d+\" | grep -oE \\d+)
next=$((current+1))
sed -E -i '' "s/android-versionCode=\"[0-9]+\"/android-versionCode=\"$next\"/" config.xml
sed -E -i '' "s/ios-CFBundleVersion=\"[0-9]+\"/ios-CFBundleVersion=\"$next\"/" config.xml
echo "Build version raised to $next from $current"
