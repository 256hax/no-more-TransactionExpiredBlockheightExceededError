// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  keypairIdentity,
  generateSigner,
} from '@metaplex-foundation/umi';
import {
  createTree,
} from '@metaplex-foundation/mpl-bubblegum';

const createMerkleTree = async () => {
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
  //  Create Merkle Tree
  // ----------------------------------------------------
  // Max Depth / Max Buffer Size Table:
  //  https://developers.metaplex.com/bubblegum/create-trees#creating-a-bubblegum-tree
  const merkleTree = generateSigner(umi);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  });
  const confirmResult = await builder.sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('signature =>', bs58.encode(confirmResult.signature));
  console.log('result =>', confirmResult.result);
};

createMerkleTree();
