const { expect } = require("chai");

describe("Airdrop contract", function () {
  it("Deployment creates a group", async function () {
    const [owner, addr1, addr2, addr3, addr4, addr5, addr6,addr7, addr8, addr9, addr10] = await ethers.getSigners();

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

    console.log("Airdrop beneficiary keys: ", await airdrop.getBeneficiaryHashes());
    
    var hashes = await airdrop.getBeneficiaryHashes();

    console.log("Test account: ", hashes[8]);
    console.log("Airdrop balance for: ", await airdrop.getBalance(hashes[8]));
    // expect(await airdrop.amountPerBeneficiary()).to.equal(100);
    expect(await airdrop.createVoucher(hashes[8],100));
  });
});