import path from 'path';
import fs from 'fs-promise';
import _ from 'lodash';
import copy from 'recursive-copy';
import through from 'through2';

const PAGE_NAME_PATTERN = /[A-Za-z]+/;
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates/page');

export default function (params) {
    let pageName = params.name;

    if (!pageName.match(PAGE_NAME_PATTERN)) {
        throw new Error(`App name should match ${PAGE_NAME_PATTERN.toString()}`);
    }

    pageName = _.camelCase(pageName);

    const appPath = path.join(process.cwd(), 'src/app');
    const PageName = _.upperFirst(pageName);
    const options = {
        rename: function (filePath) {
            return filePath
                .replace(/pageName/g, pageName)
                .replace(/PageName/g, PageName);
        },
        transform: function () {
            return through((chunk, enc, done) => {
                done(null, chunk
                    .toString()
                    .replace(/\{\{pageName\}\}/g, pageName)
                    .replace(/\{\{PageName\}\}/g, PageName)
                );
            });
        }
    };

    fs.exists(appPath)
        .catch((err) => Promise.reject('There is no `src/app` path. Are you sure we\'re in mo app folder?'))
        .then(() => copy(TEMPLATES_DIR, appPath, options))
        .then(() => console.log('Happy new page!'))
        .catch((err) => console.error('Error:', err));
}