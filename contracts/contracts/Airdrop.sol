// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BeneficiaryProof.sol";



contract Airdrop is Ownable {
    IERC20 private token;
    BeneficiaryProof private beneficiaryProof;
    uint256 private totalAmount;
    uint256 private numBeneficiaries;
    uint256 public amountPerBeneficiary;
    bytes32[] private joinKeys;
    uint randNonce = 0;
    
    mapping(address => bool) public beneficiaries;
    mapping(address => uint256) public balances;
    mapping(uint256 => uint256) public vouchers;
    mapping(uint256 => bool) public isVoucherAvailable;

    event GroupCreated(address indexed manager, uint256 totalAmount, uint256 numBeneficiaries);
    event VoucherCreated(bytes32 indexed beneficiary, uint256 amount);
    

    constructor(address _token) Ownable(msg.sender){
        token = IERC20(_token);
    }

    function createGroup(uint256 _totalAmount, address[] memory _beneficiaries) external onlyOwner {
        totalAmount = _totalAmount;
        numBeneficiaries = _beneficiaries.length;
        amountPerBeneficiary = totalAmount / numBeneficiaries;
        generateBeneficiaryProof(_beneficiaries);
        token.transfer(address(this), totalAmount);
        emit GroupCreated(msg.sender, _totalAmount, numBeneficiaries);
    }

    function generateBeneficiaryProof( address[] memory _beneficiaries) private {
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            joinGroup(_beneficiaries[i]);
            balances[_beneficiaries[i]] = amountPerBeneficiary;
        }
    }

    function joinGroup(address _beneficiary) public {
        require(beneficiaries[_beneficiary] == false, "Already a beneficiary");
        beneficiaries[_beneficiary] = true;
        balances[_beneficiary] += amountPerBeneficiary;
    }

    function registerVoucher(address _beneficiary, uint256 _voucher, uint256 _amount) external onlyOwner {
        require(beneficiaries[_beneficiary] == true, "Not a beneficiary");
        require(balances[_beneficiary] >= _amount, "Insufficient balance");
        balances[_beneficiary] -= _amount;
        vouchers[_voucher] = _amount;
        isVoucherAvailable[_voucher] = true;
    }

     function getTotalAmount() external view onlyOwner returns (uint256)  {
        return totalAmount;
    }

    function getBalance(address _beneficiary) external view onlyOwner returns (uint256)  {
        return balances[_beneficiary];
    }

    function getVoucherAmount(uint256 _voucher) external view onlyOwner returns (uint256)  {
        return vouchers[_voucher];
    }

    function withdraw(address _thirdParty, uint256 _voucher) public  {
        require(isVoucherAvailable[_voucher] != false, "Invalid voucher");
        require(vouchers[_voucher] != 0, "Invalid voucher amount");
        token.transfer(_thirdParty, vouchers[_voucher]);
        isVoucherAvailable[_voucher] = false;
    }

}