const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
const apiKey = '19184731-b5d48d0d64c274e2586e4050a';


/*=============Функция выполняющая фетч к АПИ==============*/
export default {
    glSearchQuery: '',
    page: 1,
    fetchImageByQuery() {
    const url = `${BASE_URL}&q=${this.query}&page=${this.page}&per_page=12&key=${apiKey}`;
        return fetch(url)
            .then(res => res.json())
            .then(({ hits }) => { 
                this.page += 1;
                return hits;
            });
    },
    
    resetPage() { 
        this.page = 1;
    },
    get query() { 
        return this.glSearchQuery;
    },
    set query(value) { 
        this.glSearchQuery = value;
    }
}