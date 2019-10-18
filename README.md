# realtime-mongodb-pusher
React application that allows you to add and delete tasks. It communicates to an API implemented in Node.js that saves the changes to a database. The Node.js script also receives these changes using change streams, parsing them and publishing them to a Pusher channel so the React application can consume them.

Follow the tutorial [here](https://pusher.com/tutorials/mongodb-change-streams).

### This code was adapted and modified by Luis Febro
