import 'dotenv/config'
import { default as axios } from "axios";
import axiosRetry from "axios-retry";
import fetch from 'cross-fetch';

axiosRetry(axios, { retries: 3 });

export async function getProposalById(id) {
    
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

      const response = await fetch(
        'https://hub.snapshot.org'+'/graphql',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Node',
          },
        }
      );
    
      const json = await response.json();
      return json.data.proposal

}