const client_id = '280cda0ac3b246a894918a46d44f0439';
const client_secret = 'ebe84191ecd54cd5ad2a18f8d5515cba';
const redirect_uri = 'http://localhost:3000';

var request = require('request');
export var Spotify = {
  accessToken: '',
  userId: '',
  playlistId: '',
  trackArray: '',

  getAccessToken() {
    if (Spotify.accessToken !== '') {
      if (Spotify.userId === '') {
        Spotify.getUserId();
      }
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
      + '&redirect_uri=' + redirect_uri
      + '&scope=' + 'playlist-modify-public';
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
        return dataArray;
      }
    );

    return result;
  },

  async createPlaylist(playlistName) {
    // returns id of a newly created playlist
    if (Spotify.userId === '') {
      Spotify.getUserId();
    } else {
      await fetch(
        `https://api.spotify.com/v1/users/${Spotify.userId}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Spotify.accessToken}`,
            "Content-Type": 'application/json',
          },
          body: JSON.stringify({
            name: "test"
          })
        }
      ).then(
          response => {
            if (response.status !== 200 && response.status !== 201){
              alert('issue with request: ' + response.status);
            } else {
              return response.json();
            }
          }
      ).then(
        jsonResponse => {
          Spotify.playlistId = jsonResponse.id;
          return jsonResponse.id;
        }
      );
    }
  },

  async playlistAddTracks(trackUris){
    fetch(
      `https://api.spotify.com/v1/users/${Spotify.userId}/playlists/${Spotify.playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Spotify.accessToken}`,
          "Content-Type" : 'aplication/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      }
    ).then(
      response => {
        if (response.status !== 201){
          alert('issue with request: ' + response.status);
        } else {
          alert('success: ' + response.status);

        }
      }
    );
  },

  getToken() {
    alert(Spotify.accessToken);
  },

  getUserId() {
    // retrieves user id from spotify API
    var header = {
      "Authorization": `Bearer ${Spotify.accessToken}`,
    };
    fetch(
      'https://api.spotify.com/v1/me',
      {
        method: 'GET',
        headers: header
      }
    ).then(
        response => {
          if (response.status !== 200) {
            alert('issue with your request as request status is ' + response.status);
          } else {
            return response.json();
          }
        }
    ).then(
      jsonResponse => {
        Spotify.userId = jsonResponse.id;
        return jsonResponse.id;
      }
    );
  },

};
