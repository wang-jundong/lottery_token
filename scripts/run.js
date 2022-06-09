const main = async () => {
	const [owner, randomPerson] = await hre.ethers.getSigners();
	const lotteryContractFactory = await hre.ethers.getContractFactory(
		"Lottery"
	);
	const lotteryContract = await lotteryContractFactory.deploy();
	await lotteryContract.deployed();

	console.log("Lottery Contract deployed: ", lotteryContract.address);
	console.log("Lottery Contract deployed by: ", owner.address);

	let txn = await lotteryContract.buyTicket(3);
	await txn.wait();

	txn = await lotteryContract.connect(randomPerson).buyTicket(5);
	await txn.wait();

	// let tokenCount = await lotteryContract.balanceOf(randomPerson.address);
	// for (let i = 0; i < tokenCount; i++) {
	// 	let tokenId = await lotteryContract.tokenOfOwnerByIndex(
	// 		randomPerson.address,
	// 		i
	// 	);
	// 	console.log("___ token id ___", tokenId);
	// }
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
