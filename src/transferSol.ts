// Lib
import * as dotenv from 'dotenv';
import * as bs58 from 'bs58';

// Solana
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  ComputeBudgetProgram,
} from '@solana/web3.js';

export const main = async () => {
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

  // ------------------------------------------
  //  Taker
  // ------------------------------------------
  const takerPublicKey = new PublicKey(
    'CJsPSQtV28CJiRt8XThuG5Ei1cX2fH5GcPoZYyM26gzm'
  );

  // ------------------------------------------
  //  Transferring Settings
  // ------------------------------------------
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 300,
  });

  const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: 60_000
  });

  // ------------------------------------------
  //  Transfer
  // ------------------------------------------
  let transaction = new Transaction();

  transaction
    .add(modifyComputeUnits)
    .add(addPriorityFee)
    .add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: takerPublicKey,
        lamports: LAMPORTS_PER_SOL * 0.00001,
      })
    );

  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer],
    // https://solana-labs.github.io/solana-web3.js/types/ConfirmOptions.html
    {
      commitment: 'confirmed',
      maxRetries: 0,
      preflightCommitment: 'confirmed',
      skipPreflight: true,
    }
  );
  console.log('signature =>', signature);
};

main();
