import snapshot from '@snapshot-labs/snapshot.js';
import { ethers, Wallet, providers  } from "ethers";
import 'dotenv/config'

const hub = 'https://testnet.snapshot.org';
const client = new snapshot.Client712(hub);



const postToSnapshot = async () => {

    const provider: providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider("https://eth-rinkeby.alchemyapi.io/v2/tuI0i3btdgtVs3Yxs3cnT35bvvKZwJ4_");
    const signer: Wallet = new Wallet(process.env.PRIV_KEY, provider);
    const account = await signer.getAddress();

    console.log(account)

    const now = Math.floor(Date.now()/1000);

    try {

        const receipt = await client.proposal(signer,account, {
            space: "londonuk.eth",
            type: "single-choice",
            title: "Test proposal using Snapshot",
            body: "body",
            discussion: "",
            choices: ['Hellow'],
            start: now,
            end:1657543232,
            snapshot: await signer.provider.getBlockNumber(),
            plugins: "",
        });
    } catch (e) {
        console.error(e);
    }
}

postToSnapshot()