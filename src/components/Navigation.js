import _ from 'lodash'
import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Icon, Input, Menu, Search, Sidebar } from 'semantic-ui-react'

import 'style/navigation.css'

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
            size="large"
          />
        }
      </div>
    );
  }
}


class NavigationSearch extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.listenForSearch, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.listenForSearch, false);
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  listenForSearch = (event) => {
    if (event.target.type !== "text") {
      if (event.key === "/") {
        this.focusSearch(event)
      }
    }
  }

  listenForBlur = (event) => {
    if (event.keyCode === 27) {
      this.blurSearch(event)
    }
  }

  focusSearch = (event) => {
    this.setState({ visible: true })
    event.preventDefault();
  }

  blurSearch = (event) => {
    event.target.blur();
    this.setState({ visible: false, value: "" })
  }

  render() {
    const { visible } = this.state
    return (
      <Menu.Item position="right">
        {visible ? (<Input
          id="search-input"
          size="large"
          transparent
          placeholder='Search...'
          onKeyDown={this.listenForBlur}
          onBlur={this.blurSearch}
          autoFocus
        />) : (<Icon name="search" onClick={this.focusSearch} fitted />)
        }
      </Menu.Item>
    )
  }
}


class NavigationSideBar extends Component {
  handleShowSidebar = () => {
    document.body.classList.add("sidebar-visible");
  }

  handleHideSidebar = () => {
    document.body.classList.remove("sidebar-visible");
    this.props.hideSidebar();
  }

  render() {
    return (
      <Sidebar
        id="side-navigation"
        as={Menu}
        animation='overlay'
        icon='labeled'
        vertical
        visible={this.props.state.sidebarVisible}
        width='thin'
        onVisible={this.handleShowSidebar}
        onHide={this.handleHideSidebar}
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

        <Menu fixed="top" borderless id="top-navigation" size="massive">
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
