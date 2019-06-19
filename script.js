const searchForm = document.querySelector('#search-form');
const movie = document.querySelector('#movies')

function apiSearch(event) {
  event.preventDefault();  
  const searchText = document.querySelector('.form-control').value;
  const server = 'https://api.themoviedb.org/3/search/multi?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru&query=' + searchText;
  requestApi(server)
    .then(function(result) {

    })
    .catch()
    ;
}

searchForm.addEventListener('submit', apiSearch);

function requestApi(url) {
  return new Promise(function(resolve, reject){
    const request = new XMLHttpRequest();
    request.open('GET');
    request.addEventListener('load', function(){
      if (request.status !== 200){
        reject({status: request.status});
        return;
      }

      resolve(request.response);

    });
    request.addEventListener('error', function(){
      reject({status: request.status});
    });
    request.send();
  });


  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.send();
  request.addEventListener('readystatechange', function() {
    if (request.readyState !== 4){
    movie.innerHTML = 'Загрузка..';
    return;
    }
    if (request.status !== 200){
      movie.innerHTML = 'Упс, что-то пошло не так!'
      console.log('error: ' + request.status);
      return;
    }
    const output = JSON.parse(request.responseText);
    let inner = '';
    output.results.forEach((item) => {
      let nameItem = item.name || item.title;
      console.log(nameItem);
      inner += `<div class="col-4">${nameItem}</div>`;
    });
    movie.innerHTML = inner;  
  })
}