const Token = artifacts.require('./../Token.sol');
const { BN, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract('Token', ([minter, ...accounts]) => {

	const date = new Date();
	const now = parseInt(date.getTime() / 1000);

	it('should create contract and log start and end time', async () => {
		const instance =  await Token.new(now - 1000, now + 1000, { from: minter });

		await expectEvent.inConstruction(
			instance, 
			'LogTokenContractCreated', 
			{ 
				startTime : new BN(now - 1000),
				endTime : new BN(now + 1000)
			});
	})

	it('should mint and log', async () => {
		const instance =  await Token.new(now - 1000, now + 1000, { from: minter });

		let txReceipt = await instance.mint(minter, 1000);

		await expectEvent.inTransaction(
			txReceipt.tx, 
			Token,
			'LogMint',
			{
				to: minter,
				amount: new BN(1000)
			});
	})

	it('should revert because mint has not started yet', async () => {
		await shouldFail.reverting.withMessage(
			Token.new(now + 1000, now + 1000, { from: minter })
			.then(async (instance) => {
				await instance.mint(minter, 1000);
			}),
			'Mint has not started yet'
			);
		
	})

	it('should revert because mint is over now', async () => {
		await shouldFail.reverting.withMessage(
			Token.new(now - 1000, now - 1000, { from: minter })
			.then(async (instance) => {
				await instance.mint(minter, 1000);
			}),
			'Mint is over now'
			);
	})
})