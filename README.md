# CLI cNFT
## Address(Mainnet)
Merkle Tree: ``

## Setup
```
cp .env.example .env
```

## Run
Update values(e.g. merkle tree) at each files then,

```
ts-node src/1_createMerkleTree.ts
ts-node src/2_mintToCollection.ts
ts-node src/3_fetchMerkleTreeForCnft.ts.ts
```
