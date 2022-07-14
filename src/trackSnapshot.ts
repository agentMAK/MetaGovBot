import 'dotenv/config'
import { default as axios } from "axios";
import axiosRetry from "axios-retry";
import events from 'events';

axiosRetry(axios, { retries: 3 });

export class TrackSnapshot {

    _spaces: string[];
    _currentProps: string[];
    _proposalEvents: events;

    constructor(spaces: string[],proposalEvent) {
        this._spaces = spaces;
        this._proposalEvents = proposalEvent
        this.watchSnapshot();
    }

    async watchSnapshot() {
        this._currentProps = await this._getCurrentProposals();
        setInterval(async () => await this._checkNewProp(), parseInt(process.env.DELAY));
    }

    async _checkNewProp() {
         console.log("checking")
        const currentProps = await this._getCurrentProposals();
        console.log(currentProps)
    
        const newProps = currentProps.filter(prop => !this._currentProps.includes(prop));
        console.log(newProps)

        if (newProps.length > 0) {
            console.log("change detected")
            const res = await axios.get("https://ipfs.io/ipfs/" + newProps[0]).catch(err => {
                console.error(err);
                throw err;
            });

            //Fire thp event:
            this._proposalEvents.emit('Proposal Created',res.data);

            // console.log(res.data)


            // const quorum = await getQuorum();
            // const hash = await this._postToSnapshot("bafkreihwndsut3avzkhgoxkqlh4kdyh5upnio666wbrh76mru6vngbj5wa", res.data, quorum);
            // console.log(hash);
            // this._postToDiscord(hash, res.data, quorum);
        }

        this._currentProps = currentProps;
    }

    async _getCurrentProposals(): Promise<string[]> {
        return (await Promise.all(this._spaces.map(async space => {

            const data = JSON.stringify({
              query: `{
                proposals (
                    where: {space_in: ["${space}"]},
                    orderBy: "created",
                    first: 1000000
                ) {
                    id
                    ipfs
                    title
                    created
                }
            }`,
              variables: {}
            });

            const config = {
              method: 'get',
              url: process.env.SNAPSHOT_HUB+'graphql',
              headers: { 
                'Content-Type': 'application/json'
              },
              data : data
            };
            
            const rawProps = (await axios(config as unknown)).data.data.proposals;
            return rawProps.map(prop => prop.ipfs);

        }))).flat();
    }

    async _getIdFromHash(hash: string): Promise<string> {
        const data = JSON.stringify({
            query: `{
              proposals (
                  where: {ipfs: "${hash}"},
              ) {
                  id
              }
          }`,
            variables: {}
          });
          
          const config = {
            method: 'get',
            url: process.env.SNAPSHOT_HUB+'graphql',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          const rawProps = (await axios(config as unknown)).data.data.proposals;
          return rawProps[0].id;

    }

}