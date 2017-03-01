import path from 'path';
import fs from 'fs-promise';

const APP_NAME_PATTERN = /\w+/;
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates/app');

export default function (params) {
    const appName = params.name;

    if (!appName.match(APP_NAME_PATTERN)) {
        throw new Error(`App name should match ${APP_NAME_PATTERN.toString()}`);
    }

    const appPath = path.join(process.cwd(), appName);
    
    fs.mkdir(appPath)
        .catch((err) => Promise.reject('Failed to create directory, does it already exist?'))
        .then(() => fs.copy(TEMPLATES_DIR, appPath))
        .then(() => console.log(`Project created! Now run \`cd ${appName} && npm i\`.`))
        .catch((err) => console.error('Error:', err));
}