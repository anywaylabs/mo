import resource from './resource';

export default function (params) {
    resource('modal', params)
        .then(() => console.log('Happy new modal!'))
        .catch((err) => console.error('Error:', err));
}