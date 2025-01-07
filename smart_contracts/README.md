# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/InterContinentalBallisticMissile.ts

npx hardhat ignition deploy ./ignition/modules/InterContinentalBallisticMissile.ts --network holesky

npx hardhat ignition deploy ./ignition/modules/InterContinentalBallisticMissile.ts --network sepolia
```

```
npx hardhat verify --network holesky 0xfD7E6c875D613335F43E332304Df52FCeCd27D57 0x862A7F74F130A7Aa4E3F7916159A749BB004C4b1 "ipfs://QmZtyArTh81gdMFDcQpvZ6FeXQZU5cd6erC5BFnTzRJm9J/"
```

## Sepolia testnet address = "0x25C7E53E5901a045629bA7996DDE7629630F784E"

## Holesky testnet address = "0xfD7E6c875D613335F43E332304Df52FCeCd27D57"
