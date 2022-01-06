var $form = document.querySelector('form');
var $searchInput = document.querySelector('.search-input');
var $viewNodeList = document.querySelectorAll('.view');
var $searchedList = document.querySelector('.searched-list');
var $resultText = document.querySelector('.results-text');

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
}

$form.addEventListener('submit', handleSubmit);

function switchViews(viewName) {
  for (var i = 0; i < $viewNodeList.length; i++) {
    if ($viewNodeList[i].getAttribute('data-view') === viewName) {
      $viewNodeList[i].className = 'view';
      document.querySelector('body').className = 'bg-dark-cyan';
      document.querySelector('.nav-bar').className = 'nav-bar row view';
    } else {
      $viewNodeList[i].className = 'view hidden';
      document.querySelector('body').className = 'bg-blue';
      document.querySelector('.nav-bar').className = 'nav-bar row view hidden';
    }
  }
}

function generateAnimeSearchResults(data) {
  for (var i = 0; i < data.searchResult.length; i++) {
    if (data.searchResult[i].image_url === null) {
      data.searchResult[i].image_url = 'images/poster_placeholder.jpg';
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
}

document.querySelector('.mywatchlist-button').addEventListener('click', handleWatchListButton);
