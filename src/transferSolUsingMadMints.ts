// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// Mad Mints
import { createNonceAccount } from 'mad-mints-packages';
import { getNonceAccount } from 'mad-mints-packages';

const main = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const connection = new Connection(endpoint, 'confirmed');

  const adminSecretKeyBase58 = process.env.PAYER_SECRET_KEY;
  if (!adminSecretKeyBase58) throw new Error('adminSecretKeyBase58 not found.');
  const payer = Keypair.fromSecretKey(bs58.decode(adminSecretKeyBase58));

  // ------------------------------------
  //  Create Nonce Account
  // ------------------------------------
  // Read None Account Auth Secret Key
  const nonceAccountAuth = payer;
  const nonceAccount = await createNonceAccount(
    connection,
    payer,
    nonceAccountAuth.publicKey
  );

  if (!nonceAccount) throw Error('Nonce Account not found.');
  console.log();

  // ------------------------------------
  //  Get Nonce
  // ------------------------------------
  const nonceAccountInfo = await getNonceAccount(connection, nonceAccount);

  if (!nonceAccountInfo) throw Error('Nonce Account not found.');
  const nonce = nonceAccountInfo.nonce;

  // ------------------------------------------
  //  Taker
  // ------------------------------------------
  const takerPublicKey = new PublicKey(
    'CJsPSQtV28CJiRt8XThuG5Ei1cX2fH5GcPoZYyM26gzm'
  );

  // ------------------------------------
  //  Create Instruction
  // ------------------------------------
  let tx = new Transaction();

  // nonce advance must be the first insturction.
  const nonceInstruction = SystemProgram.nonceAdvance({
    noncePubkey: nonceAccount,
    authorizedPubkey: nonceAccountAuth.publicKey,
  });
  tx.add(nonceInstruction);

  const instructions = SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: takerPublicKey,
    lamports: LAMPORTS_PER_SOL * 0.00001,
  });

  tx.add(instructions);

  // assign `nonce` as recentBlockhash.
  tx.recentBlockhash = nonce;
  tx.feePayer = payer.publicKey;

  // ------------------------------------
  //  Sign and Send Transaction
  // ------------------------------------
  tx.sign(payer, nonceAccountAuth);
  const signature = await connection.sendRawTransaction(tx.serialize());

  console.log('signature =>', signature);
};

main();
