import React, { Component } from 'react';
import {Playlist} from './Components/Playlist/Playlist';
import {SearchResults} from './Components/SearchResults/SearchResults';
import {SearchBar} from './Components/SearchBar/SearchBar';
import './App.css';
import {Spotify} from './util/Spotify';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchResults: [{id: 'id', name: 'name', artist: 'artist', album: 'album'}, {id: 'id2', name: 'name2', artist: 'artist2', album: 'album2'}],
      playlistName: 'My Playlist',
      playlistTracks: [{id: 'id', name: 'name', artist: 'artist', album: 'album'},{id: 'id', name: 'name', artist: 'artist', album: 'album'},{id: 'idss', name: 'name', artist: 'artist', album: 'album'}]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.filter(element => element.id === track.id).len > 0) {
      alert('This song already exists in your playlist!');
    } else {
      var newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  removeTrack(track){
    const tempPlaylist = this.state.playlistTracks;
    const trackPosition = tempPlaylist.indexOf(track);
    tempPlaylist.splice(trackPosition, 1);
    this.setState({playlistTracks: tempPlaylist});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist(playlistName, trackURIs) {
    if (playlistName === '' || trackURIs.length === 0) {
      return;
    } else {
      var accessToken = Spotify.accessToken;
      var header = {Authorization: `Bearer ${Spotify.accessToken}`}
      var userId = '';
      fetch(
        'https://api.spotify.com/v1/me', header
      ).then(
        response => {
          return response.json();
        }
      ).then(
        jsonResponse => {
          alert(Object.getOwnPropertyNames(jsonResponse.error));
          alert(jsonResponse.status);
        }
      )
    }
  }

  search(term) {
    if (Spotify.accessToken === null || Spotify.accessToken === '' ) {
      Spotify.getAccessToken();
    } else {
      console.log('Search term: ' + term);
      Spotify.search(term).then(response => {this.setState({searchResults: response})});
      //alert(typeof(test));
    }
  }

  handleSearch(e) {
    Spotify.search('michel');
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} name={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
          <button onClick={Spotify.getAccessToken}>test getAccessToken</button>
          <button onClick={this.handleSearch}> test request to spotify </button>
        </div>
      </div>
    );
  }
}

export default App;
