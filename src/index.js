import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryCard = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearchInput, DEBOUNCE_DELAY));

function onSearchInput(e) {
  const searchName = e.target.value.trim();
  countryList.innerHTML = '';
  countryCard.innerHTML = '';

  if (!searchName) {
    return;
  }

  fetchCountries(searchName).then(showResultOfSearch).catch(showErrorOfSearch);
}

function createCountryItems(items) {
  return items
    .map(({ name: { official: officialName }, flags: { svg: imgFlag } }) => {
      return `
        <li class="country-item">
            <img
                class="country-flag"
                src="${imgFlag}" 
                alt="Flag of ${officialName}" 
                width="30"
                height="20"
            />
            <h1 class="country-name">${officialName}</h1>
        </li>
        `;
    })
    .join('');
}

function createCountryCard(item) {
  return item
    .map(
      ({
        flags: { svg: imgFlag },
        name: { official: officialName },
        capital,
        population,
        languages,
      }) => {
        return `
        <div class="country">
            <img
                class="country-flag"
                src="${imgFlag}"
                alt="Flag of ${officialName}" 
                width = "30"
                height="20"
            />
            <h1 class="country-name">${officialName}</h1>
        </div>
        <p class="country-capital"><span class="country-capital-bold">Capital:</span> ${capital}</p>
        <p class="country-population"><span class="country-capital-bold">Population:</span> ${population}</p>
        <p class="country-languages"><span class="country-capital-bold">Languages:</span> ${Object.values(
          languages
        )}</p>
        `;
      }
    )
    .join('');
}

function showResultOfSearch(resp) {
  if (resp.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (resp.length > 1) {
    return countryList.insertAdjacentHTML(
      'afterbegin',
      createCountryItems(resp)
    );
  }

  return countryCard.insertAdjacentHTML('afterbegin', createCountryCard(resp));
}

function showErrorOfSearch() {
  return Notify.failure('Oops, there is no country with that name');
}
