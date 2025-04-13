// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MyToken {
    event Transfer(address indexed from, address indexed to, uint256 value);

    string public name;
    string public symbol;
    uint8 public decimals;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;

    constructor(
        string memory _name, 
        string memory _symbol, 
        uint8 _decimals,
        uint256 _amount
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        // transaction
        // from, to, data, value, gas, ...
        _mint(_amount * 10 ** uint256(decimals), msg.sender); // 1 MT
    }

    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceOf[owner] += amount;

        emit Transfer(address(0), owner, amount);
    }

    function transfer(uint256 amount, address to) external {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }
}
