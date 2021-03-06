import React, { Component } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'

import { logIn } from 'api'

import 'style/entry.css'


class LogInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      username: null,
      password: null,
    };
  }

  handleFormSubmit = (event) => {
    const data = new FormData(event.target)
    logIn(data)
      .then(response => {
        localStorage.setItem('token', response.data.access);
        this.props.history.push('/questions/')
      })
      .catch(_ => {
        this.setState({ error: true })
        this.resetForm()
      })
  }

  resetForm = () => {
    document.getElementById("login-form").reset();
    document.getElementById("login-form-first").focus();
  }

  render() {
    const { error } = this.state;

    return (
      <Form
        onSubmit={this.handleFormSubmit}
        error={error}
        id="login-form"
      >
        <Message error content="Invalid username or password" />
        <Form.Input id="login-form-first" placeholder="Email or Username..." name="username" autoCapitalize="none" autoFocus />
        <Form.Input placeholder='Password' name="password" type="password" />
        <Button type='submit'>Submit</Button>
      </Form>
    )
  }
}

export default class Entry extends Component {
  componentDidMount() {
    document.body.classList.add("entry-page")
  }

  componentWillUnmount() {
    document.body.classList.remove("entry-page")
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showLogIn = () => this.setState({ visible: true })

  render() {
    const { visible } = this.state;

    return (
      <div className="entry">
        {!visible &&
          <div onClick={this.showLogIn} className="entry-header">
            Organizer
          </div>
        }
        {visible &&
          <LogInForm {...this.props} />
        }
      </div>
    );
  }
}
