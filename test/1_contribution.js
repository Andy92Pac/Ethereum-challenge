const Token = artifacts.require('./../Token.sol');
const Contribution = artifacts.require('./../Contribution.sol');

const { balance, BN, constants, ether, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract('Contribution', accounts => {

	var token = null;
	var contribution = null;

	before('setup', async () => {

		const date = new Date();
		const now = parseInt(date.getTime() / 1000);

		token = await Token.new(now - 1000, now + 1000)
		contribution = await Contribution.new(token.address)

		await token.addMinter(contribution.address, { from: accounts[0] });
      	await token.renounceMinter({ from: accounts[0] });
	})

	it('should process the contribution and deliver tokens', async () => {
		
		let actualBalance = await web3.eth.getBalance(accounts[1]);
		let contributionAmount = web3.utils.toWei('1', 'ether');

		var txReceipt = await contribution.contribute({from: accounts[1], value: contributionAmount});
		var tx = await web3.eth.getTransaction(txReceipt.tx);
		var gasUsed = txReceipt.receipt.gasUsed;
		var gasPrice = tx.gasPrice;
		var gasCost = new BN(gasPrice).mul(new BN(gasUsed));

		let expectedBalance = new BN(actualBalance).sub(new BN(contributionAmount));
		let expectedBalanceWithGas = expectedBalance.sub(gasCost);
		let newBalance = await web3.eth.getBalance(accounts[1]);

		assert.deepEqual(newBalance, expectedBalanceWithGas.toString(), "Balance incorrect");

		let tokenBalance = await token.balanceOf(accounts[1]);
		
		assert.deepEqual(tokenBalance.toString(), contributionAmount, "Token balance incorrect");

		let savedContribution = await contribution.getContribution(accounts[1]);

		assert.deepEqual(savedContribution.toString(), contributionAmount, "Saved contribution incorrect");
	})
})