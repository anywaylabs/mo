import path from 'path';
import fs from 'fs-promise';
import {map, camelCase, upperFirst, some} from 'lodash';
import vow from 'vow';

const RESOURCE_NAME_PATTERN = /[A-Za-z]+/;

export default function (resourceType, params) {
    let resourceName = params.name;

    if (!resourceName.match(RESOURCE_NAME_PATTERN)) {
        throw new Error(`Resource name should match ${RESOURCE_NAME_PATTERN.toString()}`);
    }

    resourceName = camelCase(resourceName);

    const appPath = path.join(process.cwd(), 'src/app');
    const templatesPath = path.resolve(__dirname, `../../templates/${resourceType}`);

    const ResourceType = upperFirst(resourceType);
    const ResourceName = upperFirst(resourceName);
    const re = {
        name: new RegExp(`${resourceType}Name`, 'g'),
        capitalName: new RegExp(`${ResourceType}Name`, 'g')
    };

    return fs.exists(appPath)
        .then((exists) => !exists && Promise.reject('There is no `src/app` folder. Seems we are not in mo project directory.'))
        .then(() => fs.walk(templatesPath))
        .then((templateFiles) => vow.all(
            templateFiles
                .map((file) => path.relative(templatesPath, file.path))
                .filter((filepath) => filepath.match(re.name) || filepath.match(re.capitalName))
                .map((filepath) => filepath.replace(re.name, resourceName).replace(re.capitalName, ResourceName))
                .map((filepath) => {
                    const absolute = path.resolve(appPath, filepath);
                    const relative = path.join('src/app', filepath);

                    return fs.exists(absolute)
                        .then((exists) => ({exists, absolute, relative}))
                })
        ))
        .then((filesInfo) => vow.all(
            filesInfo
                .map(({exists, absolute, relative}) => {
                    if (exists) {
                        return fs.remove(absolute)
                            .then(() => console.log(`Removed ${path.join('src/app', relative)}`))
                            .then(() => ({deleted: true}))
                    } else {
                        console.log(`${relative} does not exist`);

                        return {deleted: false};
                    }
                })
        ))
        .then((results) => some(results, 'deleted') || Promise.reject('Nothing was deleted'));
}