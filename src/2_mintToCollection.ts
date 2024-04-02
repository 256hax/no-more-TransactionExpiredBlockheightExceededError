// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Metaplex
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { mintToCollectionV1 } from '@metaplex-foundation/mpl-bubblegum';

const mintToCollection = async () => {
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
  //  Minting to a Collection
  // ----------------------------------------------------
  // Replace to your Merkle Tree.
  const merkleTree = publicKey('');
  // Replace to your Collection NFT.
  const collectionMint = publicKey(
    ''
  );
  const collectionUpdateAuthority = createSignerFromKeypair(umi, payerKeypair);

  const mintResult = await mintToCollectionV1(umi, {
    leafOwner: payerKeypair.publicKey,
    merkleTree,
    collectionMint,
    collectionAuthority: collectionUpdateAuthority,
    metadata: {
      name: 'cNFT Testing Burner',
      uri: 'https://arweave.net/IjF_Sd0zcvGwTbkfFjPFoiHlmVPn7duJ1diU92OZHKo',
      sellerFeeBasisPoints: 500, // 5%
      collection: { key: collectionMint, verified: true }, // change false if verify later.
      creators: [
        { address: umi.identity.publicKey, verified: true, share: 100 }, // change false if verify later.
      ],
    },
  }).sendAndConfirm(umi);

  console.log('payer =>', payerKeypair.publicKey.toString());
  console.log('leafOwner =>', payerKeypair.publicKey.toString());
  console.log('merkleTree =>', merkleTree);
  console.log('collectionMint =>', collectionMint.toString());
  console.log('signature =>', bs58.encode(mintResult.signature));
  console.log('result =>', mintResult.result);
};

mintToCollection();
