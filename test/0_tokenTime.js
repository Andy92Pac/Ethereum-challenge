const Token = artifacts.require('./../Token.sol');
const { balance, BN, constants, ether, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract('Token', accounts => {

	const date = new Date();
	const now = parseInt(date.getTime() / 1000);

	it('should correctly mint', () => {
		return Token.new(now - 1000, now + 1000)
		.then(async function(instance) {
			await instance.mint(accounts[0], 1000);
		})
	})

	it('should revert because mint has not started yet', async () => {
		await shouldFail.reverting.withMessage(
			Token.new(now + 1000, now + 1000)
			.then(async function(instance) {
				await instance.mint(accounts[0], 1000);
			}),
			'Mint has not started yet'
			);
		
	})

	it('should revert because mint is over now', async () => {
		await shouldFail.reverting.withMessage(
			Token.new(now - 1000, now - 1000)
			.then(async function(instance) {
				await instance.mint(accounts[0], 1000);
			}),
			'Mint is over now'
			);
	})
})