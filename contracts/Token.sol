pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

/// @title Token contract for Ethereum Challenge
/// @author Andy Mpondo Black
/// @notice This contract is only used to complete the Ethereum Challenge
/// @dev This contract inherits from OpenZeppelin's contract ERC20Mintable and add time condition to mint token
contract Token is ERC20Mintable {

	/**
     * Event for Token contract creation
     * @param startTime Mint start time
     * @param endTime Mint end time
     */
	event LogTokenContractCreated(uint startTime, uint endTime);

	/**
     * Event for tokens minted
     * @param to Address that received minted token
     * @param amount Amount of tokens minted
     */
	event LogMint(address indexed to, uint amount);

	// Time after which tokens can be minted
	uint public _startTime;

	// Time before which tokens can be minted
	uint public _endTime;

	/**
     * @dev Reverts if not in time range
     */
	modifier isInTime() { 
		require (now >= _startTime, 'Mint has not started yet');
		require (now <= _endTime, 'Mint is over now'); 
		_; 
	}
	
	/**
     * @dev Constructor, takes start and end times
     * @param startTime Mint start time
     * @param endTime Mint end time
     */
	constructor(uint startTime, uint endTime) public {
		_startTime = startTime;
		_endTime = endTime;

		emit LogTokenContractCreated(_startTime, _endTime);
	}

	/**
     * @dev Function to mint tokens
     * Override mint function from ERC20Mintable contract
     * @param to The address that will receive minted tokens
     * @param amount The amount of tokens to mint
     * @return A boolean that indicates if the operation was successful
     */
	function mint(address to, uint amount) public isInTime returns (bool) {
		super.mint(to, amount);

		emit LogMint(to, amount);

		return true;
	}
}