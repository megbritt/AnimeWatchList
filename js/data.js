/* exported data */

var data = {
  view: 'search-form',
  searchName: '',
  searchResult: [],
  clickedAnime: {},
  watchlist: {},
  watchlistList: []
};

var prevDataJSON = localStorage.getItem('awl-local-storage');
if (prevDataJSON !== null) {
  data = JSON.parse(prevDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('awl-local-storage', dataJSON);
});
