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
            const task = change.fullDocument;
            const channel = 'realtime-database-pusher';
            let event = null;
            let dataToPush = null;

            switch(change.operationType) {
                case 'insert':
                    event = 'inserted';
                    dataToPush = {
                        id: task._id,
                        task: task.task,
                    }
                    return pusher.trigger(channel, event, dataToPush);
                case 'delete':
                    event = 'deleted';
                    dataToPush = change.documentKey._id;
                    return pusher.trigger(channel, event, dataToPush);
                default:
                    console.log("default change Stream. Did not match anything");
            }
        });
    });
}

module.exports = changeStreamTask;