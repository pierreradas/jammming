import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.search = this.search.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  search(e) {
      this.props.onSearch(this.state.keyword);
  }

  handleChange(e) {
    this.setState({keyword: e.target.value});
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }
}
