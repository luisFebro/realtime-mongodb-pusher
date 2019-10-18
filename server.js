const express = require('express');
const { mongoKey } = require('./config/keys');
const mongoose = require('mongoose');
const api = require('./routes/api');
const changeStreamTask = require('./models/change-streams/changeStreamTask');

const app = express();

// CORS - configure an Express server with CORS headers (because the React app is going to be published in a different port), JSON requests, and /api as the path
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Bodyparser Middleware
// Allow the app to accept JSON on req.body
app.use(express.json());

// Dababase connection
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose
    .connect(mongoKey, options)
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log("MONGOERROR, LUIS: " + err));

// Collection changeStreams
changeStreamTask();
// End Collection changeStreams

// router
app.use('/api', api);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


// n1 - insert output's exemple
/*{
  _id:
  {
    _data: Binary {
      _bsontype: 'Binary',
      sub_type: 0,
      position: 49,
      buffer: <Buffer 82 5b 08 8a 2a 00 00 00 01 46 64 5f 69 64 00 64 5b 08 8a 2a 99 a1 c5 0d 65 f4 c4 4f 00 5a 10 04 13 79 9a 22 35 5b 45 76 ba 45 6a f0 69 81 60 af 04>
    }
  },
  operationType: 'insert',
  fullDocument: {
    _id: 5b088a2a99a1c50d65f4c44f,
    task: 'my task',
    __v: 0
  },
  ns: { db: 'tasksDb', coll: 'tasks' },
  documentKey: { _id: 5b088a2a99a1c50d65f4c44f }
}
note: ns means namespace
concept: A namespace is a declarative region that provides a scope to the identifiers (the names of types, functions, variables, etc) inside it.
Namespaces are used to organize code into logical groups and to prevent name collisions that can occur especially when your code base includes multiple libraries
*/


// n2 - output's exemple
/*
    {
      _id:
      {
        _data: Binary {
          _bsontype: 'Binary',
          sub_type: 0,
          position: 49,
          buffer: <Buffer 82 5b 08 8b f6 00 00 00 01 46 64 5f 69 64 00 64 5b 08 8a 2a 99 a1 c5 0d 65 f4 c4 4f 00 5a 10 04 13 79 9a 22 35 5b 45 76 ba 45 6a f0 69 81 60 af 04>
        }
      },
      operationType: 'delete',
      ns: { db: 'tasksDb', coll: 'tasks' },
      documentKey: { _id: 5b088a2a99a1c50d65f4c44f }
    }
 */