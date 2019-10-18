const mongoose = require('mongoose');
const Pusher = require('pusher');
const { pusherKey, pusherSecret } = require('../../config/keys');
const db = mongoose.connection;

const pusher = new Pusher({
    appId: '882281',
    key: pusherKey,
    secret: pusherSecret,
    cluster: 'us2',
    useTLS: true,
});

const channel = 'tasks';

function changeStreamTask() {
    db.on('error', console.error.bind(console, 'Connection Error:'));
    db.once('open', () => {
        //watching any update in tasks collection
        const taskCollection = db.collection('my-tasks');
        const changeStream = taskCollection.watch();

        changeStream.on('change', (change) => {
            console.log(change);

            //When there’s a change in the collection,
            //  a change event is received. In particular,
            //  the following changes are supported:
            //  Insert, Update, Replace, Delete, Invalidate
            if (change.operationType === 'insert') { // n1 (output's exemple)
                const task = change.fullDocument;
                pusher.trigger(
                    channel,
                    'inserted', {
                        id: task._id,
                        task: task.task,
                    }
                );
            } else if (change.operationType === 'delete') { // n2 (output's exemple)
                pusher.trigger(
                    channel,
                    'deleted',
                    change.documentKey._id
                );
            }
        });
    });
}

module.exports = changeStreamTask;