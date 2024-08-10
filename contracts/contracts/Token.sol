//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


// This is the main building block for smart contracts.
contract Token is ERC20 {
    constructor() ERC20("USD Ecuador", "USDEC") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}