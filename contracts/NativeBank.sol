// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract NativeBank {
    mapping(address => uint256) public balanceOf;

    function withdraw() external {
        uint256 balance = balanceOf[msg.sender];
        require(balance > 0, "Insufficient balance");

        (bool success,) = msg.sender.call{ value: balance }("");
        require(success, "failed to send native token");

        balanceOf[msg.sender] = 0;
    }

    receive() external payable { 
        balanceOf[msg.sender] += msg.value;
    }
}