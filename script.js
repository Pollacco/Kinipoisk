const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies')

function apiSearch(event) {
  event.preventDefault();  
  const searchText = document.querySelector('.form-control').value;
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru&query=' + searchText;
  movie.innerHTML = 'Загрузка..'; 
  fetch(server)
  .then(function(value) {
    if (value.status !== 200) {
      return Promise.reject(new Error('Ошибка'))
    }

    return value.json()
  })
  .then(function(output) {
    let inner = '';
    output.results.forEach((item) => {
      let nameItem = item.name || item.title;
      inner += `<div class="col-12 col-md-4 col-xl-3"> ${nameItem} </div>`;
    });
    movie.innerHTML = inner; 
  })
  .catch(function() {
    movie.innerHTML = 'Произошла ошибка, повторите Ваш запрос'; 
    console.log('error' + reason.status);
  });
}

searchForm.addEventListener('submit', apiSearch);
