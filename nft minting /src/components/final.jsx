import React, { useEffect, useState } from "react";
import "./style.css";
import { ClipboardIcon } from "lucide-react"; // Install lucide-react for icons
import { FaRegCopy } from "react-icons/fa"; // Install react-icons if not installed
import { Clipboard } from "lucide-react"; // Importing icon
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "mathjs";
import styled from "styled-components";

import { toast } from "react-toastify";
import { PER_USDT_TO_BNB } from "../contracts/contracts";
import useContract from "../hooks/useContract";

import {
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitProvider,
} from "@reown/appkit/react";


import HeroSection from "./HeroSection"

import Footer from "./Footer"

import { ethers } from "ethers";

import { useAppKit } from "@reown/appkit/react";


import { Box, Typography } from "@mui/material";

export default function PricePerToken() {
 






    const networks = [
      {
        name: "Arbitrum",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
      },
      {
        name: "Optimism",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png",
      },
      {
        name: "Solana",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      },
      {
        name: "Ethereum",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      },
      {
        name: "zkSync",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/zksync/info/logo.png",
      },
      {
        name: "BNB",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
      },
      {
        name: "Polygon",
        icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
      },
    ];
  return (
<>



  <div className="final" data-model-id="810:9167">
      <img
        className="element"
        alt="Element"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/001-1-3000x3000-5.png"
      />

      <div className="ellipse" />

      <div className="text-wrapper">Tokenomics</div>

      <div className="div" />

      <img
        className="element-x"
        alt="Element"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/001-1-3000x3000-4.png"
      />

      <div className="text-wrapper-2">Benefits</div>

      <div className="ellipse-2" />

      <div className="ellipse-3" />

      <div className="mask-group">
        <div className="element-2">
          <img
            className="img"
            alt="Element"
            src="https://c.animaapp.com/mhyq9quoT9AQMY/img/001-1-3000x3000-2.png"
          />

          <div className="text-wrapper-3">About</div>

          <div className="text-wrapper-4">DTX</div>
        </div>
      </div>

      <div className="group">
        <div className="rectangle" />

        <div className="text-wrapper-5">Sign Up</div>
      </div>

      <img
        className="mask-group-2"
        alt="Mask group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group.png"
      />

      <div className="frame">
        <img
          className="mask-group-3"
          alt="Mask group"
          src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group-5.png"
        />
      </div>

      <img
        className="image"
        alt="Image"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/image-5.png"
      />

      <div className="navbar">
        <div className="text-wrapper-6">About</div>

        <div className="text-wrapper-6">Features</div>

        <div className="text-wrapper-6">Whitepaper</div>

        <div className="text-wrapper-6">Giveaway</div>

        <div className="text-wrapper-6">FAQs</div>

        <div className="text-wrapper-6">Audit</div>

        <div className="text-wrapper-6">Dev Update</div>

        <div className="text-wrapper-6">Roadmap</div>
      </div>

      <div className="rectangle-2" />

      <p className="p">
        Sign Up and use “DTX25” to get 25% bonus to start your trading journey!
      </p>

      <div className="group-2">
        <div className="rectangle-3" />

        <div className="text-wrapper-7">Connect Wallet</div>
      </div>

      <div className="group-3">
        <div className="rectangle-4" />

        <div className="text-wrapper-7">Claim Token</div>
      </div>

      <div className="group-4">
        <div className="leading-ETF-trading">
          Leading&nbsp;&nbsp;
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          ETF Trading Platform
        </div>

        <div className="tokenized"> Tokenized</div>

        <p className="access-over">
          Access Over 1000+ Global ETFs With DTX Exchange. Maximize Gains With
          1000x Leverage and Enterprise-Grade Analytics.
        </p>

        <div className="group-5">
          <div className="rectangle" />

          <div className="text-wrapper-8">Buy Presale</div>
        </div>
      </div>

      <div className="group-6">
        <img className="frame-2" alt="Frame" />

        <div className="group-7">
          <div className="text-wrapper-9">Invesco Galaxy ETF</div>

          <p className="element-3">
            <span className="span">$862.56</span>

            <span className="text-wrapper-10"> + 18%</span>
          </p>
        </div>
      </div>

      <div className="group-8">
        <div className="rectangle-5" />

        <img className="frame-3" alt="Frame" />

        <div className="group-9">
          <div className="text-wrapper-11">Bitwise EFT</div>

          <p className="element-4">
            <span className="span">$251.25</span>

            <span className="text-wrapper-10"> + 12%</span>
          </p>
        </div>
      </div>

      <div className="demo-wrapper">
        <div className="demo">
          <div className="element-5">
            <img
              className="glow"
              alt="Glow"
              src="https://c.animaapp.com/mhyq9quoT9AQMY/img/glow.png"
            />

            <img
              className="glow-2"
              alt="Glow"
              src="https://c.animaapp.com/mhyq9quoT9AQMY/img/glow-1.png"
            />

            <div className="text-wrapper-12">Presale</div>

            <img
              className="element-6"
              alt="Element"
              src="https://c.animaapp.com/mhyq9quoT9AQMY/img/001-1-3000x3000-3.png"
            />
          </div>
        </div>
      </div>

      <div className="group-1 0">
        <div className="rectangle" />

        <div className="text-wrapper-8">Buy Presale</div>
      </div>

      <div className="group-11">
        <div className="rectangle-6" />

        <div className="text-wrapper-13">Whitepaper</div>
      </div>

      <div className="group-wrapper">
        <div className="group-12">
          <div className="text-wrapper-14">Second Round</div>

          <div className="rectangle-wrapper">
            <div className="rectangle-7" />
          </div>

          <div className="text-wrapper-15">58.08%</div>
        </div>
      </div>

      <div className="div-wrapper">
        <div className="group-13">
          <img
            className="image-2"
            alt="Image"
            src="https://c.animaapp.com/mhyq9quoT9AQMY/img/image-6.png"
          />

          <div className="text-wrapper-16">Current Token Price</div>

          <div className="text-wrapper-17">$0.04</div>
        </div>
      </div>

      <div className="group-14">
        <div className="group-13">
          <img
            className="image-3"
            alt="Image"
            src="https://c.animaapp.com/mhyq9quoT9AQMY/img/image-10-1.png"
          />

          <div className="text-wrapper-18">3rd Round Token Price</div>

          <div className="text-wrapper-19">$0.06</div>
        </div>
      </div>

      <div className="group-15">
        <div className="group-16">
          <img
            className="image-4"
            alt="Image"
            src="https://c.animaapp.com/mhyq9quoT9AQMY/img/image-10-1.png"
          />

          <div className="text-wrapper-20">USDT Raised</div>

          <div className="text-wrapper-21">$1,188,708.78 / $2,000,000 USD</div>
        </div>
      </div>

      <img className="line" alt="Line" />

      <img className="line" alt="Line" />

      <div className="text-wrapper-22">Featured In</div>

      <img
        className="group-17"
        alt="Group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/group-1707485111.png"
      />

      <p className="text-wrapper-23">
        The First Hybrid Trading Exchange Backed By Layer-1 Blockchain
      </p>

      <p className="access-over-2">
        Access Over 1000+ Global ETFs With DTX Exchange. Maximize Gains With
        1000x Leverage and Enterprise-Grade Analytics.
      </p>

      <p className="advanced-tools-for">Advanced Tools for Modern Investors</p>

      <div className="text-wrapper-24">Our Features</div>

      <img
        className="mask-group-4"
        alt="Mask group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group-1.png"
      />

      <p className="text-wrapper-25">
        Access unparalleled liquidity with our industry-leading leverage
        options.
      </p>

      <div className="text-wrapper-26">1000x Leverage</div>

      <img
        className="mask-group-4"
        alt="Mask group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group-2.png"
      />

      <p className="text-wrapper-27">
        Follow leading global traders, study their portfolios, and copy their
        strategies for maximum profits.
      </p>

      <div className="text-wrapper-28">Copy Trading</div>

      <img
        className="mask-group-5"
        alt="Mask group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group-3.png"
      />

      <p className="text-wrapper-29">
        Buy a portfolio of stocks, ETFs, and cryptos to diversify your portfolio
        without needing large capital.
      </p>

      <div className="fractional-multi">Fractional Multi-Asset Trading</div>

      <img
        className="mask-group-5"
        alt="Mask group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/mask-group-4.png"
      />

      <p className="simplify-long-term">
        Simplify long-term investment with automated investments. Enable
        recurring micro-investments into crypto and stocks with embedded risk
        balancing.
      </p>

      <div className="text-wrapper-30">Automated Investment Manager</div>

      <div className="group-18">
        <div className="rectangle" />

        <div className="text-wrapper-31">Join Now</div>
      </div>

      <div className="group-19">
        <p className="text-wrapper-32">
          Secure Your Assets With Phoenix Wallet - Industry Leading Custody
          Solution
        </p>

        <p className="introducing-the">
          Introducing the Phoenix Wallet – your ultimate solution for seamless
          and secure asset management. Trade and manage stocks, crypto, and
          forex effortlessly, with access to over 100,000 financial instruments
          in one unified platform. Powered by the next-generation VulcanX
          blockchain, experience lightning-fast transactions and total control
          over your assets. Simplify your portfolio management with cutting-edge
          technology, unmatched security, and the convenience of having all your
          investments in a single, secure wallet.
        </p>

        <div className="group-20">
          <div className="rectangle-8" />

          <div className="text-wrapper-33">Coming Soon On</div>

          <div className="text-wrapper-34">Play Store</div>

          <img
            className="group-21"
            alt="Group"
            src="https://c.animaapp.com/mhyq9quoT9AQMY/img/group.png"
          />
        </div>
      </div>

      <img
        className="group-22"
        alt="Group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/group-1707488740.png"
      />

      <p className="text-wrapper-35">How to Join DTX Exchange</p>

      <div className="text-wrapper-36">Step 01</div>

      <div className="text-wrapper-37">Step 02</div>

      <div className="text-wrapper-38">Step 03</div>

      <div className="rectangle-9" />

      <div className="rectangle-10" />

      <div className="rectangle-11" />

      <div className="frame-4">
        <p className="text-wrapper-39">
          Sign-Up or Connect <br />
          Your Wallet
        </p>

        <p className="text-wrapper-40">
          Simplify long-term investment with automated investments. Enable
          recurring micro-investments into crypto and stocks with embedded risk
          balancing.
        </p>
      </div>

      <div className="frame-5">
        <div className="text-wrapper-39">Deposit Funds</div>

        <p className="text-wrapper-40">
          After logging into your dashboard, click on &#34;Buy Now.&#34; Choose
          the currency and the quantity of $DTX tokens you&#39;d like to
          exchange, then confirm to proceed with your order.
        </p>
      </div>

      <div className="frame-6">
        <div className="text-wrapper-39">Start Trading</div>

        <p className="confirm-order-and">
          Confirm Order and Join Community&#39; After confirming your order, the
          order details will be automatically generated, including the wallet
          address for you to send your desired cryptocurrency payment to. Your
          token balance will be visible in your account within one hour.
        </p>
      </div>

      <div className="group-23">
        <div className="rectangle" />

        <div className="text-wrapper-41">Buy Presale</div>
      </div>

      <div className="rectangle-12" />

      <div className="rectangle-13" />

      <div className="ellipse-4" />

      <div className="ellipse-5" />

      <div className="ellipse-6" />

      <div className="ellipse-7" />

      <div className="group-24">
        <div className="rectangle" />

        <div className="text-wrapper-8">Buy Presale</div>
      </div>

      <p className="become-a-DTX-holder">Become a $DTX Holder - Key Benefits</p>

      <p className="text-wrapper-42">
        Explore the DTX ecosystem, which is built for the next generation of
        smart investors. DTX Exchange offers a secure, seamless platform to
        support the future of financial investments. Join the $DTX community to
        get unprecedented benefits.
      </p>

      <div className="group-25">
        <img className="frame-7" alt="Frame" />

        <div className="text-wrapper-43">Trading Discounts</div>
      </div>

      <div className="group-26">
        <img className="frame-8" alt="Frame" />

        <div className="text-wrapper-44">Profit Sharing</div>
      </div>

      <div className="group-27">
        <img className="frame-9" alt="Frame" />

        <div className="text-wrapper-45">Governance Rights</div>
      </div>

      <p className="text-wrapper-46">
        Industry-Leading 100,000 TPS - The VulcanX Blockchain
      </p>

      <p className="text-wrapper-47">
        The VulcanX blockchain represents the core infrastructure of the DTX
        Exchange, which has the first native capabilities to support
        conventional financial assets. Designed with interoperability and
        cross-platform development in focus, this Layer-1 blockchain offers
        next-level development opportunities.
      </p>

      <div className="group-28">
        <div className="rectangle" />

        <div className="text-wrapper-48">Testnet</div>
      </div>

      <img className="vector" alt="Vector" />

      <img className="vector-2" alt="Vector" />

      <img
        className="looksrare"
        alt="Looksrare"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/looksrare.png"
      />

      <img
        className="BNB"
        alt="Bnb"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/bnb.png"
      />

      <img
        className="ultra"
        alt="Ultra"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/ultra.png"
      />

      <img
        className="loop"
        alt="Loop"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/loop.png"
      />

      <img
        className="cardano"
        alt="Cardano"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/cardano.png"
      />

      <div className="text-wrapper-49">DTX Exchange - Roadmap</div>

      <div className="text-wrapper-50">DTX Tokenomics</div>

      <div className="rectangle-14" />

      <div className="group-29">
        <div className="text-wrapper-51">Q1 - 2024</div>

        <div className="ellipse-8" />

        <div className="group-30">
          <div className="rectangle-15" />

          <div className="frame-10">
            <div className="group-31">
              <img className="frame-11" alt="Frame" />

              <p className="text-wrapper-52">
                Defining the initial vision for the DTX ecosystem and the
                VulcanX blockchain.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-12" alt="Frame" />

              <p className="text-wrapper-52">
                Initiate research and development segment for technical
                infrastructure.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-13" alt="Frame" />

              <p className="text-wrapper-52">
                Outline timelines for key objectives and allocate resources
                towards team expansion.
              </p>
            </div>

            <div className="group-32">
              <img className="frame-14" alt="Frame" />

              <p className="text-wrapper-52">
                Secure $2.05 Million private funding for project development and
                launch.
              </p>
            </div>
          </div>

          <div className="text-wrapper-53">Initial Conception and Research</div>
        </div>
      </div>

      <div className="group-33">
        <div className="text-wrapper-54">Q2 - 2024</div>

        <div className="ellipse-8" />

        <div className="group-34">
          <div className="rectangle-16" />

          <div className="text-wrapper-55">Expand</div>

          <div className="frame-15">
            <div className="group-31">
              <img className="frame-16" alt="Frame" />

              <p className="text-wrapper-52">
                Recruit industry-leading experts from the finance, tech,
                cybersecurity, and crypto industries.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-17" alt="Frame" />

              <p className="text-wrapper-52">
                Publish the initial whitepaper based on prototype plans and
                establish pre-launch community.
              </p>
            </div>

            <div className="group-35">
              <img className="frame-18" alt="Frame" />

              <p className="text-wrapper-52">
                Finalize the developmental objectives of the DTX platform and
                the scope of the blockchain products.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-19" alt="Frame" />

              <p className="text-wrapper-52">
                Publish KYC verification from SolidProof and partner with
                Cloudflare for expansive security.
              </p>
            </div>

            <div className="group-36">
              <img className="frame-20" alt="Frame" />

              <div className="text-wrapper-56">Launch public pre-sale.</div>
            </div>

            <div className="group-37">
              <img className="frame-21" alt="Frame" />

              <p className="text-wrapper-56">
                Form strategic partnerships with leading technical firms and
                media publications.
              </p>
            </div>
          </div>

          <p className="team-formation">
            Team Formation &amp; Ground Development
          </p>
        </div>
      </div>

      <div className="group-38">
        <div className="text-wrapper-54">Q3 - 2024</div>

        <div className="ellipse-8" />

        <div className="group-34">
          <div className="rectangle-16" />

          <div className="text-wrapper-55">Expand</div>

          <div className="frame-15">
            <div className="group-31">
              <img className="frame-22" alt="Frame" />

              <p className="text-wrapper-52">
                Begin the technical development of the VulcanX blockchain with
                insight from multi-industry experts.
              </p>
            </div>

            <div className="group-35">
              <img className="frame-23" alt="Frame" />

              <p className="text-wrapper-52">
                Initiate live-trading platform development and update DTX
                Exchange user interface to modern standards.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-24" alt="Frame" />

              <p className="text-wrapper-52">
                Initiate the development of the DTX Unified Wallet for secure
                asset management.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-25" alt="Frame" />

              <p className="text-wrapper-52">
                Upgrade back-end infrastructure to handle over 10 Million live
                users on the platform.
              </p>
            </div>

            <div className="group-37">
              <img className="frame-26" alt="Frame" />

              <p className="text-wrapper-56">
                Enhance marketing output to accelerate community development and
                awareness.
              </p>
            </div>

            <div className="group-36">
              <img className="frame-27" alt="Frame" />

              <div className="text-wrapper-56">Launch VulcanX testnet.</div>
            </div>
          </div>

          <p className="technical-expansion">
            Technical Expansion and Community Building
          </p>
        </div>
      </div>

      <div className="group-39">
        <div className="text-wrapper-54">Q2 - 2024</div>

        <div className="ellipse-8" />

        <div className="group-34">
          <div className="rectangle-16" />

          <div className="text-wrapper-57">Expand</div>

          <div className="frame-15">
            <div className="group-31">
              <img className="frame-28" alt="Frame" />

              <p className="text-wrapper-52">
                Begin the technical development of the VulcanX blockchain with
                insight from multi-industry experts.
              </p>
            </div>

            <div className="group-35">
              <img className="frame-29" alt="Frame" />

              <p className="text-wrapper-52">
                Initiate live-trading platform development and update DTX
                Exchange user interface to modern standards.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-30" alt="Frame" />

              <p className="text-wrapper-52">
                Initiate the development of the DTX Unified Wallet for secure
                asset management.
              </p>
            </div>

            <div className="group-31">
              <img className="frame-31" alt="Frame" />

              <p className="text-wrapper-52">
                Upgrade back-end infrastructure to handle over 10 Million live
                users on the platform.
              </p>
            </div>

            <div className="group-37">
              <img className="frame-32" alt="Frame" />

              <p className="text-wrapper-56">
                Enhance marketing output to accelerate community development and
                awareness.
              </p>
            </div>

            <div className="group-36">
              <img className="frame-33" alt="Frame" />

              <div className="text-wrapper-56">Launch VulcanX testnet.</div>
            </div>
          </div>

          <p className="technical-expansion">
            Technical Expansion and Community Building
          </p>
        </div>
      </div>

      <div className="group-40">
        <img className="ellipse-9" alt="Ellipse" />

        <img className="vector-3" alt="Vector" />

        <img className="vector-4" alt="Vector" />

        <img className="vector-5" alt="Vector" />

        <img className="vector-6" alt="Vector" />

        <img className="vector-4" alt="Vector" />

        <img className="vector-7" alt="Vector" />

        <img className="ellipse-10" alt="Ellipse" />

        <img className="ellipse-11" alt="Ellipse" />

        <img className="ellipse-12" alt="Ellipse" />

        <img className="ellipse-13" alt="Ellipse" />

        <img className="ellipse-14" alt="Ellipse" />

        <div className="ellipse-15" />

        <div className="text-wrapper-58">Tokenomics</div>
      </div>

      <div className="frame-34">
        <div className="text-wrapper-59">Public Sale</div>

        <div className="text-wrapper-60">50%</div>
      </div>

      <div className="frame-35">
        <div className="text-wrapper-59">Company Reserve</div>

        <div className="text-wrapper-60">20%</div>
      </div>

      <div className="frame-36">
        <div className="text-wrapper-59">Ecosystem Development</div>

        <div className="text-wrapper-61">13%</div>
      </div>

      <div className="frame-37">
        <div className="text-wrapper-59">Team</div>

        <div className="text-wrapper-60">10%</div>
      </div>

      <div className="frame-38">
        <div className="text-wrapper-59">Advisors &amp; Partners</div>

        <div className="text-wrapper-61">5%</div>
      </div>

      <div className="frame-39">
        <div className="text-wrapper-59">Bounty &amp; Airdrop</div>

        <div className="text-wrapper-60">2%</div>
      </div>

      <div className="group-41">
        <div className="group-42">
          <div className="text-wrapper-62">Estimated Launch Price</div>

          <div className="text-wrapper-63">$0.20</div>
        </div>

        <div className="group-43">
          <div className="text-wrapper-64">Token Network</div>

          <div className="text-wrapper-65">ERC-20</div>
        </div>

        <div className="frame-40">
          <div className="text-wrapper-66">Total Token Supply</div>

          <div className="text-wrapper-67">475,000,000</div>
        </div>
      </div>

      <div className="group-44">
        <div className="group-45">
          <div className="frame-41">
            <p className="text-wrapper-68">
              Exclusive Benefits For Large-Scale Traders - DTX Black Club
            </p>

            <p className="join-the-elite">
              Join the elite trading ranks with exclusive benefits, prioritized
              feature rollout, and active profit shares from DTX Exchange.
            </p>
          </div>

          <div className="ellipse-16" />

          <div className="group-46">
            <div className="rectangle-17" />

            <div className="frame-42">
              <div className="frame-43">
                <img className="frame-44" alt="Frame" />

                <div className="text-wrapper-69">Monthly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-45" alt="Frame" />

                <div className="text-wrapper-70">Level Up Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-46" alt="Frame" />

                <div className="text-wrapper-69">Rakeback</div>
              </div>

              <div className="frame-43">
                <img className="frame-47" alt="Frame" />

                <div className="text-wrapper-69">Weekly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-48" alt="Frame" />

                <div className="text-wrapper-69">Bonus Growth</div>
              </div>
            </div>

            <div className="frame-49">
              <div className="text-wrapper-71">Wager amount</div>

              <div className="text-wrapper-67">$50k - $100k</div>
            </div>

            <div className="text-wrapper-72">SILVER</div>
          </div>

          <div className="group-47">
            <div className="rectangle-17" />

            <div className="frame-42">
              <div className="frame-43">
                <img className="frame-50" alt="Frame" />

                <div className="text-wrapper-69">Monthly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-51" alt="Frame" />

                <div className="text-wrapper-70">Level Up Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-52" alt="Frame" />

                <div className="text-wrapper-69">Rakeback</div>
              </div>

              <div className="frame-43">
                <img className="frame-53" alt="Frame" />

                <div className="text-wrapper-69">Weekly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-54" alt="Frame" />

                <div className="text-wrapper-69">Bonus Growth</div>
              </div>
            </div>

            <div className="frame-49">
              <div className="text-wrapper-71">Wager amount</div>

              <div className="text-wrapper-67">$100k-$250k</div>
            </div>

            <div className="text-wrapper-72">GOLD</div>
          </div>

          <div className="group-48">
            <div className="rectangle-17" />

            <div className="frame-42">
              <div className="frame-43">
                <img className="frame-55" alt="Frame" />

                <div className="text-wrapper-69">Monthly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-56" alt="Frame" />

                <div className="text-wrapper-70">Level Up Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-57" alt="Frame" />

                <div className="text-wrapper-69">Rakeback</div>
              </div>

              <div className="frame-43">
                <img className="frame-58" alt="Frame" />

                <div className="text-wrapper-69">Weekly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-59" alt="Frame" />

                <div className="text-wrapper-69">Bonus Growth</div>
              </div>

              <div className="frame-43">
                <img className="frame-60" alt="Frame" />

                <div className="text-wrapper-73">Daily Bonuses / Reload</div>
              </div>
            </div>

            <div className="frame-49">
              <div className="text-wrapper-71">Wager amount</div>

              <div className="text-wrapper-67">$250k - 1M</div>
            </div>

            <div className="text-wrapper-72">PLATINUM I-III</div>
          </div>

          <div className="group-49">
            <div className="rectangle-17" />

            <div className="frame-42">
              <div className="frame-43">
                <img className="frame-61" alt="Frame" />

                <div className="text-wrapper-69">Monthly Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-62" alt="Frame" />

                <div className="text-wrapper-70">Level Up Bonuses</div>
              </div>

              <div className="frame-43">
                <img className="frame-63" alt="Frame" />

                <div className="text-wrapper-69">Rakeback</div>
              </div>

              <div className="frame-43">
                <img className="frame-64" alt="Frame" />

                <div className="text-wrapper-69">Weekly Bonuses</div>
              </div>
            </div>

            <div className="frame-49">
              <div className="text-wrapper-71">Wager amount</div>

              <div className="text-wrapper-67">$10k</div>
            </div>

            <div className="bronze">BRONZE</div>
          </div>
        </div>
      </div>

      <div className="text-wrapper-74">Over $10 Million Raised</div>

      <div className="group-50">
        <div className="rectangle-18" />

        <div className="text-wrapper-75">Join the Financial Revolution</div>
      </div>

      <p className="join-the-elite-2">
        Join the elite trading ranks with exclusive benefits, prioritized
        feature rollout, and active profit shares from DTX Exchange.
      </p>

      <div className="group-51">
        <div className="rectangle-19" />

        <div className="text-wrapper-76">Claim Token</div>
      </div>

      <img
        className="group-52"
        alt="Group"
        src="https://c.animaapp.com/mhyq9quoT9AQMY/img/group-1707488756.png"
      />
    </div>
</>

  );
}
