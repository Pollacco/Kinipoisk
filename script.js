const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies');
const poster = 'https://image.tmdb.org/t/p/w500';

function apiSearch(event) {
  event.preventDefault();  
  const searchText = document.querySelector('.form-control').value;
  if(searchText.trim().length === 0) {
    movie.innerHTML = '<h3 class="col-12 text-center text-danger" >Поле поиска не должно быть пустым</h3>';
    return;
  }
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru&query=' + searchText;
  movie.innerHTML = '<div class="spinner"></div>'; 
  fetch(server)
  .then(function(value) {
    if (value.status !== 200) {
      return Promise.reject(new Error('Ошибка'))
    }

    return value.json()
  })
  .then(function(output) {
    let inner = '';
    if(output.results.length === 0) {
      inner = '<h3 class="col-12 text-center text-info" >По Вашему запросу ничего не найдено.</h3>';
    }
    output.results.forEach((item) => {
      let nameItem = item.name || item.title;
      const posterMain = item.poster_path ? poster + item.poster_path : './images/miss.jpg';
      inner += `
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 item">
      <img src="${posterMain}" class="imgposter" alt="${nameItem}">
        <h5>${nameItem}</h5>       
      </div>
      `;
    });
    movie.innerHTML = inner; 
  })
  .catch(function() {
    movie.innerHTML = 'Произошла ошибка, повторите Ваш запрос'; 
    console.log('error' + reason.status);
  });
}

searchForm.addEventListener('submit', apiSearch);
