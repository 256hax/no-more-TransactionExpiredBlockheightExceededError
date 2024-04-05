# No More TransactionExpiredBlockheightExceededError
```
TransactionExpiredBlockheightExceededError: Signature ... has expired: block height exceeded.
```

## Setup
```
npm i
```
```
cp .env.example .env
```

## Run
```
ts-node src/transferSol.ts
```

Note: Durable Nonce use 0.00144768 SOL (allocated 80 bytes).
```
ts-node src/transferSolUsingDurableNonce.ts
```

## Tips
- [Jordan](https://twitter.com/jordaaash/status/1774892862049800524?s=46&t=5fX7QK1WsnWj4mOH2NhhaA)  
A few simple tips for Solana devs to improve your transaction land rate with web3.js.

- [Triton One Docs - Sending TXs](https://docs.triton.one/chains/solana/sending-txs)  
Recommendations to optimize transaction delivery through the our Cascade network.

- [Jacob - Optimize your CU requests](https://twitter.com/jacobvcreech/status/1766228539836162345)  
If you optimize your CU request, you maximize the amount of potential transactions your program can have per block, giving your users a better experience

## Tools
- [Helius - (Alpha) Priority Fee API](https://docs.helius.dev/solana-rpc-nodes/alpha-priority-fee-api)  
On Solana, you can add a fee to your transactions to ensure they get prioritized by validators. This is especially useful if (i) the current block is near-full, and (ii) the state you're trying to write to is highly contested (for example: a popular NFT mint). 

- [Zhe | Sujiko - SolToolkit](https://twitter.com/ZheSolworks/status/1776014583817277767)  
Fetching the fastest/highest slot RPC endpoint.