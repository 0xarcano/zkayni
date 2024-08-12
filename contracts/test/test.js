const { expect } = require("chai");
const web3 = require('web3');

describe("Airdrop contract", function () {
  it("Deployment creates a group", async function () {

    const [owner, addr1, addr2, addr3, addr4, addr5, addr6,addr7, addr8, addr9, addr10, thirdParty] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await ethers.deployContract("Token");
    await token.waitForDeployment();
    
    const tokenAddress = await token.getAddress();

    // console.log("Token address:", tokenAddress);
    // console.log("Owner address:", owner.address);
  
    const totalAmount = 1000;
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(tokenAddress);
    airdrop.waitForDeployment();
    airdropContractAddress = await airdrop.getAddress();
    // console.log("Airdrop contract address:", owner.address);

    // console.log("Owner balance:", await token.balanceOf(owner.address));
    // console.log("Requested total amount:", totalAmount);
    await token.transfer(airdropContractAddress,totalAmount)
    let beneficiaries = [addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10];

    await airdrop.createGroup(totalAmount, beneficiaries);

    console.log("Airdrop total amount: ", await airdrop.getTotalAmount());
    // console.log("Airdrop number of beneficiaries: ", airdrop.numBeneficiaries);
    // console.log("Airdrop amount per beneficiary: ", airdrop.amountPerBeneficiary);

    console.log("Test account: ", await beneficiaries[8].getAddress());
    console.log("Checking balance equals to 100...");
    console.log("Beneficiary balance: ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("Creating 10 tokens voucher...");
    voucher = Math.floor(Math.random() * 10000000000);
    await airdrop.registerVoucher(beneficiaries[8], voucher ,10);
    console.log("Checking balance equals to 90...");
    console.log("Beneficiary balance : ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("Creating 80 tokens voucher...");
    voucher = Math.floor(Math.random() * 10000000000);
    await airdrop.registerVoucher(beneficiaries[8], voucher ,80);
    console.log("Created voucher: ", voucher);
    console.log("Checking balance equals to 10...");
    console.log("Beneficiary balance : ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("Creating 20 tokens voucher exceding the available balance...");
    try {
      voucher = Math.floor(Math.random() * 10000000000);
      await airdrop.registerVoucher(beneficiaries[8], voucher ,20);
    } catch (error) {
      if (error.message.includes("Insufficient balance")){
        console.log("Correctly refused by Insufficient balance");
      }else{
        console.error(error);
      }
    }
    console.log("");
    console.log("Checking balance remains to 10...");
    console.log("Beneficiary balance:", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("Withdrwal 80 tokens voucher ", voucher);
    console.log("Third party balance before withdrawal: ", await token.balanceOf(thirdParty));
    console.log("Contract balance before withdrawal: ", await token.balanceOf(airdrop.getAddress()));
    console.log("Test voucher amount: ", await airdrop.getVoucherAmount(voucher));
    try {
      console.log("Withdrawing .... ");
      await airdrop.withdraw(thirdParty, voucher);
    } catch (error) {
      if (error.message.includes("Invalid voucher")){
        console.log("Refused by Invalid voucher");
      }else{
        console.error(error);
      }
    }
    console.log("Third party balance after withdrawal: ", await token.balanceOf(thirdParty));
    console.log("Contract balance after withdrawal: ", await token.balanceOf(airdrop.getAddress()));

    console.log("");
    console.log("Checking balance remains to 10...");
    expect(await airdrop.getBalance(beneficiaries[8])).equals(10);

  });
});