require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("dotenv").config({ path: ".env" });

module.exports = {
	solidity: {
		compilers: [
			{
				version: "0.8.10",
				settings: {
					optimizer: {
						enabled: true,
						runs: 1000,
					},
				},
			},
			{
				version: "0.8.4",
			},
			{
				version: "0.7.6",
				settings: {
					optimizer: {
						enabled: true,
						runs: 1000,
					},
				},
			},
		],
	},
	networks: {
		// hardhat: {
		// 	forking: {
		// 		url: process.env.MORALIS_BSC_TESTNET_API_KEY_URL,
		// 		blockNumber: 14390000,
		// 	},
		// },
		rinkeby: {
			url: process.env.ALCHEMY_RINKEBY_API_KEY_URL,
			accounts: [process.env.PRIVATE_KEY],
		},
		bsc_test: {
			url: process.env.MORALIS_BSC_TESTNET_API_KEY_URL,
			accounts: [
				process.env.PRIVATE_KEY,
				process.env.PRIVATE_KEY1,
				process.env.PRIVATE_KEY2,
			],
		},
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: process.env.BSCSCAN_API_KEY,
	},
};
