import _ from 'lodash';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Input, Menu, Message, Search, Sidebar } from 'semantic-ui-react'

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
const availableShortcuts = (
  <Message>
    <Message.Header>Available Shortcuts</Message.Header>
    <Message.List className="available-shortcuts">
      <br />
      <Message.Item>/ : focus search</Message.Item>
      <br />
      <Message.Header>ctrl</Message.Header>
      <Message.Item>b : show sidebar</Message.Item>
      <Message.Item>n : show question form</Message.Item>
      <Message.Item>p : show helper</Message.Item>
      <Message.Item>r : render and save (only in notebook)</Message.Item>
      <Message.Item>u : insert date section (only in notebook)</Message.Item>
      <br />
      <Message.Header>option</Message.Header>
      <Message.Item>click : edit text (only in notebook)</Message.Item>
    </Message.List>
  </Message>
)
const textTargets = ["text", "input", "textarea"]

function createNavLink(mainObject, page) {
  return "/" + mainObject.url + "/" + page.url
}

class NavigationHelper extends Component {
  componentDidMount() {
    this.sourcePages = this.createSearchGroups();
    window.addEventListener("keydown", this.toggleHelper, false);
    window.addEventListener("keydown", this.toggleToolTip, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.toggleHelper, false);
    window.addEventListener("keydown", this.toggleToolTip, false);
  }

  constructor(props) {
    super(props);
    this.state = {
      helperVisible: false,
      results: [],
      value: "",
      toolTipVisible: false
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

  toggleToolTip = (event) => {
    if (!textTargets.includes(event.target.type)) {
      if (event.key === '?') {
        this.setState(state => ({
          toolTipVisible: !state.toolTipVisible,
        }));
      }
    }
  }

  resetHelper = () => {
    this.setState({
      helperVisible: false,
      results: [],
      value: ""
    })
  }

  resetToolTip = () => {
    this.setState({
      toolTipVisible: false
    })
  }

  captureClosingEvent = (event) => {
    if (event.keyCode === 27) {
      this.resetHelper()
    }
  }

  render() {
    const { helperVisible, results, value, toolTipVisible } = this.state;

    return (
      <div>
        {toolTipVisible &&
          <div className="tool-tip">
            {availableShortcuts}
          </div>
        }
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
    if (!textTargets.includes(event.target.type)) {
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
      <Menu.Menu position='right' className="right-nav">
        {visible ? (
          <Menu.Item position="right" id="search-container">
            <Input
              id="search-input"
              size="large"
              transparent
              placeholder='Search...'
              onKeyDown={this.listenForBlur}
              onBlur={this.blurSearch}
              autoFocus
            />
          </Menu.Item>
        ) : (
            <Menu.Item icon="search" position="right" onClick={this.focusSearch} />
          )
        }
      </Menu.Menu>
    )
  }
}


class NavigationSideBar extends Component {
  componentWillUnmount() {
    this.handleHideSidebar()
  }

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
        className="side-nav"
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

        <Menu fixed="top" borderless className="top-navigation-menu" size="massive">
          <Menu.Menu position="left" className="left-nav">
            <Menu.Item icon="bars" onClick={this.showSidebar} />
          </Menu.Menu>
          <NavigationSearch {...this.props} />
        </Menu >

        <NavigationSideBar {...this} />
      </div>
    )
  }
}
