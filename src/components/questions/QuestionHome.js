import * as d3 from "d3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import React, { Component } from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { Button, Card, Form, Message } from 'semantic-ui-react'

import Notebook from 'components/Notebook'
import AppNavigation from 'components/Navigation'
import { coreObjectList, getRandomSubset } from 'api'

import 'style/questions.css';


class QuestionViewHistogram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedData: null,
      selectedWindow: null
    };
  }

  componentDidMount() {
    this.drawHistogram()
  }

  binQuestions = (bins, data) => {
    bins.forEach(bin => {
      data.forEach(question => {
        if (bin.x0 <= question.num_views && question.num_views < bin.x1) {
          bin.push(question)
        }
      })
    });
    return bins
  }

  handleUpdateSelection = (selection, barElement) => {
    if (barElement !== this.state.selectedWindow) {
      this.updateSelection(selection, barElement)
    } else {
      this.resetSelection()
    }
  }

  updateSelection = (selection, barElement) => {
    d3.selectAll("rect").attr("fill", "steelblue");
    d3.select(barElement).attr("fill", "green");
    this.setState({
      visible: true,
      selectedData: selection,
      selectedWindow: barElement
    })
  }

  resetSelection = () => {
    d3.selectAll("rect").attr("fill", "steelblue");
    this.setState({
      visible: false,
      selectedData: null,
      selectedWindow: null
     });
  }

  drawHistogram = () => {
    const data = this.props.questions;
    const mainWidth = document.getElementById("root").clientWidth;
    const mainHeight = 200;
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };
    const height = mainHeight - margin.top - margin.bottom;
    const width = mainWidth - margin.left - margin.right;
    const thisComponent = this;
    var numBins = 20;

    var svg = d3.select(".chart")
      .attr("width", mainWidth)
      .attr("height", mainHeight);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    var maxViews = d3.max(data, d => d.num_views);
    if (maxViews < 10) {
      maxViews = 10
      numBins = 10
    }
    const xScale = d3.scaleLinear()
      .domain([0, maxViews]).nice()
      .range([0, width - margin.right]);

    const histogram = d3.histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(numBins));

    var bins = this.binQuestions(histogram(data), data);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .rangeRound([height, 0]);

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    var bar = chart.selectAll(".bar")
      .data(bins)
      .enter()
      .append("g")
      .attr("class", "g");

    bar.append("rect")
      .attr("fill", "steelblue")
      .attr("x", d => xScale(d.x0) + 1)
      .attr("y", d => yScale(d.length))
      .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr('height', d => yScale(0) - yScale(d.length))
      .style("cursor", "pointer")
      .on("click", function (d) {
        thisComponent.handleUpdateSelection(d, this);
      })

    bar.append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle")
      .attr("x", d => xScale(d.x0) + ((xScale(d.x1) - xScale(d.x0)) / 2))
      .attr("y", d => yScale(d.length) + 15)
      .text(d => d.length);

    chart.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 7)
      .attr('text-anchor', 'middle')
      .text('Question Views');
  }
  render() {
    const { visible, selectedData } = this.state;

    return (
      <div className="histogram">
        <svg className="chart" >
        </svg>

        {visible &&
          <QuestionList questions={selectedData} />
        }
      </div>
    )
  }
}


