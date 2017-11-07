import path from 'path';
import fs from 'fs-promise';
import _ from 'lodash';
import copy from 'recursive-copy';
import through from 'through2';

const RESOURCE_NAME_PATTERN = /[a-z][A-Za-z]+/;

export default function (resourceType, params) {
    let resourceName = _.lowerFirst(params.name);

    if (!resourceName.match(RESOURCE_NAME_PATTERN)) {
        throw new Error(`Resource name should match ${RESOURCE_NAME_PATTERN.toString()}`);
    }
    
    const appPath = path.join(process.cwd(), 'src/app');
    const templatesPath = path.resolve(__dirname, `../../templates/${resourceType}`);

    const ResourceType = _.upperFirst(resourceType);
    const ResourceName = _.upperFirst(resourceName);
    const re = {
        name: new RegExp(`${resourceType}Name`, 'g'),
        capitalName: new RegExp(`${ResourceType}Name`, 'g'),
        placeholder: new RegExp(`\{\{${resourceType}Name\}\}`, 'g'),
        capitalPlaceholder: new RegExp(`\{\{${ResourceType}Name\}\}`, 'g')
    };
    const options = {
        overwrite: params.options.force,
        rename: function (filePath) {
            return filePath
                .replace(re.name, resourceName)
                .replace(re.capitalName, ResourceName);
        },
        transform: function () {
            return through((chunk, enc, done) => {
                done(null, chunk
                    .toString()
                    .replace(re.placeholder, resourceName)
                    .replace(re.capitalPlaceholder, ResourceName)
                );
            });
        }
    };

    return fs.exists(appPath)
        .then((exists) => !exists && Promise.reject('There is no `src/app` folder. Seems we are not in mo project directory.'))
        .then(() => copy(templatesPath, appPath, options))
        .catch((err) => Promise.reject(err && err.code == 'EEXIST' ? 'Files exist. Run with `--force` to overwrite.' : err));
}