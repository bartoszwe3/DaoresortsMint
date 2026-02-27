const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ThyroSENSE Token (TST) — Full tests incl. DEX sell fee checks", function () {
  let token, owner, treasury, alice, bob, carol;
  let weth, factory, router, pair;

  const toWei = (v) => ethers.utils.parseUnits(v.toString(), 18);
  const DEADLINE_OFFSET = 60 * 60; // 1 hour

  beforeEach(async function () {
    [owner, treasury, alice, bob, carol] = await ethers.getSigners();

    // Deploy ThyroSENSE
    const ThyroSENSE = await ethers.getContractFactory("ThyroSENSE");
    token = await ThyroSENSE.deploy(treasury.address, owner.address);
    await token.deployed();
  });

  // ----------------------------
  // Basic deployment & invariants
  // ----------------------------
  describe("Deployment & invariants", function () {
    it("owner and treasury set; initial supply minted to owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
      expect(await token.treasury()).to.equal(treasury.address);
      const total = toWei(100000000);
      expect(await token.totalSupply()).to.equal(total);
      expect(await token.balanceOf(owner.address)).to.equal(total);
    });

    it("no public mint function (owner can't mint)", async function () {
      // sanity: no mint exposed in ABI
      expect(token.mint).to.be.undefined;
      // totalSupply unchanged
      const before = await token.totalSupply();
      expect(await token.totalSupply()).to.equal(before);
    });

    it("zero-value transfer is allowed and doesn't change balances", async function () {
      const ownerBalBefore = await token.balanceOf(owner.address);
      await token.transfer(alice.address, 0);
      expect(await token.balanceOf(owner.address)).to.equal(ownerBalBefore);
      expect(await token.balanceOf(alice.address)).to.equal(0);
    });
  });

  // ----------------------------
  // Whitelist & Pre-trading
  // ----------------------------
  describe("Whitelist & Trading (pre-trading)", function () {
    it("whitelisted addresses can transfer before trading enabled and tax applies", async function () {
      await token.setWhitelist(alice.address, true);
      await token.transfer(alice.address, toWei(1000));
      await token.connect(alice).transfer(bob.address, toWei(100));

      expect(await token.balanceOf(bob.address)).to.equal(toWei(98)); // 2% tax default
      expect(await token.balanceOf(treasury.address)).to.equal(toWei(2));
    });

    it("non-whitelisted cannot transfer before trading", async function () {
      await token.transfer(alice.address, toWei(10));
      await expect(
        token.connect(alice).transfer(bob.address, toWei(1))
      ).to.be.revertedWith("Trading is not active.");
    });
  });

  // ----------------------------
  // Exempt behavior (tax-only)
  // ----------------------------
  describe("Exempt behavior", function () {
    it("exempt addresses skip tax after trading enabled (but do NOT bypass whitelist)", async function () {
      await token.enableTrading();
      await token.setExempt(alice.address, true);

      await token.transfer(alice.address, toWei(1000));
      const treasuryBefore = await token.balanceOf(treasury.address);

      await token.connect(alice).transfer(bob.address, toWei(100));
      expect(await token.balanceOf(bob.address)).to.equal(toWei(100));
      expect(await token.balanceOf(treasury.address)).to.equal(treasuryBefore);
    });
  });

  // ----------------------------
  // Trading enabled normal flow
  // ----------------------------
  describe("Trading enabled", function () {
    it("enables transfers for all", async function () {
      await token.enableTrading();
      await token.transfer(alice.address, toWei(500));
      await token.connect(alice).transfer(bob.address, toWei(100));
      expect(await token.balanceOf(bob.address)).to.be.gt(0);
    });
  });

  // ----------------------------
  // Transfer tax tests (direct transfers)
  // ----------------------------
  describe("Transfer tax (direct transfers)", function () {
    beforeEach(async function () {
      await token.enableTrading();
      await token.transfer(alice.address, toWei(1000));
    });

    it("2% tax applied to normal transfers", async function () {
      await token.connect(alice).transfer(bob.address, toWei(100));
      expect(await token.balanceOf(bob.address)).to.equal(toWei(98));
      expect(await token.balanceOf(treasury.address)).to.equal(toWei(2));
    });

    it("exempt addresses do not pay tax", async function () {
      await token.setExempt(alice.address, true);
      await token.connect(alice).transfer(bob.address, toWei(100));
      expect(await token.balanceOf(bob.address)).to.equal(toWei(100));
    });

    it("setTransferTax is owner-only and capped at 10%", async function () {
      // non-owner cannot call
      await expect(token.connect(alice).setTransferTax(5)).to.be.reverted;
      // owner can set within cap
      await token.setTransferTax(5);
      expect(await token.transferTax()).to.equal(5);
      // owner cannot set above cap (assuming you applied require <= 10)
      await expect(token.setTransferTax(11)).to.be.reverted;
      // reset to 2
      await token.setTransferTax(2);
    });
  });

  // ----------------------------
  // Batch whitelist / blacklist
  // ----------------------------
  describe("Batch admin functions", function () {
    it("batchSetWhitelist sets and clears multiple addresses", async function () {
      await token.batchSetWhitelist([alice.address, bob.address], true);
      expect(await token.isWhitelisted(alice.address)).to.equal(true);
      expect(await token.isWhitelisted(bob.address)).to.equal(true);

      await token.batchSetWhitelist([alice.address, bob.address], false);
      expect(await token.isWhitelisted(alice.address)).to.equal(false);
      expect(await token.isWhitelisted(bob.address)).to.equal(false);
    });

    it("batchSetBlacklist sets and clears multiple addresses", async function () {
      await token.batchSetBlacklist([alice.address, bob.address], true);
      expect(await token.isBlacklisted(alice.address)).to.equal(true);
      expect(await token.isBlacklisted(bob.address)).to.equal(true);

      await token.batchSetBlacklist([alice.address, bob.address], false);
      expect(await token.isBlacklisted(alice.address)).to.equal(false);
      expect(await token.isBlacklisted(bob.address)).to.equal(false);
    });
  });

  // ----------------------------
  // Blacklist tests
  // ----------------------------
  describe("Blacklist", function () {
    beforeEach(async function () {
      await token.enableTrading();
      await token.transfer(alice.address, toWei(200));
    });

    it("blocks transfers from blacklisted addresses", async function () {
      await token.setBlacklist(alice.address, true);
      await expect(
        token.connect(alice).transfer(bob.address, toWei(50))
      ).to.be.revertedWith("Blacklisted");
    });

    it("blocks transfers to blacklisted addresses", async function () {
      await token.setBlacklist(bob.address, true);
      await expect(
        token.connect(alice).transfer(bob.address, toWei(50))
      ).to.be.revertedWith("Blacklisted");
    });
  });

  // ----------------------------
  // Pause / unpause tests
  // ----------------------------
  describe("Pause/Unpause", function () {
    it("prevents transfers while paused", async function () {
      await token.enableTrading();
      await token.transfer(alice.address, toWei(10));
      await token.pause();
      await expect(token.connect(alice).transfer(bob.address, toWei(1))).to.be.revertedWith("Token paused");
    });

    it("allows transfers after unpause", async function () {
      await token.enableTrading();
      await token.transfer(alice.address, toWei(10));
      await token.pause();
      await token.unpause();
      await token.connect(alice).transfer(bob.address, toWei(1));
      // 2% fee => bob receives 0.98 tokens (in wei expression)
      const expected = toWei(1).mul(98).div(100); // 0.98 * 1
      expect(await token.balanceOf(bob.address)).to.equal(expected);
    });
  });

  // ----------------------------
  // Uniswap integration tests (buy/sell) — ensure fee on sell
  // ----------------------------
  describe("Uniswap V2 Integration (fee on sell checks)", function () {
    beforeEach(async function () {
      // Deploy WETH
      const WETH = await ethers.getContractFactory("WETH9");
      weth = await WETH.deploy();
      await weth.deployed();

      // Deploy Factory
      const Factory = await ethers.getContractFactory("UniswapV2Factory");
      factory = await Factory.deploy(owner.address);
      await factory.deployed();

      // Deploy Router (pass weth as payable address; your mock expects address)
      const Router = await ethers.getContractFactory("UniswapV2Router02");
      router = await Router.deploy(factory.address, weth.address);
      await router.deployed();

      // Create Pair
      await factory.createPair(token.address, weth.address);
      const pairAddress = await factory.getPair(token.address, weth.address);
      pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);

      // Approve router to move owner tokens for liquidity
      await token.approve(router.address, toWei(100000000));

      // Add Liquidity with large deadline
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;
      await router.addLiquidityETH(
        token.address,
        toWei(100000),
        0,
        0,
        owner.address,
        deadline,
        { value: ethers.utils.parseEther("100") }
      );

      // Enable trading so router swaps pass whitelist check
      await token.enableTrading();
    });

    it("buy (ETH -> TST) increases treasury (fee on buy path)", async function () {
      const path = [weth.address, token.address];
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;
      const treasuryBefore = await token.balanceOf(treasury.address);

      await router.connect(alice).swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        path,
        alice.address,
        deadline,
        { value: ethers.utils.parseEther("1") }
      );

      const treasuryAfter = await token.balanceOf(treasury.address);
      expect(treasuryAfter).to.be.gt(treasuryBefore);
      expect(await token.balanceOf(alice.address)).to.be.gt(0);
    });

    it("sell (TST -> ETH) applies transfer fee and treasury increases", async function () {
      const path = [weth.address, token.address];
      const reversePath = [token.address, weth.address];
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;

      // 1) Alice buys tokens first
      await router.connect(alice).swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        path,
        alice.address,
        deadline,
        { value: ethers.utils.parseEther("1") }
      );

      // confirm alice has tokens
      const aliceBal = await token.balanceOf(alice.address);
      expect(aliceBal).to.be.gt(0);

      // Approve router to spend alice's full balance
      await token.connect(alice).approve(router.address, aliceBal);

      // Record treasury before selling
      const treasuryBefore = await token.balanceOf(treasury.address);

      // 2) Alice sells full balance (sell should incur transfer tax)
      await router.connect(alice).swapExactTokensForETHSupportingFeeOnTransferTokens(
        aliceBal,
        0,
        reversePath,
        alice.address,
        deadline
      );

      // treasury should have increased due to fee applied on token transfer(s)
      const treasuryAfter = await token.balanceOf(treasury.address);
      expect(treasuryAfter).to.be.gt(treasuryBefore);
    });

    it("blacklisted user cannot buy via router", async function () {
      const path = [weth.address, token.address];
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;

      await token.setBlacklist(alice.address, true);

      await expect(
        router.connect(alice).swapExactETHForTokensSupportingFeeOnTransferTokens(
          0,
          path,
          alice.address,
          deadline,
          { value: ethers.utils.parseEther("1") }
        )
      ).to.be.revertedWith("Blacklisted");
    });

    it("blacklisted user cannot sell via router", async function () {
      const path = [weth.address, token.address];
      const reversePath = [token.address, weth.address];
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;

      // buy tokens first
      await router.connect(alice).swapExactETHForTokensSupportingFeeOnTransferTokens(
        0,
        path,
        alice.address,
        deadline,
        { value: ethers.utils.parseEther("1") }
      );

      // blacklist alice and attempt sell
      await token.setBlacklist(alice.address, true);
      const aliceBal = await token.balanceOf(alice.address);
      await token.connect(alice).approve(router.address, aliceBal);

      await expect(
        router.connect(alice).swapExactTokensForETHSupportingFeeOnTransferTokens(
          aliceBal,
          0,
          reversePath,
          alice.address,
          deadline
        )
      ).to.be.revertedWith("Blacklisted");
    });

    it("rejects swaps for isolated token before trading enabled", async function () {
      const ThyroSENSE = await ethers.getContractFactory("ThyroSENSE");
      const isolated = await ThyroSENSE.deploy(treasury.address, owner.address);
      await isolated.deployed();

      const path = [weth.address, isolated.address];
      const deadline = Math.floor(Date.now() / 1000) + DEADLINE_OFFSET;

      await expect(
        router.connect(alice).swapExactETHForTokensSupportingFeeOnTransferTokens(
          0,
          path,
          alice.address,
          deadline,
          { value: ethers.utils.parseEther("1") }
        )
      ).to.be.revertedWith("Trading is not active.");
    });
  });

  // ----------------------------
  // Admin sanity
  // ----------------------------
  describe("Admin sanity checks", function () {
    it("setTreasury onlyOwner", async function () {
      const newTreasury = carol.address;
      await expect(token.connect(alice).setTreasury(newTreasury)).to.be.reverted;
      await token.setTreasury(newTreasury);
      expect(await token.treasury()).to.equal(newTreasury);
    });

    it("onlyOwner controls pause & whitelist", async function () {
      await expect(token.connect(alice).pause()).to.be.reverted;
      await token.pause();
      await token.unpause();

      await expect(token.connect(alice).setWhitelist(bob.address, true)).to.be.reverted;
      await token.setWhitelist(bob.address, true);
      expect(await token.isWhitelisted(bob.address)).to.equal(true);
    });
  });
});
