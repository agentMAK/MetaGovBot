import 'dotenv/config'
import { default as axios } from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

export async function getProposalById(id) {

  console.log("fetch")
    
    const data = JSON.stringify({
        query: `query Proposal ($proposalId: String!){
                    proposal(id:$proposalId) {
                        id
                        title
                        body
                        discussion
                        choices
                        start
                        end
                        snapshot
                        state
                        author
                        space {
                            id
                            name
                        }
                    }
                }`,
        variables: { "proposalId":id  }
      });
      
      const config = {
        method: 'post',
        url: 'https://hub.snapshot.org'+'/graphql',
        headers: { 
          'Content-Type': 'application/json',
        },
        data : data
      };

      const response = await axios(config as unknown)
      console.log("fetched")
      return response.data.data.proposal

}