import resource from './resource';

export default function (params) {
    resource('page', params)
        .then(() => console.log('Page rests in peace now'))
        .catch((err) => console.error('Error:', err));
}