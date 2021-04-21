const Migrations = artifacts.require("Wallet");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
