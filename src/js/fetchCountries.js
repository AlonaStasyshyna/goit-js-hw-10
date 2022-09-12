const BASE_URL = 'https://restcountries.com/v3.1/name/';
const QUERY_FILTRES = 'fields=name,capital,population,flags,languages';

export const fetchCountries = name => {
  return fetch(`${BASE_URL}${name}?${QUERY_FILTRES}`).then(resp => {
    if (!resp.ok) {
      throw new Error();
    }
    return resp.json();
  });
};
