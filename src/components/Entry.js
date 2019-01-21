import React, { Component } from 'react'

import 'style/entry.css'

export default class Entry extends Component {
  render() {
    return (
      <div className="entry">
        <header className="entry-header">
          <a href="questions/">Organizer</a>
        </header>
      </div>
    );
  }
}
