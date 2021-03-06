import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBars, faScrollOld, faPegasus, faSwords, faClouds, faAcorn } from '@fortawesome/pro-regular-svg-icons'
import _ from 'lodash';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Input, Menu, Message, Search, Sidebar } from 'semantic-ui-react'

import 'style/navigation.css'

const mainObjects = [
  { title: "Books", url: "books", icon: <FontAwesomeIcon icon={faScrollOld} /> },
  { title: "Facts", url: "facts", icon: <FontAwesomeIcon icon={faPegasus} /> },
  { title: "Questions", url: "questions", icon: <FontAwesomeIcon icon={faSwords} /> },
  { title: "Topics", url: "topics", icon: <FontAwesomeIcon icon={faClouds} /> },
  { title: "Words", url: "words", icon: <FontAwesomeIcon icon={faAcorn} /> }
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
const resultRenderer = ({ title, icon }) => (
  <div key='content' className='content'>
    <div className='result-icon'>{icon}</div>
    <div className='result-title'>{title}</div>
  </div>
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
    window.removeEventListener("keydown", this.toggleToolTip, false);
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
            icon: mainObject.icon,
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
            selectFirstResult
            showNoResults={false}
            resultRenderer={resultRenderer}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            onBlur={this.resetHelper}
            onKeyDown={this.captureClosingEvent}
            results={results}
            value={value}
            icon={false}
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
            <Menu.Item position="right" onClick={this.focusSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </Menu.Item>
          )
        }
      </Menu.Menu>
    )
  }
}


class NavigationSideBar extends Component {
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
        onVisible={this.props.handleDarken}
        onHide={this.props.resetSidebar}
        target={document.body}
      >
        {mainObjects.map(mainObject => (
          <Menu.Item key={mainObject.title}>
            {mainObject.icon}
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
    this.resetSidebar()
  }

  constructor(props) {
    super(props);
    this.state = {
      sidebarVisible: false
    };
  }

  showSidebar = () => this.setState({ sidebarVisible: true })
  handleDarken = () => document.getElementById("dark-overlay").classList.add("visible");
  handleUndarken = () => document.getElementById("dark-overlay").classList.remove("visible");
  resetSidebar = () => {
    this.setState({
      sidebarVisible: false
    }, () => {
      this.handleUndarken();
    })

  }
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

        <Menu fixed="top" borderless className="top-nav-menu" size="massive">
          <Menu.Menu position="left" className="left-nav">
            <Menu.Item onClick={this.showSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </Menu.Item>
          </Menu.Menu>
          <NavigationSearch {...this.props} />
        </Menu >

        <NavigationSideBar {...this} />
        <div id="dark-overlay"></div>
      </div>
    )
  }
}
