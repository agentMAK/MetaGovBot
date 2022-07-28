import 'dotenv/config'
import {getProposalById} from "./utils/graphQL"
import events from 'events';
import express from 'express';
import postToSnapshot from './src/postToSnapshot';

const app = express()
app.use(express.json());

app.post("/" ,(req, res) => {
    const event = req.body

    console.log("received")

    if(event.event == "proposal/created") {
        if(process.env.WATCHED_SPACES.split(",").includes(event.space)){
            const id = event.id.substring(9)
            console.log(id)
            proposalEvents.emit('Proposal Created',id);

        }
    }
    res.sendStatus(200);
})

app.get("/", (req, res) => {
    res.send("Express on Vercel");
  });




const proposalEvents = new events.EventEmitter();

proposalEvents.on('Proposal Created', async (id) => {
    const proposal = await getProposalById(id);
    console.log(proposal)
    //postToSnapshot(proposal);
});


app.listen(8080)

module.exports = app;