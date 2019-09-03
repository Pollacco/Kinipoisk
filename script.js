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
  movie.innerHTML = '<div class="spinner"></div>'; 
  fetch('https://api.themoviedb.org/3/search/multi?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru&query=' + searchText)
  .then(function(value) {
    if (value.status !== 200) {
      return Promise.reject(new Error('Ошибка'));
    }

    return value.json();
  })
  .then((output) =>  {
    let inner = '';
    if(output.results.length === 0) {
      inner = '<h3 class="col-12 text-center text-info" >По Вашему запросу ничего не найдено.</h3>';
    }
    output.results.forEach((item) => {
      let nameItem = item.name || item.title;
      let meadiaType = item.title ? 'movie' : 'tv';
      const posterMain = item.poster_path ? poster + item.poster_path : './images/miss.jpg';
      let dataInfo = `data-id="${item.id}" data-type="${meadiaType}"`;
      inner += `
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 item">
      <img src="${posterMain}" class="imgposter" alt="${nameItem}" ${dataInfo}>
        <h5>${nameItem}</h5>       
      </div>
      `;
    });
    movie.innerHTML = inner; 

    eventMedia();    

  })
  .catch(function() {
    movie.innerHTML = 'Произошла ошибка, повторите Ваш запрос'; 
    console.log(reason || reason.status);
  });
}

searchForm.addEventListener('submit', apiSearch);

function eventMedia() {
  const media = movie.querySelectorAll('img[data-id]');
  media.forEach(function(elem) {
    elem.style.cursor = 'pointer';
    elem.addEventListener('click', renderInfo);
  });
}

function renderInfo() {
let url = '';
if (this.dataset.type === 'movie') {
  url = 'https://api.themoviedb.org/3/movie/' + this.dataset.id + '?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru';
  } else if (this.dataset.type === 'tv') {
    url = 'https://api.themoviedb.org/3/tv/' + this.dataset.id + '?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru';
  } else {
    movie.innerHTML = '<h3 class="col-12 text-center text-info" >Произошла ошибка, повторите запрос</h3>';
  }
  fetch(url)
  .then(function(value) {
    if (value.status !== 200) {
      return Promise.reject(new Error(value.status));
    }
    return value.json();
  })
  .then((output) => {
    movie.innerHTML = `
   <h4 class="col-12 text-center text-info">${output.name || output.title}</h4>
   <div class="text-center col-4">
    <img src="${poster + output.poster_path}" alt = "${output.name || output.title}">
    ${(output.homepage) ? `<p> <a href="${output.homepage}" target="_blank">Официальный сайт</a> </p>` : ''}
    ${(output.imdb_id) ? `<p> <a href="https://imdb.com/title/${output.imdb_id}" target="_blank">Страница на IMDB</a> </p>` : ''}
    
   </div>
   <div class="col-8">
    <p> Рейтинг: ${output.vote_average}</p>
    <p> Статус: ${output.status}</p>
    <p> Премьера: ${output.first_air_date || output.release_date}</p>

    ${(output.last_episode_to_air) ? `<p>${output.number_of_seasons} сезон ${output.last_episode_to_air.episode_number} серий вышло</p>` : ''}

    <p> Описание: ${output.overview}</p>
    <br>

    <div class='youtube'></div>
   </div>
   `;

    getVideo(this.dataset.type, this.dataset.id);

  })
  .catch(function(reason) {
    movie.innerHTML = 'Произошла ошибка, повторите Ваш запрос'; 
    console.error(reason || reason.status);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://api.themoviedb.org/3/trending/all/week?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru&query=')
    .then(function(value) {
      if (value.status !== 200) {
        return Promise.reject(new Error(value.status));
      }
      return value.json();
    })
    .then(function(output) {
      let inner = '<h3 class="col-12 text-center text-info" >Популярные за последнюю неделю:</h3>';
      if(output.results.length === 0) { 
        inner = '<h3 class="col-12 text-center text-info" >По Вашему запросу ничего не найдено.</h3>';
      }
      output.results.forEach(function (item) {
        let nameItem = item.name || item.title;
        let meadiaType = item.title ? 'movie' : 'tv';
        const posterMain = item.poster_path ? poster + item.poster_path : './images/miss.jpg';
        let dataInfo = `data-id="${item.id}" data-type="${meadiaType}"`;
        inner += `
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 item">
        <img src="${posterMain}" class="imgposter" alt="${nameItem}" ${dataInfo}>
          <h5>${nameItem}</h5>       
        </div>
        `;
      });
      movie.innerHTML = inner;
      eventMedia();    
     })
  .catch(function() {
    movie.innerHTML = 'Произошла ошибка, повторите Ваш запрос'; 
    console.log(reason || reason.status);
  });
})

function getVideo(type, id){
  let youtube = movie.querySelector('.youtube');

  fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=4aa4a4d85fab6f23c378901370a0bc82&language=ru`)
  .then((value) => {
    if (value.status !== 200) {
      return Promise.reject(new Error(value.status));
    }
    return value.json();
  })
  .then((output) => {
    let videoFrame = '<h5 class="text-info" >Видео по данному фильму</h5>';

    if(output.results.length === 0) {
      videoFrame = '<p>Видео отсутствует</p>';
    }

    output.results.forEach((item) => {
      videoFrame += '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + item.key + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    });

    youtube.innerHTML = videoFrame;
  })
  .catch((reason) => {
    youtube.innerHTML = 'Видео отсутствует';
  });
  
}