import { getPhotos } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';

const formEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let totalHits = 0;
let lightbox = null;

formEl.addEventListener('submit', onSubmit);

async function onSubmit(e) {
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

    if (page * 40 < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }

    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

function renderImages(images) {
  const fragmentImg = document.createDocumentFragment();

  images.forEach(image => {
    const li = document.createElement('li');
    li.classList.add('gallery-card');

    li.innerHTML = `<img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" width=/>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>`;

    fragmentImg.appendChild(li);
  });

  gallery.appendChild(fragmentImg);

  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery-card img', {
      captionsData: 'alt',
      captionDelay: 250,
      captions: true,
      animationSpeed: 250,
    });
  }

  gallery.querySelectorAll('.gallery-card img').forEach(img => {
    img.addEventListener('click', () => {
      lightbox.open(img);
    });
  });
}

const onLoadMore = () => {
  page++;

  const searchQuery = document
    .querySelector('input[name="searchQuery"]')
    .value.trim();

  getPhotos(page, searchQuery)
    .then(res => {
      renderImages(res.hits);

      if (page * 40 >= res.totalHits) {
        loadMoreBtn.style.display = 'none';
        alert("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => {
      console.error(error);
    });
};

loadMoreBtn.addEventListener('click', onLoadMore);
