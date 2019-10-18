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

    const postTask = async (e) => {
        e.preventDefault();
        // if field is empty, return and do nothing
        if (!task.length) {
            return;
        }
        const newTask = {
            task: task
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

    const deleteTask = async (id) => {
        const config = {
                method: 'delete',
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

    useEffect(() => {
        console.log("useEffect");
    }, []);
        // this.pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        //     cluster: 'us2',
        //     encrypted: true,
        // });
        // this.channel = this.pusher.subscribe('tasks');
        // this.setState({ ...this.state, isLoading: true }, () => console.log(this.state));
        // this.channel.bind('inserted', this.addTask);
        // this.channel.bind('deleted', this.removeTask);
        // this.setState({ ...this.state, isLoading: false });


    let tasksList = tasks.map(item =>
        <Task
            key={item.id}
            task={item}
            onTaskClick={deleteTask}
        />
    );

    return (
        <div className="todo-wrapper">
            <div>
                {isLoading ? (
                <h1>Carregando...</h1>
                ) : null}
            </div>
            <form>
              <input
                type="text"
                className="input-todo"
                placeholder="New task"
                onChange={updateText}
                value={task} />
              <div
                className="btn btn-add"
                onClick={postTask}
                >
                +</div>
            </form>
            <ul>
              {tasksList}
            </ul>
        </div>
    );
}

// Each item of the list
function Task({ key, task, onTaskClick}) {
    const _onClick = () => {
        onTaskClick(task.id);
    }
    return (
        <li key={task.id}>
            <div className="text">{task.task}</div>
            <div className="delete" onClick={_onClick}>-</div>
        </li>
    );
};