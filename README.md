<div align="center">

# 🔄 GameyaFi 
### Solana Native Edition

**"Turning social trust into programmable trust."**

[![Solana](https://img.shields.io/badge/Solana-Native-14F195?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)
[![Rust](https://img.shields.io/badge/Rust-Program-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Anchor](https://img.shields.io/badge/Anchor-v0.32.1-4A90E2?style=for-the-badge)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

GameyaFi is a trustless, transparent Web3 platform on the Solana blockchain that revolutionizes traditional rotating savings groups (Gumei/Jameya) using smart contracts, automated escrows, and on-chain reputation.

[View Demo](#) • [Pitch Deck](#) • [Live App](#)

</div>

---

## 📖 The Problem

Informal rotating savings groups are a lifeline for millions in the Middle East, Africa, and South Asia. A group of people agree to contribute a fixed amount monthly, and one person takes the entire pooled sum each month. 

**The fatal flaw? It relies 100% on social trust.**
If a member receives their payout in Round 1 and disappears (defaults) in Round 2, the remaining members suffer direct financial loss. There is no escrow, no verifiable reputation, and no automated enforcement.

## 💡 The GameyaFi Solution

GameyaFi brings this centuries-old financial habit on-chain without changing the core user behavior. We replace fragile social trust with **Solana smart programs**.

| Traditional Savings Circle ❌ | GameyaFi on Solana ✅ |
| :--- | :--- |
| **Trust-based:** Risk of member defaulting after payout. | **Trustless:** Secured by required on-chain collateral deposits. |
| **No Enforcement:** Social pressure is the only penalty. | **Programmable Penalties:** Automated deductions from deposits. |
| **No History:** Defaulters can freely join new circles. | **On-Chain Reputation:** Immutable scores tied to wallet addresses. |
| **Manual Tracking:** Messy WhatsApp groups and spreadsheets. | **Transparent:** 100% verifiable state on the Solana blockchain. |

---

## ✨ Core Features

- 🛡️ **Smart Escrow:** User deposits and contributions are locked securely in Program-Derived Address (PDA) vaults.
- ⚙️ **Auto-Managed Rounds:** Circles automatically start when full. Rounds advance automatically upon successful payouts.
- ⚖️ **Penalty Enforcement:** Late payers have penalties automatically slashed from their security deposits.
- 🌟 **On-Chain Reputation System:** Members build an immutable reputation score. Pay on time = Score goes up. Default = Score drops drastically.
- 💵 **SPL Token Integration:** Fully compatible with USDC (Mock USDC used for MVP).

---

## 🏗️ Architecture & Tech Stack

GameyaFi is built natively on Solana to take advantage of low fees, sub-second finality, and native account models (PDAs).

### Smart Contracts (On-Chain)
* **Language:** Rust
* **Framework:** Anchor (v0.32.1)
* **Network:** Solana Devnet / Mainnet-Beta
* **Token Standard:** SPL Token

### Frontend (Off-Chain)
* **Framework:** Next.js (React) + TypeScript
* **Styling:** Tailwind CSS + Shadcn/ui
* **Web3 Integration:** `@solana/web3.js`, Anchor TS Client
* **Wallet Adapter:** Solana Wallet Adapter (Phantom, Backpack, etc.)

---

## 🔄 User Journey (How it Works)

1. **Create:** A user creates a Circle defining the contribution amount, security deposit, and round duration.
2. **Join:** Members join by locking their Security Deposit in the smart contract escrow.
3. **Start:** Once the target member count is reached, the Circle auto-starts.
4. **Pay:** Members deposit their contribution for the current round.
5. **Claim:** The designated recipient for that round claims the pooled funds.
6. **Enforce (If needed):** If the deadline passes and a member hasn't paid, anyone can trigger `Mark Defaulted` to slash the defaulter's deposit and lower their reputation.

---

## 🛠️ Local Setup & Installation

To run GameyaFi locally on your machine for testing or judging:

### Prerequisites
* Node.js & npm/yarn
* Rust & Cargo
* [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v2.3.0 recommended)
* [Anchor CLI](https://www.anchor-lang.com/docs/installation) (v0.32.1 recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/gameyafi.git
cd gameyafi
