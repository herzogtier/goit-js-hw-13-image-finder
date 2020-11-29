import './styles.css';
import imageCard from './templates/image-card.hbs';
// import getRefs from './js/get-refs';
import API from './js/apiService';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import { error } from '@pnotify/core';

// const refs = getRefs();


const refs = {
     imageContainer: document.querySelector('.gallery'),
     imageQueryInput: document.querySelector('input[name="query"]'),
     imageLoadMoreBtn: document.querySelector('[data-action="load-more"]'),
}
const debounce = require('debounce');

refs.imageQueryInput.addEventListener('input', debounce(onSearch, 1000));
refs.imageLoadMoreBtn.addEventListener('click', loadImages);

function pushError(err) {
  error({
    text: `${err}`,
  });
}

/*=============Вспомогательная функция для избежания дублирования кода=========== */
function loadImages() { 
    return API.fetchImageByQuery()
        .then(renderImageCard).finally(scroll);
        
    
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

