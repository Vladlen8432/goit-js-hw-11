import axios from 'axios';

const API_KEY = '22356210-f5a6fb995cd777b2b01184cc9';
const BASE_URL = 'https://pixabay.com/api/';

export function getPhotos(page, query) {
  return axios
    .get(`${BASE_URL}/?`, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page,
      },
    })
    .then(res => res.data);
}
