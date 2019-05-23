const Token = artifacts.require('./../Token.sol');
const Contribution = artifacts.require('./../Contribution.sol');

const { BN, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

contract('Contribution', ([minter, contributor, ...accounts]) => {

	var token = null;
	var contribution = null;

	before('setup', async () => {

		const date = new Date();
		const now = parseInt(date.getTime() / 1000);

		token = await Token.new(now - 1000, now + 1000, { from: minter })
	})

	it('should create contract and log associated token contract address', async () => {
		
		contribution = await Contribution.new(token.address);

		await expectEvent.inConstruction(
			contribution, 
			'LogContributionContractCreated', 
			{ 
				tokenAddress: token.address
			});
	})

	it('should process the contribution,log and deliver tokens', async () => {

		await token.addMinter(contribution.address, { from: minter });
      	await token.renounceMinter({ from: minter });
		
		let actualBalance = await web3.eth.getBalance(contributor);
		let contributionAmount = web3.utils.toWei('1', 'ether');

		let txReceipt = await contribution.contribute({from: contributor, value: contributionAmount});

		await expectEvent.inTransaction(
			txReceipt.tx,
			Contribution,
			'LogContribution',
			{
				contributor: contributor,
				contribution: contributionAmount
			});

		let tx = await web3.eth.getTransaction(txReceipt.tx);
		let gasUsed = txReceipt.receipt.gasUsed;
		let gasPrice = tx.gasPrice;
		let gasCost = new BN(gasPrice).mul(new BN(gasUsed));

		let expectedBalance = new BN(actualBalance).sub(new BN(contributionAmount));
		let expectedBalanceWithGas = expectedBalance.sub(gasCost);
		let newBalance = await web3.eth.getBalance(contributor);

		assert.deepEqual(newBalance, expectedBalanceWithGas.toString(), "Balance incorrect");
	})

	it('should have the correct amount of tokens in contributor balance', async () => {

		let tokenBalance = await token.balanceOf(contributor);
		let contributionAmount = web3.utils.toWei('1', 'ether');
		
		assert.deepEqual(tokenBalance.toString(), contributionAmount, "Token balance incorrect");
	})

	it('should return the correct contribution from contributor address', async () => {

		let savedContribution = await contribution.getContribution(contributor);
		let contributionAmount = web3.utils.toWei('1', 'ether');

		assert.deepEqual(savedContribution.toString(), contributionAmount, "Saved contribution incorrect");
	})

	it('should revert because amount is zero or negative', async () => {

		await shouldFail.reverting.withMessage(
			contribution.contribute({from: contributor, value: '0'}),
			'Amount is zero'
			);
	})
})