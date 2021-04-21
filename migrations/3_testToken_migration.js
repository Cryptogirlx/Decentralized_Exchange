const TestToken = artifacts.require("TestToken");
const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer) {
  await deployer.deploy(TestToken);
  let wallet = await Wallet.deployed();
  let token = await TestToken.deployed();
  await token.approve(wallet.address, 500);
  await wallet.addToken(web3.utils.fromUtf8("TEST"), token.address);
  await wallet.deposit(100, web3.utils.fromUtf8("TEST"));
};
