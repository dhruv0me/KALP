# KALP Smart Contracts (Ethereum)

Milestone-based ETH crowdfunding for campus projects. Starter version for the Sepolia testnet.

## How it works

1. A **creator** opens a campaign: funding goal (in ETH), deadline, and milestones (each a share of the funds, in basis points that add up to 10,000).
2. **Backers** contribute ETH until the deadline.
3. **Goal missed** → every backer can refund their full contribution.
4. **Goal reached** → the **verifier** (campus admin or multisig) approves milestones one by one. After each approval the creator withdraws that milestone's share.
5. **Cancelled** → the verifier can cancel; backers refund their share of the funds not yet released.

All steps emit events, so every campaign can be audited on Etherscan.

## Quick start

```bash
npm install
npm test                 # compiles with the normal Solidity compiler
USE_SOLCJS=1 npm test    # if binaries.soliditylang.org is blocked on your network
```

## Deploy to Sepolia

1. Copy `.env.example` to `.env` and fill in an RPC URL (Infura/Alchemy), a **test-only** wallet private key and an Etherscan key.
2. Get free test ETH from a Sepolia faucet.
3. Run `npm run deploy:sepolia`.
4. Verify the contract with the command printed by the script.

Never put a private key that holds real funds in `.env`.

## Before real money

- Get the contract reviewed or audited.
- Decide who the verifier is (use a multisig, not a single wallet).
- Consider a Layer 2 (Base, Arbitrum, Optimism) to keep gas fees low.
- Check Indian tax and regulatory rules for crypto with a professional.

## Next steps

- Connect the frontend with wagmi + viem + RainbowKit (wallet connect).
- Show each campaign's contract address and Etherscan link on its page.
- Store campaign details (title, budget, documents) on IPFS and pass the link as `metadataURI`.
