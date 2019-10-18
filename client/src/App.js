import React, { useState, useEffect } from 'react';
import './App.css';
import Pusher from 'pusher-js';

export default function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");

    const updateText = e => {
        setTask(e.target.value);
    }

    async postTask(e) {
        e.preventDefault();
        // if field is empty, return and do nothing
        if (!this.state.task.length) {
            return;
        }
        const newTask = {
            task: this.state.task
        };

        const config = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        }
        try {
            const res = await fetch("http://localhost:9000/api/new", config);
            console.log("resFetch", res);
        } catch (e) {
            // statements
            console.log("errorFetchPost" + e);
        }
    }

    async deleteTask(id) {
        const config = {
                method: 'delete';
            }
        try {
            const res = await fetch(`http://localhost:9000/api/${id}`, config)
            console.log("resDelete", res);
        } catch(e) {
            console.log("errorDelete" + e);
        }
    }

    const addTask = newTask => {
        setTasks(tasks.push(newTask)); //maybe will go wrong
        setTask("");
    }

    const removeTask = id => {
        setTasks(tasks.filter(el => el.id !== id));
    }

    componentDidMount() {
        this.pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
            cluster: 'us2',
            encrypted: true,
        });
        this.channel = this.pusher.subscribe('tasks');
        this.setState({ ...this.state, isLoading: true }, () => console.log(this.state));
        this.channel.bind('inserted', this.addTask);
        this.channel.bind('deleted', this.removeTask);
        this.setState({ ...this.state, isLoading: false });
    }

    render() {
        let tasks = this.state.tasks.map(item =>
            <Task key={item.id} task={item} onTaskClick={this.deleteTask} />
        );

        return (
            <div className="todo-wrapper">
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
          {this.state.isLoading ? (
            <h1>Carregando...</h1>
            ) : tasks}
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