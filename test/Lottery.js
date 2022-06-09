const { assert } = require("chai");

const BabyToken = artifacts.require("BabyQuint");
const Lottery = artifacts.require("Lottery");

contract("Lottery", (accounts) => {
	let tokenContractInstance;
	let lotteryContractInstance;

	beforeEach(async () => {
		tokenContractInstance = await BabyToken.new();
		lotteryContractInstance = await Lottery.new(
			tokenContractInstance.address
		);
		console.log("BabyToken address", tokenContractInstance.address);
		console.log("Lottery address", lotteryContractInstance.address);
	});

	context("Lottery Action", async () => {
		it("Should enable trading of token", async () => {
			await tokenContractInstance.tradingStatus(true);
			assert.equal(await tokenContractInstance.tradingOpen, true);
		});

		it("User 0 should approve lottery address", async () => {
			let result = await tokenContractInstance.approveMax(
				lotteryContractInstance.address
			);
			assert.equal(result.receipt.status, true);
			assert.equal(result.logs[0].args.owner, accounts[0]);
			assert.equal(
				result.log[0].args.spender,
				lotteryContractInstance.address
			);
		});

		it("User 1 should approve lottery address", async () => {
			let result = await tokenContractInstance.approveMax(
				lotteryContractInstance.address,
				{ from: accounts[1] }
			);
			assert.equal(result.receipt.status, true);
			assert.equal(result.logs[0].args.owner, accounts[1]);
			assert.equal(
				result.log[0].args.spender,
				lotteryContractInstance.address
			);
		});

		it("User 2 should approve lottery address", async () => {
			let result = await tokenContractInstance.approveMax(
				lotteryContractInstance.address,
				{ from: accounts[2] }
			);
			assert.equal(result.receipt.status, true);
			assert.equal(result.logs[0].args.owner, accounts[2]);
			assert.equal(
				result.log[0].args.spender,
				lotteryContractInstance.address
			);
		});

		it("Should send token to user 1", async () => {
			await tokenContractInstance.transfer(accounts[1], 100000000000);
			assert.equal(
				await tokenContractInstance.balanceOf(accounts[1]),
				100000000000
			);
		});

		it("Should send token to user 2", async () => {
			await tokenContractInstance.transfer(accounts[2], 100000000000);
			assert.equal(
				await tokenContractInstance.balanceOf(accounts[2]),
				100000000000
			);
		});

		it("Should buy ticket", async () => {
			await lotteryContractInstance.buyTicket(3);
			assert.equal(
				await tokenContractInstance.balanceOf(
					lotteryContractInstance.address
				),
				3000000000
			);
		});
	});
});
