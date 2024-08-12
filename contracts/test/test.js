const { expect } = require("chai");
const web3 = require('web3');

describe("Airdrop contract", function () {
  it("Deployment creates a group", async function () {

    const [owner, addr1, addr2, addr3, addr4, addr5, addr6,addr7, addr8, addr9, addr10, thirdParty] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await ethers.deployContract("Token");
    await token.waitForDeployment();
    
    const tokenAddress = await token.getAddress();

    //AIRDROP SETUP
    const totalAmount = 1000;
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(tokenAddress);
    airdrop.waitForDeployment();
    airdropContractAddress = await airdrop.getAddress();
    //Airdrop total amount deposit
    await token.transfer(airdropContractAddress,totalAmount)
    let beneficiaries = [addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8, addr9, addr10];

    // console.log("BENEFICIARIES: ", await addr1.getAddress(), await addr2.getAddress(), await addr3.getAddress(), await addr4.getAddress(), await addr5.getAddress(), await addr6.getAddress(), await addr7.getAddress(), await addr8.getAddress(), await addr9.getAddress(), await addr10.getAddress());
    console.log("THIRD PARTY ENTITY: ", await thirdParty.getAddress());
    //Airdrop creation

    console.log("AIRDROP CREATION");
    await airdrop.createGroup(totalAmount, beneficiaries);
    console.log("Airdrop total amount: ", await airdrop.getTotalAmount());
    console.log("Test account: ", await beneficiaries[8].getAddress());
    console.log("Checking balance equals to 100...");
    console.log("Beneficiary balance: ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("10 TOKENS VOUCHER CREATION");
    voucher = Math.floor(Math.random() * 10000000000);
    await airdrop.registerVoucher(beneficiaries[8], voucher ,10);
    console.log("Checking balance equals to 90...");
    console.log("Beneficiary balance : ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("80 TOKENS VOUCHER CREATION");
    voucher = Math.floor(Math.random() * 10000000000);
    testVoucher = voucher;
    await airdrop.registerVoucher(beneficiaries[8], voucher ,80);
    console.log("Created voucher: ", voucher);
    console.log("Checking balance equals to 10...");
    console.log("Beneficiary balance : ", await airdrop.getBalance(beneficiaries[8]));

    console.log("");
    console.log("CREATING 20 TOKENS VOUCHER EXCEDING THE AVAILABLE BALANCE");
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
    console.log("80 TOKENS VOUCHER CLAIM", testVoucher);
    console.log("Third party balance before withdrawal: ", await token.balanceOf(thirdParty));
    console.log("Contract balance before withdrawal: ", await token.balanceOf(airdrop.getAddress()));
    console.log("Test voucher amount: ", await airdrop.getVoucherAmount(testVoucher));
    try {
      console.log("WITHDRAWING.... ");
      await airdrop.withdraw(thirdParty, testVoucher);
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