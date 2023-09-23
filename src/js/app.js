import { getPhotos } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchMessage = document.querySelector('#search-message');

let page = 1;
let totalHits = 0;
let lightbox = null;

const showMessage = message => {
  searchMessage.textContent = message;
  searchMessage.style.display = 'block';
  searchMessage.style.opacity = '1';
  searchMessage.style.maxHeight = '1';

  setTimeout(() => {
    hideMessage();
  }, 3000);
};

const hideMessage = () => {
  searchMessage.style.opacity = '0';
  searchMessage.style.maxHeight = '1';

  setTimeout(() => {
    searchMessage.style.display = 'none';
  }, 700);
};

const onSubmit = async e => {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return alert('Empty query');
  }

  try {
    const res = await getPhotos(page, searchQuery);
    totalHits = res.totalHits;
    renderImages(res.hits);

    const message = `Hooray! We found ${totalHits} images.`;
    showMessage(message);

    if (page * 40 < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }

    console.log(res);
  } catch (error) {
    console.error(error);
  }
};

formEl.addEventListener('submit', onSubmit);

const renderImages = images => {
  const fragmentImg = document.createDocumentFragment();

  images.forEach(image => {
    const li = document.createElement('li');
    li.classList.add('gallery-card');
    li.innerHTML = `<a class="link" href="${image.largeImageURL}">
    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item"><b>Likes:</b> ${image.likes}</p>
      <p class="info-item"><b>Views:</b> ${image.views}</p>
      <p class="info-item"><b>Comments:</b> ${image.comments}</p>
      <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
    </div>
  </a>`;

    fragmentImg.appendChild(li);
  });

  gallery.appendChild(fragmentImg);
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery-card a', {
      captionsData: 'alt',
      captionDelay: 250,
      captions: true,
      animationSpeed: 250,
    });
  }

  gallery.querySelectorAll('.gallery-card a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      lightbox.open(a);
    });
  });
};

const onLoadMore = async () => {
  page += 1;
  const searchQuery = document
    .querySelector('input[name="searchQuery"]')
    .value.trim();

  try {
    const res = await getPhotos(page, searchQuery);
    renderImages(res.hits);
    if (page * 40 >= res.totalHits) {
      loadMoreBtn.style.display = 'none';
      alert("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error(error);
  }
};

loadMoreBtn.addEventListener('click', onLoadMore);

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

const scrollOptions = {
  top: cardHeight * 2,
  behavior: 'smooth',
  duration: 1000,
};

window.scrollBy(scrollOptions);
