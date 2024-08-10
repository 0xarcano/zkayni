const { expect } = require("chai");

describe("Airdrop contract", function () {
  it("Deployment creates a group", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await ethers.deployContract("Token");
    await token.waitForDeployment();
    
    const tokenAddress = await token.getAddress();

    // console.log("Token address:", tokenAddress);
    // console.log("Owner address:", owner.address);
  
    const totalAmount = 1000;
    const numBeneficiaries = 10;
    const Airdrop = await ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(tokenAddress);
    airdrop.waitForDeployment();
    airdropContractAddress = await airdrop.getAddress();
    // console.log("Airdrop contract address:", owner.address);

    // console.log("Owner balance:", await token.balanceOf(owner.address));
    // console.log("Requested total amount:", totalAmount);
    await token.transfer(airdropContractAddress,totalAmount)
    await airdrop.createGroup(totalAmount, numBeneficiaries);

    console.log("Airdrop total amount: ", await airdrop.totalAmount());
    // console.log("Airdrop number of beneficiaries: ", airdrop.numBeneficiaries);
    // console.log("Airdrop amount per beneficiary: ", airdrop.amountPerBeneficiary);

    expect(await airdrop.amountPerBeneficiary()).to.equal(100);

  });
});