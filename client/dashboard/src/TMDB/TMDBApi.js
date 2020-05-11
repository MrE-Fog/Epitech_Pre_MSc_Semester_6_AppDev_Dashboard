const BASE_URI = 'https://api.themoviedb.org/3/';
const API_TOKEN = '71e1e5f26620befa85b012ac92955522';

export function getDayFilms() {
    const url = BASE_URI
        + 'movie/now_playing?api_key='
        + API_TOKEN
        + '&language=fr-FR&page=1&region=FR';

    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

export function getPopularFilms() {
    const url = BASE_URI
        + 'discover/movie?api_key='
        + API_TOKEN
        + '&sort_by=popularity.desc';

    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}

export function getRatedFilms() {
    const url = BASE_URI
        + 'discover/movie?api_key='
        + API_TOKEN
        + '&certification_country=US&certification=R&sort_by=vote_average.desc';

    return fetch(url)
        .then((response) => response.json())
        .catch((error) => console.error(error))
}
