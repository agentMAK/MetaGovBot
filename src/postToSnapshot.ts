import snapshot from "@snapshot-labs/snapshot.js";
import { ethers, Wallet } from "ethers";
import { getAddress } from "@ethersproject/address";
import getQuorum from "../utils/getQuorum";
import "dotenv/config";


const hub = process.env.SNAPSHOT_HUB;
const client = new snapshot.Client712(hub);

const postToSnapshot = async (proposal) => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_URL
  );
  const signer: Wallet = new Wallet(process.env.PRIV_KEY, provider);
  const account = await signer.getAddress();

  const quorum = await numberWithCommas(await getQuorum());

  try {
    const receipt = await client.proposal(signer, getAddress(account), {
      space: process.env.SPACE_NAME,
      type: "single-choice",
      title: "[" +proposal.space.name+ "] "+proposal.title,
      body: "This MetaGovernance vote is for voting on "+proposal.space.name+"'s latest proposal using Index Products.\n\nThe quorum for this vote is "+ quorum+" INDEX - **[5% Circulating Supply](https://dune.com/queries/569413)**.\n\nPlease review the on-chain vote of the proposal here in the link below;",
      discussion: proposal.discussion,
      choices: proposal.choices,
      start: proposal.start,
      end: proposal.end - 24 * 60 * 60,
      snapshot: await signer.provider.getBlockNumber(),
      plugins: "{}",
    });

    console.log(receipt);
  } catch(error) {
    console.log(error)
  }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}


export default postToSnapshot;

