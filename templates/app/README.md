## Awesome app on mo framework

### Cold install: deps and mo CLI
```bash
npm i
npm i mo-framework -g
```

### Start the development server
```bash
mo serve
```

### Use generators to create things
```bash
# Generate new page with .js, .hbs and .less files
mo generate page Profile

# Generate new modal with .js, .hbs and .less files
mo generate modal Connection
```

### Setup PhoneGap for iOS and Android
```bash
cd phonegap
phonegap platform add ios
phonegap platform add android
cd ../
```

### Run/emulate with PhoneGap
```bash
npm run phonegap
```

### Release to iOS
Open `phonegap/platforms/ios/{{AppName}}.xcodeproj` in Xcode. Archive and upload to App Store.

### Release to Android
Add keystore to `phonegap/secure/app.keystore`. Run `cd phonegap/ && ./build_android`. Then upload `phonegap/platforms/android/build/outputs/apk/android-release.apk` to Google Play Development Console.

<sub>Get [mo knowledge](https://github.com/anywaylabs/mo) about this mo 🐍 framework</sub>

