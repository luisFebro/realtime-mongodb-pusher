import React, { Component } from 'react';
import './App.css';
import Pusher from 'pusher-js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      tasks: [],
      task: ''
    };
    this.updateText = this.updateText.bind(this);
    this.postTask = this.postTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.addTask = this.addTask.bind(this);
    this.removeTask = this.removeTask.bind(this);
  }

  updateText(e) {
    this.setState({ task: e.target.value });
  }

  postTask(e) {
    e.preventDefault();
    // if field is empty, return and do nothing
    if (!this.state.task.length) {
      return;
    }
    const newTask = {
      task: this.state.task
    };
    this.setState({ isLoading: true });
    fetch("http://localhost:9000/api/new", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    }).then(console.log);
    this.setState({ isLoading: false });
  }

  deleteTask(id) {
    this.setState({ isLoading: true });
    fetch(`http://localhost:9000/api/${id}`, {
      method: 'delete'
    }).then(console.log);
    this.setState({ isLoading: false });
  }

  addTask(newTask) {
    this.setState(prevState => ({
      tasks: prevState.tasks.concat(newTask),
      task: ''
    }));
  }

  removeTask(id) {
    this.setState(prevState => ({
      tasks: prevState.tasks.filter(el => el.id !== id)
    }));
  }

  // componentDidUpdate() {
  //   console.log(this.state);
  // }

  componentDidMount() {
    this.pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: 'us2',
      encrypted: true,
    });
    console.log("pusher", this.pusher);
    this.channel = this.pusher.subscribe('tasks');

    this.channel.bind('inserted', this.addTask);
    this.channel.bind('deleted', this.removeTask);
    console.log("chanel", this.channel);
  }

  render() {
    let tasks = this.state.tasks.map(item =>
      <Task key={item.id} task={item} onTaskClick={this.deleteTask} />
    );

    return (
      <div className="todo-wrapper">
        <div>
            {this.state.isLoading ? (
            <h1>Carregando...</h1>
            ) : null}
        </div>
        <form>
          <input
            type="text"
            className="input-todo"
            placeholder="New task"
            onChange={this.updateText}
            value={this.state.task} />
          <div
            className="btn btn-add"
            onClick={this.postTask}
            >
            +</div>
        </form>

        <ul>
          {tasks}
        </ul>
      </div>
    );
  }
}

// Each item of the list
class Task extends Component {
  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }
  _onClick() {
    this.props.onTaskClick(this.props.task.id);
  }
  render() {
    return (
      <li key={this.props.task.id}>
        <div className="text">{this.props.task.task}</div>
        <div className="delete" onClick={this._onClick}>-</div>
      </li>
    );
  }
}

export default App;
