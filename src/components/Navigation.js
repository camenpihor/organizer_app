import _ from 'lodash'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Search, Sidebar } from 'semantic-ui-react'

import '../style/navigation.css'

const mainObjects = [
  { title: "Books", url: "books" },
  { title: "Facts", url: "facts" },
  { title: "Questions", url: "questions" },
  { title: "Topics", url: "topics" },
  { title: "Words", url: "words" }
]
const pages = [
  { title: "Home", url: "" },
  { title: "Archive", url: "archive" },
  { title: "Stats", url: "stats" }
]
function createNavLink(mainObject, page) {
  return "/" + mainObject.url + "/" + page.url
}

class NavigationHelper extends Component {
  componentDidMount() {
    this.sourcePages = this.createSearchGroups();
    window.addEventListener("keydown", this.toggleHelper, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.toggleHelper, false);
  }

  constructor(props) {
    super(props);
    this.state = {
      helperVisible: false,
      results: [],
      value: ""
    };
  }

  createSearchGroups = () => {
    let searchGroups = []
    mainObjects.map(mainObject =>
      pages.map(page =>
        searchGroups.push(
          {
            object: mainObject.title,
            title: mainObject.title + " " + page.title,
            page: page.title,
            url: createNavLink(mainObject, page)
          }
        )
      )
    )
    return searchGroups
  }

  handleResultSelect = (e, { result }) => {
    if (result.url !== this.props.location.pathname) {
      this.props.history.push(result.url)
    } else {
      this.resetHelper()
    }
  }

  handleSearchChange = (e, { value }) => {
    const values = value.split(" ")
    const objectPattern = values[0]
    const pagePattern = values[1]

    const reObject = new RegExp("^" + _.escapeRegExp(objectPattern), 'i')
    const rePage = new RegExp("^" + _.escapeRegExp(pagePattern), 'i')
    let isMatch

    if (pagePattern) {
      isMatch = result => reObject.test(result.object) && rePage.test(result.page)
    } else {
      isMatch = result => reObject.test(result.object) || reObject.test(result.page)
    }

    this.setState({
      value: value,
      results: _.filter(this.sourcePages, isMatch),
    })
  }

  toggleHelper = (event) => {
    if (event.ctrlKey && event.key === 'p') {
      this.setState(state => ({
        helperVisible: !state.helperVisible,
        value: "",
        results: []
      }));
    }
  }

  resetHelper = () => {
    this.setState({
      helperVisible: false,
      results: [],
      value: ""
    })
  }

  captureClosingEvent = (event) => {
    if (event.keyCode === 27) {
      this.resetHelper()
    }
  }

  render() {
    const { helperVisible, results, value } = this.state;

    return (
      <div>
        {helperVisible &&
          <Search
            className="helper"
            autoFocus
            defaultOpen
            selectFirstResult
            showNoResults={false}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            onBlur={this.resetHelper}
            results={results}
            value={value}
            icon={false}
            onKeyDown={this.captureClosingEvent}
            onScroll={console.log("hi")}
          />
        }
      </div>
    );
  }
}


class NavigationSearch extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.focusSearch, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.focusSearch, false);
  }

  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.state = {
      results: [],
      value: ""
    };
  }

  focusSearch = (event) => {
    if (event.target.type !== "text") {
      if (event.key === "/") {
        this.searchInput.current.focus();
        event.preventDefault();
      }
    }
  }

  blurSearch = (event) => {
    if (event.keyCode === 27) {
      event.target.blur();
      this.setState({ value: "" })
    }
  }

  handleResultSelect = (e, { result }) => console.log(result)
  handleSearchChange = (e, { value }) => {
    this.setState({
      value: value,
    })
  }

  render() {
    const { results, value } = this.state
    return (
      <Search
        id="navigation-search"
        input={{
          ref: this.searchInput,
          onKeyDown: this.blurSearch,
          value: value
        }}
        selectFirstResult
        showNoResults={false}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        value={value}
      />
    )
  }
}


class NavigationSideBar extends Component {
  render() {
    return (
      <Sidebar
        id="side-navigation"
        as={Menu}
        animation='overlay'
        icon='labeled'
        onHide={this.props.hideSidebar}
        vertical
        visible={this.props.state.sidebarVisible}
        width='thin'
      >
        {mainObjects.map(mainObject => (
          <Menu.Item key={mainObject.title}>
            <Menu.Header>{mainObject.title}</Menu.Header>
            <Menu.Menu>
              {pages.map(page => (
                <Menu.Item
                  key={page.title}
                  as={NavLink}
                  to={createNavLink(mainObject, page)}
                  content={page.title}
                  activeClassName="activeNavLink"
                  exact
                />
              ))}
            </Menu.Menu>
          </Menu.Item>
        ))}
      </Sidebar>
    )
  }
}


export default class AppNavigation extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.toggleSideBar, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.toggleSideBar, false);
  }

  constructor(props) {
    super(props);
    this.state = {
      sidebarVisible: false
    };
  }

  showSidebar = () => this.setState({ sidebarVisible: true })
  hideSidebar = () => this.setState({ sidebarVisible: false })
  toggleSideBar = (event) => {
    if (event.ctrlKey && event.key === 'b') {
      this.setState(state => ({
        sidebarVisible: !state.sidebarVisible
      }));
    }
  }

  render() {
    return (
      <div className="top-nav">
        <NavigationHelper {...this.props} />

        <Menu fixed="top" borderless id="top-navigation">
          <Menu.Menu position="left" id="left-nav">
            <Menu.Item icon="bars" onClick={this.showSidebar} />
          </Menu.Menu>
          <Menu.Menu position='right' id="right-nav">
            <NavigationSearch {...this.props} />
          </Menu.Menu>
        </Menu >

        <NavigationSideBar {...this} />
      </div>
    )
  }
}
