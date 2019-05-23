pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Token.sol";


/// @title Contribution contract for Ethereum Challenge
/// @author Andy Mpondo Black
/// @notice This contract is only used to complete the Ethereum Challenge
/// @dev This contract uses the SafeMath library from OpenZeppelin
contract Contribution {
	using SafeMath for uint;

	/**
     * Event for Contribution contract creation
     * @param tokenAddress Address of the Token contract associated to the Contribution contract
     */
	event LogContributionContractCreated(address tokenAddress);

	/**
     * Event for contribution
     * @param contributor Address that donated to the contract
     * @param contribution Amount of wei donated in this specific contribution
     * @param contribution Total amount of wei donated by this specific contributor
     */
	event LogContribution(address indexed contributor, uint contribution);

	// Token contract reference
	Token public _token;

	// Addresses of users that donate with the associated amount they've donated
	mapping (address => uint) public m_contributions;

	/**
     * @param tokenAddress Address of the Token contract associated to the Contribution contract
     */
	constructor(address tokenAddress) public {
		_token = Token(tokenAddress);

		emit LogContributionContractCreated(tokenAddress);
	}
	
	/**
     * @dev contribute function allowing users to donate ETH
     * In return for their ETH-based contributions tokens are issued 
     * from the Token contract referenced above considering that the
     * contribution is done after the _startTime and before the _endTime
     */
	function contribute() public payable {
		require(int(msg.value) > 0, 'Amount is zero or negative');

		m_contributions[msg.sender] = m_contributions[msg.sender].add(msg.value);

		emit LogContribution(msg.sender, msg.value);

		_token.mint(msg.sender, msg.value);
	}

	/**
     * @return the amount of wei donated by a specific address
     */
	function getContribution(address _address) public view returns (uint) {
		return m_contributions[_address];
	}

}