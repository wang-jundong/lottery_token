const main = async () => {
	const [owner, other1, other2] = await hre.ethers.getSigners();
	const babyQuintContractFactory = await hre.ethers.getContractFactory(
		"BabyQuint"
	);
	const babyQuintContract = await babyQuintContractFactory.deploy();
	await babyQuintContract.deployed();

	console.log("BabyQuint Contract deployed: ", babyQuintContract.address);

	const lotteryContractFactory = await hre.ethers.getContractFactory(
		"Lottery"
	);
	const lotteryContract = await lotteryContractFactory.deploy(
		babyQuintContract.address
	);
	await lotteryContract.deployed();

	console.log("Lottery Contract deployed: ", lotteryContract.address);
	console.log(
		"Address list: ",
		owner.address,
		other1.address,
		other2.address
	);

	let txn = await babyQuintContract.tradingStatus(true);
	await txn.wait();
	let tradingOpen = await babyQuintContract.tradingOpen();
	console.log("Trading Status: ", tradingOpen);

	txn = await babyQuintContract.approveMax(lotteryContract.address);
	await txn.wait();
	txn = await babyQuintContract
		.connect(other1)
		.approveMax(lotteryContract.address);
	await txn.wait();
	txn = await babyQuintContract
		.connect(other2)
		.approveMax(lotteryContract.address);
	await txn.wait();
	console.log("Approve Max");

	txn = await babyQuintContract.transfer(other1.address, 100000000000);
	await txn.wait();
	console.log("send token to other1");

	txn = await babyQuintContract.transfer(other2.address, 100000000000);
	await txn.wait();
	console.log("send token to other2");

	await printBalanceLog(
		babyQuintContract,
		lotteryContract,
		owner,
		other1,
		other2
	);

	txn = await lotteryContract.buyTicket(3);
	await txn.wait();
	console.log("Buy ticket");

	await printBalanceLog(
		babyQuintContract,
		lotteryContract,
		owner,
		other1,
		other2
	);

	txn = await lotteryContract.connect(other1).buyTicket(5);
	await txn.wait();
	console.log("Buy ticket");

	await printBalanceLog(
		babyQuintContract,
		lotteryContract,
		owner,
		other1,
		other2
	);

	txn = await lotteryContract.connect(other2).buyTicket(4);
	await txn.wait();
	console.log("Buy ticket");

	await printBalanceLog(
		babyQuintContract,
		lotteryContract,
		owner,
		other1,
		other2
	);

	txn = await lotteryContract.lotteryResult();
	await txn.wait();
	console.log("Result");

	await printBalanceLog(
		babyQuintContract,
		lotteryContract,
		owner,
		other1,
		other2
	);

	// let txn = await lotteryContract.sendBabyQuintToken(3);
	// await txn.wait();

	// txn = await lotteryContract.connect(randomPerson).buyTicket(5);
	// await txn.wait();

	// let tokenCount = await lotteryContract.balanceOf(randomPerson.address);
	// for (let i = 0; i < tokenCount; i++) {
	// 	let tokenId = await lotteryContract.tokenOfOwnerByIndex(
	// 		randomPerson.address,
	// 		i
	// 	);
	// 	console.log("___ token id ___", tokenId);
	// }

	// txn = await lotteryContract.result();
	// await txn.wait();
};

const printBalanceLog = async (
	babyQuintContract,
	lotteryContract,
	owner,
	other1,
	other2
) => {
	let ownerTokenCount = await babyQuintContract.balanceOf(owner.address);
	let lotteryTokenCount = await babyQuintContract.balanceOf(
		lotteryContract.address
	);
	let other1TokenCount = await babyQuintContract.balanceOf(other1.address);
	let other2TokenCount = await babyQuintContract.balanceOf(other2.address);
	console.log(
		"Balance: ",
		ownerTokenCount,
		", ",
		lotteryTokenCount,
		", ",
		other1TokenCount,
		", ",
		other2TokenCount
	);
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

runMain();
