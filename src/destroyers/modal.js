import resource from './resource';

export default function (params) {
    resource('modal', params)
        .then(() => console.log('Modal rests in peace now'))
        .catch((err) => console.error('Error:', err));
}