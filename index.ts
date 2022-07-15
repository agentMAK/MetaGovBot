import 'dotenv/config'
import {TrackSnapshot} from "./src/trackSnapshot"
import events from 'events';
import postToSnapshot from './src/postToSnapshot'


const proposalEvents = new events.EventEmitter();
proposalEvents.on('Proposal Created',(data) => postToSnapshot(data.data));

const track = new TrackSnapshot(process.env.WATCHED_SPACES.split(","),proposalEvents);


console.log("watching for new proposals...")