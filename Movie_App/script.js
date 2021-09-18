const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=943ceec460504f86ded7a51476887abf&page=';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=943ceec460504f86ded7a51476887abf&page=';
let TRAILER_API = 'https://api.themoviedb.org/3/movie/'
const VIDEO_PATH = '/videos?api_key=943ceec460504f86ded7a51476887abf&append_to_response=videos';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=';


const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const buttons = document.querySelectorAll('.btn')
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const pageNumber = document.getElementById('pageNumber');
const totalPages = document.getElementById('totalpage');
let totalPageEl = 500;
let pageNum = 1;
let searchFlag = false;
let sTerm = '';

getMovies(API_URL,pageNum);

async function getMovies(url, pagenumber){
    searchFlag = false;
    const res = await fetch(url+pagenumber);
    const data = await res.json();
    showMoview(data.results);
}

async function searchByMovies(url,searchterm, pagenumber){
    const res = await fetch(url+pagenumber+'&query='+searchterm);
    const data = await res.json();
    totalPageEl = data.total_pages;
    totalPages.innerText = `/${totalPageEl}`;
    showMoview(data.results);
}


function showMoview(movies){
    main.innerHTML = '';

    movies.forEach(async function(movie){

        const {title,poster_path,vote_average,id} = movie;

        let trailer_path = '';
        let youtubePath = '';
        trailer_path = TRAILER_API + id +VIDEO_PATH; 
        const res = await fetch(trailer_path);
        const data = await res.json();

        if(data.results.length > 0){
            youtubePath = YOUTUBE_URL + data.results[0].key;
        }

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${IMG_PATH+poster_path}" alt="Poster is not available">
            <a href="${youtubePath}" target="_black"><i class="far fa-play-circle"></i></a>
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            `
            ;
        
        main.appendChild(movieEl);
    })

    window.scrollTo(0,0);
}

function getClassByRate(vote){
    return vote >= 8 ? 'green' : vote>=5 ? 'orange':'red';
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    sTerm = search.value;

    if(sTerm && sTerm !== ''){
        searchFlag = true;
        pageNum = 1;
        pageNumber.innerText = `${pageNum}`;
        searchByMovies(SEARCH_API, sTerm, pageNum);
        search.value = '';
    }else{
        window.location.reload();
    }
})

nextBtn.addEventListener('click', ()=>{
    pageNum++;
    if(pageNum > 1){
        prevBtn.disabled = false;
    }
    if(pageNum === totalPageEl){
        nextBtn.disabled = true;
    }

    pageNumber.innerText = `${pageNum}`;
    if(!searchFlag){
        getMovies(API_URL,pageNum);
    }else{
        searchByMovies(SEARCH_API, sTerm, pageNum);
    }
    
})

prevBtn.addEventListener('click', ()=>{
    pageNum--;
    if(pageNum === 1){
        prevBtn.disabled = true;
    }
    if(pageNum < totalPageEl){
        nextBtn.disabled = false;
    }

    pageNumber.innerText = `${pageNum}`;
    if(!searchFlag){
        getMovies(API_URL,pageNum);
    }else{
        searchByMovies(SEARCH_API, sTerm, pageNum);
    }
})