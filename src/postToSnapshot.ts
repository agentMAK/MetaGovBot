import snapshot from "@snapshot-labs/snapshot.js";
import { ethers, Wallet } from "ethers";
import { getAddress } from "@ethersproject/address";
import getQuorum from "../utils/getQuorum";
import "dotenv/config";


const hub = process.env.SNAPSHOT_HUB;
const client = new snapshot.Client712(hub);

const postToSnapshot = async (data) => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
  );
  const signer: Wallet = new Wallet(process.env.PRIV_KEY, provider);
  const account = await signer.getAddress();

  const proposal = data.message
  const quorum = await numberWithCommas(await getQuorum());

  
  const receipt = await client.proposal(signer, getAddress(account), {
    space: "londonuk.eth",
    type: "single-choice",
    title: '[Aave] '+proposal.title,
    body: "This MetaGovernance vote is for voting on Aave's latest proposal using Index Products.\n\nThe quorum for this vote is "+ quorum+" INDEX - **[5% Circulating Supply](https://dune.com/queries/569413)**.\n\nPlease review the on-chain vote of the proposal here in the link below;",
    discussion: proposal.discussion,
    choices: proposal.choices,
    start: proposal.start,
    end: proposal.end,
    snapshot: await signer.provider.getBlockNumber(),
    plugins: "{}",
  });

  console.log(receipt);
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


export default postToSnapshot;

