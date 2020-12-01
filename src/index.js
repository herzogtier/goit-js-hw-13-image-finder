import './styles.css';
import imageCard from './templates/image-card.hbs';
// import getRefs from './js/get-refs';
import API from './js/apiService';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';
// import { onClickImg } from './js/large-img';

// const refs = getRefs();


const refs = {
     imageContainer: document.querySelector('.gallery'),
     imageQueryInput: document.querySelector('input[name="query"]'),
    imageLoadMoreBtn: document.querySelector('[data-action="load-more"]'),
}
const debounce = require('debounce');
const basicLightbox = require('basiclightbox')

refs.imageQueryInput.addEventListener('input', debounce(onSearch, 1000));
refs.imageLoadMoreBtn.addEventListener('click', () => { 
  loadImages().catch(error => pushError('Не найдены картинки по вашему запросу!!!')).finally(scroll);
});

refs.imageContainer.addEventListener('click', openLightBox);




function openLightBox(event) {
  const set = { src: event.target.dataset.source, alt: event.target.alt };
  openImage(set);
}

function openImage({ src, alt }) {
  const instance = basicLightbox.create(`
  <div class="full-image-container">
  <img src="${src}" alt="${alt}" />
  <a class="download" href="${src}" download="${
    alt.split(',')[0]
  }" target="_blank" /><i class="material-icons">cloud_download</i></a>
  </div>
`);
  instance.show();
}

function pushError(err) {
  error({
    text: `${err}`,
  });
}

/*=============Вспомогательная функция для избежания дублирования кода=========== */
function loadImages() { 
    return API.fetchImageByQuery()
        .then(renderImageCard);
        
    
}

/*=============Функция выполняющая скролл=========================================*/
function scroll() {
  const { y } = refs.imageContainer.getBoundingClientRect();
  const screenHeight = document.documentElement.clientHeight;
   window.scrollTo({
    top: screenHeight - y,
    behavior: 'smooth'
  });
}

/*=============Функция поиска картинок============================================*/
function onSearch(e) {
    e.preventDefault();
    clearResult();
    API.query = refs.imageQueryInput.value;
    if (API.query.length === 0) {
        clearResult();
        refs.imageLoadMoreBtn.classList.remove('btn');
        refs.imageLoadMoreBtn.classList.add('is-hidden');
        
        return;
    } else {
        API.resetPage();
        loadImages().catch(error => pushError('Не найдены картинки по вашему запросу!!!'));
        refs.imageLoadMoreBtn.classList.remove('is-hidden');
        refs.imageLoadMoreBtn.classList.add('btn');
        
    }
}

/*=============Функция очищения результатов исполнения разметки при очищении инпут*/
function clearResult() { 
    refs.imageContainer.innerHTML = '';
}

/*=============Функция рендеринга разметки из шаблона=============================*/
function renderImageCard(image) {   
    
    const markup = imageCard(image);
    refs.imageContainer.insertAdjacentHTML('beforeend', markup);
    
    if (image.length === 0) { 
         pushError('Не можем найти картинки по вашему запросу!!!');
    }
    
}

