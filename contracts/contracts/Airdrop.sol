// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdrop is Ownable {
    IERC20 public token;
    uint256 public totalAmount;
    uint256 public numBeneficiaries;
    uint256 public amountPerBeneficiary;

    mapping(address => bool) public beneficiaries;
    mapping(address => uint256) public balances;

    event GroupCreated(address indexed manager, uint256 totalAmount, uint256 numBeneficiaries);
    event VoucherCreated(address indexed beneficiary, uint256 amount);
    event Withdrawal(address indexed thirdParty, uint256 amount);

    constructor(address _token) Ownable(msg.sender){
        token = IERC20(_token);
    }

    function createGroup(uint256 _totalAmount, uint256 _numBeneficiaries) external onlyOwner {
        totalAmount = _totalAmount;
        numBeneficiaries = _numBeneficiaries;
        amountPerBeneficiary = _totalAmount / _numBeneficiaries;
        token.transfer(address(this), _totalAmount);

        emit GroupCreated(msg.sender, _totalAmount, _numBeneficiaries);
    }

    function joinGroup(address _beneficiary) public {
        require(beneficiaries[_beneficiary] == false, "Already a beneficiary");
        beneficiaries[_beneficiary] = true;
        balances[_beneficiary] = amountPerBeneficiary;
    }

    function createVoucher(address _beneficiary, uint256 _amount) public {
        require(beneficiaries[_beneficiary] == true, "Not a beneficiary");
        require(balances[_beneficiary] >= _amount, "Insufficient balance");
        balances[_beneficiary] -= _amount;

        emit VoucherCreated(_beneficiary, _amount);
    }

    function withdraw(address _thirdParty, uint256 _amount) public {
        token.transfer(_thirdParty, _amount);

        emit Withdrawal(_thirdParty, _amount);
    }
}