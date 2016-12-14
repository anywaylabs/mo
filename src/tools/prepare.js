import {exec} from 'child_process';

export default function () {
    exec('./phonegap/prepare', (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }

        if (stderr) {
            console.error(stderr);
        }

        console.log(stdout);
    });
}