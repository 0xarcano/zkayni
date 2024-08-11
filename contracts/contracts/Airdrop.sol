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
    
    mapping(bytes32 => bool) public beneficiaries;
    mapping(bytes32 => uint256) public balances;

    event GroupCreated(address indexed manager, uint256 totalAmount, uint256 numBeneficiaries);
    event VoucherCreated(bytes32 indexed beneficiary, uint256 amount);
    event Withdrawal(address indexed thirdParty, uint256 amount);

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
        beneficiaryProof  = new BeneficiaryProof(_beneficiaries);
        bytes32[] memory hashes = beneficiaryProof.getLeafs();
        for (uint256 i = 0; i < hashes.length; i++) {
            joinGroup(hashes[i]);
            balances[hashes[i]] = amountPerBeneficiary;
        }
    }

    function joinGroup(bytes32 _beneficiary) public {
        require(beneficiaries[_beneficiary] == false, "Already a beneficiary");
        beneficiaries[_beneficiary] = true;
        balances[_beneficiary] += amountPerBeneficiary;
    }

    function createVoucher(bytes32 _beneficiary, uint256 _amount) public returns (bool) {
        require(beneficiaries[_beneficiary] == true, "Not a beneficiary");
        require(balances[_beneficiary] >= _amount, "Insufficient balance");
        balances[_beneficiary] -= _amount;

        // emit VoucherCreated(_beneficiary, _amount);
        return true;
    }

    function getBeneficiaryHashes() external view onlyOwner returns (bytes32[] memory)  {
        return beneficiaryProof.getLeafs();
    }

     function getTotalAmount() external view onlyOwner returns (uint256)  {
        return totalAmount;
    }

    function getBalance(bytes32 _beneficiary) external view onlyOwner returns (uint256)  {
        return balances[_beneficiary];
    }

    function withdraw(address _thirdParty, uint256 _amount) public {
        token.transfer(_thirdParty, _amount);
        emit Withdrawal(_thirdParty, _amount);
    }

}