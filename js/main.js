var $form = document.querySelector('form');
var $searchInput = document.querySelector('.search-input');
var $viewNodeList = document.querySelectorAll('.view');
var $searchedList = document.querySelector('.searched-list');
var $resultText = document.querySelector('.results-text');
var $infoTitle = document.querySelector('.info-page-title');
var $infoRuntime = document.querySelector('.runtime');
var $infoPoster = document.querySelector('.info-page-poster');
var $infoScore = document.querySelector('.score');
var $infoMembers = document.querySelector('.members');
var $infoGenres = document.querySelector('.genres');
var $infoSynopsis = document.querySelector('.synopsis');

function clickBackButton(event) {
  if (event.target.className !== 'back-button') {
    return;
  }
  if (event.target.getAttribute('data-view') === 'search-form') {
    switchViews('search-form');
    data.view = 'search-form';
    $searchedList.textContent = '';
  } else if (data.view === 'anime-info') {
    switchViews('search-results');
    data.view = 'search-results';
  }
}

document.addEventListener('click', clickBackButton);

function handleSubmit() {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=' + $searchInput.value);
  data.searchName = $searchInput.value;
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.searchResult = xhr.response.results;
    generateAnimeSearchResults(data);
  });
  xhr.send();
  switchViews('search-results');
  data.view = 'search-results';
  $resultText.textContent = 'Search results for  "' + $searchInput.value + '"';
  document.querySelector('body').className = 'bg-dark-cyan';
  document.querySelector('.nav-bar').className = 'nav-bar row view space-between';
}

$form.addEventListener('submit', handleSubmit);

function switchViews(viewName) {
  for (var i = 0; i < $viewNodeList.length; i++) {
    if ($viewNodeList[i].getAttribute('data-view') === viewName) {
      $viewNodeList[i].className = 'view';

    } else {
      $viewNodeList[i].className = 'view hidden';
    }
  }
}

function generateAnimeSearchResults(data) {
  for (var i = 0; i < data.searchResult.length; i++) {
    if (data.searchResult[i].image_url === null) {
      data.searchResult[i].image_url = '../images/poster_placeholder.jpg';
    }
    var $li = document.createElement('li');

    var $cardDiv = document.createElement('div');
    $cardDiv.className = 'result-card padding-top';
    $li.appendChild($cardDiv);

    var $centerTextDiv = document.createElement('div');
    $centerTextDiv.className = 'text-align-center';
    $cardDiv.appendChild($centerTextDiv);

    var $imgUrl = document.createElement('img');
    $imgUrl.setAttribute('src', data.searchResult[i].image_url);
    $imgUrl.className = 'result-poster';
    $centerTextDiv.appendChild($imgUrl);

    var $infoDiv = document.createElement('div');
    $infoDiv.className = 'result-info';
    $cardDiv.appendChild($infoDiv);

    var $name = document.createElement('h3');
    $name.className = 'result-name';
    $name.textContent = data.searchResult[i].title;
    $name.setAttribute('anime-id', data.searchResult[i].mal_id);
    $name.addEventListener('click', clickInfoButton);
    $infoDiv.appendChild($name);

    var $resultOverview = document.createElement('p');
    $resultOverview.className = 'result-overview';
    $resultOverview.textContent = data.searchResult[i].type + ': ' + data.searchResult[i].episodes;
    $infoDiv.appendChild($resultOverview);

    var $score = document.createElement('p');
    $score.className = 'result-overview';
    $score.textContent = 'Score: ' + data.searchResult[i].score.toFixed(2);
    $resultOverview.appendChild($score);

    var $members = document.createElement('p');
    $members.className = 'result-classname';
    $members.textContent = numberWithCommas(data.searchResult[i].members) + ' Members';
    $score.appendChild($members);

    $searchedList.append($li);
  }
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

document.addEventListener('DOMContentLoaded', function () {
  switchViews(data.view);
  generateAnimeSearchResults(data);
  $resultText.textContent = 'Search results for "' + data.searchName + '"';
});

function handleWatchListButton(event) {
  switchViews('search-form');
  data.view = 'search-form';
  $form.reset();
  data.searchResult = [];
  data.searchName = '';
  $searchedList.textContent = '';
  document.querySelector('body').className = 'bg-blue';
  document.querySelector('.nav-bar').className = 'nav-bar row view hidden';
}

document.querySelector('.mywatchlist-button').addEventListener('click', handleWatchListButton);

function clickInfoButton(event) {
  if (!event.target.matches('.result-name')) {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/anime/' + event.target.getAttribute('anime-id'));
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    data.clickedAnime = xhr.response;
    generateInfoPage(data);
  });
  xhr.send();
  switchViews('anime-info');
  data.view = 'anime-info';
}

$searchedList.addEventListener('click', clickInfoButton);

function generateInfoPage(data) {
  $infoPoster.setAttribute('src', data.clickedAnime.image_url);

  $infoTitle.textContent = data.clickedAnime.title;

  if (data.clickedAnime.episodes === 1) {
    $infoRuntime.textContent = data.clickedAnime.type + ': ' + data.clickedAnime.episodes + ' Episode';
  } else {
    $infoRuntime.textContent = data.clickedAnime.type + ': ' + data.clickedAnime.episodes + ' Episodes';
  }

  $infoScore.textContent = data.clickedAnime.score.toFixed(2);

  $infoMembers.textContent = numberWithCommas(data.clickedAnime.members) + ' Members';

  var genre = '';
  for (var k = 0; k < data.clickedAnime.genres.length; k++) {
    if (k !== data.clickedAnime.genres.length - 1) {
      genre += data.clickedAnime.genres[k].name + ', ';
    } else {
      genre += data.clickedAnime.genres[k].name;
    }
    $infoGenres.textContent = genre;
  }

  $infoSynopsis.textContent = data.clickedAnime.synopsis;

}
