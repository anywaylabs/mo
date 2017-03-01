echo "Building for Android..."
cp -rf ./res/* platforms/android/res
phonegap build android --release -- --keystore="./secure/app.keystore" --storePassword=YOUR_PASSWORD_HERE --alias=app --password=YOUR_PASSWORD_HERE
open platforms/android/build/outputs/apk/
echo "Building for Android done."
