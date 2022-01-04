var $form = document.querySelector('form');
var $searchInput = document.querySelector('.search-input');

function handleSubmit() {
  event.preventDefault();
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.jikan.moe/v3/search/anime?q=' + $searchInput.value);
  xhr.responseType = 'json';
  xhr.send();
}

$form.addEventListener('submit', handleSubmit);
