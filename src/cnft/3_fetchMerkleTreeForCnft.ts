// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import {
  fetchMerkleTree,
  fetchTreeConfigFromSeeds,
} from '@metaplex-foundation/mpl-bubblegum';

const fetchMerkleTreeForCnft = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');

  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(bs58.decode(payerSecretKey));

  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Fetching Merkle Tree
  // ----------------------------------------------------
  const merkleTree = publicKey('');
  const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree);
  const treeConfig = await fetchTreeConfigFromSeeds(umi, {
    merkleTree: merkleTree,
  });

  console.log('merkleTree =>', merkleTree);
  console.log('merkleTreeAccount =>', merkleTreeAccount);
  console.log('treeConfig =>', treeConfig);
};

fetchMerkleTreeForCnft();
