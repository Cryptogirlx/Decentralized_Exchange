const TestToken = artifacts.require("TestToken");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer) {
  await deployer.deploy(TestToken);
  let dex = await Dex.deployed();
  let token = await TestToken.deployed();
  await token.approve(dex.address, 500);
  await dex.addToken(web3.utils.fromUtf8("TEST"), token.address);
  await dex.deposit(100, web3.utils.fromUtf8("TEST"));
};
