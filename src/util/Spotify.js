const client_id = '280cda0ac3b246a894918a46d44f0439';
const client_secret = 'ebe84191ecd54cd5ad2a18f8d5515cba';
const redirect_uri = 'http://localhost:3000';


var accessToken = '';
export var Spotify = {
  getAccessToken() {
    if (accessToken !== '') {
      console.log('Token already existing: ' + accessToken);
    } else {
      var urlToGet = 'https://accounts.spotify.com/authorize'
      + '?'
      + 'client_id=' + client_id + '&'
      + 'response_type=token&'
      + 'redirect_uri=' + redirect_uri
      alert('will get: ' + urlToGet);
      fetch(
        urlToGet
      ).then(
        response => {
          alert(Object.getOwnPropertyNames(response));
        },
        errorMessage => {
          alert(Object.getOwnPropertyNames(errorMessage));
          alert(errorMessage.message);
        }
      );
    }
  }
};
