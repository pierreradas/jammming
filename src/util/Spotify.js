const client_id = '280cda0ac3b246a894918a46d44f0439';
const client_secret = 'ebe84191ecd54cd5ad2a18f8d5515cba';
const redirect_uri = 'http://localhost:3000';

var request = require('request');
export var Spotify = {
  accessToken: '',
  getAccessToken() {
    if (Spotify.accessToken !== '') {
    } else if (document.URL.match(/access_token=([^&]*)/) !== null) {
        Spotify.accessToken = document.URL.match(/(#access_token[^&]*)/)[0];
        Spotify.accessToken = Spotify.accessToken.substring(14,Spotify.accessToken.length);
        var expiresIn = document.URL.match(/expires_in=([^&]*)/);
        expiresIn = expiresIn[1]
        window.setTimeout(() => Spotify.accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
    } else {
      var urlToGet = 'https://accounts.spotify.com/authorize?'
      + 'client_id=' + client_id
      + '&response_type=token'
      + '&redirect_uri=' + redirect_uri;
      window.location = urlToGet;
      Spotify.accessToken = document.URL.match(/(#access_token[^&]*)/)[0];
      Spotify.accessToken = Spotify.accessToken.substring(14,Spotify.accessToken.length);
      var expiresIn = document.URL.match(/expires_in=([^&]*)/);
      expiresIn = expiresIn[1]
      window.setTimeout(() => Spotify.accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
  },

  search(term) {
    var targetUrl = 'https://api.spotify.com/v1/search?type=track&q=' + term;
    var result = fetch(
      targetUrl, {
        headers: {Authorization: `Bearer ${Spotify.accessToken}`}
      }
    ).then(
      response => {
        if(response.ok) {
          return response.json();
        }
      },
      error => {console.log(error)}
    ).then(
      jsonResponse => {
        var dataArray = [];
        if (jsonResponse.tracks.items.length === 0) {
          alert('No result found!');
        } else {
          jsonResponse.tracks.items.map(element => {
            var track = {};
            track.id = element.id;
            track.name = element.name;
            track.artist = element.artists[0].name;
            track.album = element.album.name;
            track.URI = element.uri;
            dataArray.push(track);
          });
        }

        // alert to show that the function indeed returns an object populated with arrays
        return dataArray;
      }
    );

    return result;
  }
};
