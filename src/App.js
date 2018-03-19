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
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.handleSaveTracks = this.handleSaveTracks.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.filter(element => element.id === track.id).length > 0) {
      alert('This song already exists in your playlist!');
    } else {
      var newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({playlistTracks: newPlaylist});
    }
  }

  savePlaylist(playlistName, tracksUri){
    Spotify.createPlaylist(playlistName);
    Spotify.playlistAddTracks(tracksUri)
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

  search(term) {
    if (Spotify.accessToken === null || Spotify.accessToken === '' ) {
      Spotify.getAccessToken();
    } else {
      console.log('Search term: ' + term);
      Spotify.search(term).then(response => {this.setState({searchResults: response})});
    }
  }

  handleSearch(e) {
    Spotify.search('michel');
  }

  async handleSaveTracks() {
    var tracks = [];
    this.state.playlistTracks.map(element => {tracks.push(element.URI)});
    await Spotify.createPlaylist(this.state.playlistName);
    Spotify.playlistAddTracks(tracks);
  }

  render() {
    return (
      <div>
      {Spotify.getAccessToken()}
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistTracks={this.state.playlistTracks} name={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.handleSaveTracks}/>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