function QuestionList(props) {
  return (
    <div>
      <Card.Group itemsPerRow={1}>
        {props.questions.map(question => (
          <Card
            key={question.id}
            className="question-link"
          >
            <Card.Content>
              <Card.Header className="question-card-clickable" as="a" href={`/questions/${question.id}`}>
                {question.question}
              </Card.Header>
              <Card.Meta>
                {moment(question.created_at_utc).format('ll')}
              </Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  )
}

function QuestionLinks() {
  const links = [
    { title: "SlateStarCodex", url: "https://slatestarcodex.com" },
    { title: "LessWrong", url: "https://lesswrong.com" },
    { title: "The Zvi", url: "https://thezvi.wordpress.com" },
    { title: "Overcoming Bias", url: "http://www.overcomingbias.com" },
    { title: "Melting Asphalt", url: "http://meltingasphalt.com" }
  ]

  return (
    <div>
      <Card.Group itemsPerRow={2} doubling>
        {links.map(link => (
          <Card
            key={link.title}
            className="question-link"
          >
            <Card.Content>
              <Card.Header className="question-card-clickable" as="a" href={link.url} target="_blank" rel="noopener noreferrer">{link.title}</Card.Header>
              <Card.Meta>{link.url}</Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  )
}

class QuestionForm extends Component {
  componentDidMount() {
    window.addEventListener("keydown", this.handleShowQuestionForm, false);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleShowQuestionForm, false);
  }

  constructor(props) {
    super(props);
    this.questionForm = React.createRef();
    this.state = {
      visible: false,
      error: null,
      success: null,
      errorMessage: null,
      questionID: null,
      question: null
    };
  }

  handleShowQuestionForm = (event) => {
    if (event.ctrlKey && event.key === 'n') {
      window.removeEventListener("keydown", this.handleShowQuestionForm, false);
      this.showQuestionForm()
    }
  }

  showQuestionForm = () => {
    this.setState({
      visible: true
    }, () => {
      window.scrollTo({
        top: this.questionForm.current.offsetTop,
        behavior: "smooth"
      });
    })
  }

  handleQuestionFormSubmit = (event) => {
    const data = new FormData(event.target)
    coreObjectList("question")
      .post(data)
      .then(response => {
        this.setState({
          success: true,
          questionID: response.data.id,
          question: response.data.question
        }, () => {
          document.getElementById("question-form").reset();
        });
        setTimeout(function () {
          this.setState({ success: null });
        }.bind(this), 5000);
      })
      .catch(error => {
        this.setState({
          error: true,
          errorMessage: error
        });
        setTimeout(function () {
          this.setState({ error: null, errorMessage: null });
        }.bind(this), 5000);
      })
  }

  render() {
    const { visible, error, success, errorMessage, question, questionID } = this.state;

    return (
      <div>
        {!visible &&
          <Button icon circular size="huge" className="create-button" onClick={this.showQuestionForm} >
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </Button >
        }
        {visible &&
          <div ref={this.questionForm}>
            <p className="question-header">Create</p>
            <Form
              onSubmit={this.handleQuestionFormSubmit}
              error={error}
              success={success}
              id="question-form"
            >
              <Form.Input className="question-form-input" placeholder='Rating' type='number' max={100} name="rating" />
              <Form.TextArea className="question-form-input" placeholder='Question' name="question" />
              <Message
                success
                header='Question Created'
                as={NavLink}
                to={`/questions/${questionID}`}
                content={question}
              />
              <Message error header='Form Error' content={errorMessage} />
              <Button type='submit'>Submit</Button>
            </Form>
          </div>
        }
      </div>
    );
  }
}


export default class QuestionHome extends Component {
  componentDidMount() {
    coreObjectList("question")
      .get()
      .then(response => {
        this.setState({
          questions: response.data,
          loadingData: false
        });
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.props.history.push("/")
          localStorage.setItem("token", null)
        } else {
          console.log(error)
        }
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      loadingData: true
    };
  }

  render() {
    const { questions, loadingData } = this.state;
    return (
      <div className="question-page">
        {!loadingData &&
          <div>
            <AppNavigation {...this.props} />

            <div className="question-section">
              <QuestionViewHistogram questions={questions} />
            </div>

            <div className="question-section">
              <p className="question-header">Random Questions</p>
              <QuestionList questions={getRandomSubset(questions, 5)} name="random" />
            </div>

            <div className="question-section">
              <p className="question-header">Links</p>
              <QuestionLinks />
            </div>

            <div className="question-section">
              <QuestionForm />
            </div>

            <div className="notebook">
              <p className="question-header">Notebook</p>
              <Notebook {...this.props} />
            </div>
          </div>
        }
      </div>
    );
  }
}
