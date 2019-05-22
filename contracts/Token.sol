pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract Token is ERC20Mintable {

	uint public _startTime; 
	uint public _endTime;

	modifier isInTime() { 
		require (now >= _startTime, 'Mint has not started yet');
		require (now <= _endTime, 'Mint is over now'); 
		_; 
	}
	
	constructor(uint startTime, uint endTime) public {
		_startTime = startTime;
		_endTime = endTime;
	}

	function mint(address _to, uint256 _amount) public isInTime returns (bool) {
		super.mint(_to, _amount);
	}

}