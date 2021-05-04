const Dex = artifacts.require("Dex");
const TestToken = artifacts.require("TestToken");
const truffleAssert = require("truffle-assertions"); // first $ npm i truffle-assertions!!

contract("Dex", (accounts) => {
  // here we can run the tests, for each statement it will redeploy our contracts

  //define new test with "it"
  it("should only be possible for owner to add tokens", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();

    // we check if the statement(as in only the owner can call this function) passes with ".passes" -- in terminal you have to run $ truffle test
    await truffleAssert.passes(
      dex.addToken(web3.utils.fromUtf8("TEST"), token.address, {
        from: accounts[0],
      })
    );

    // we check if the function reverts ".reverts" if it's called by not the owner of the TestToken contract
    await truffleAssert.reverts(
      dex.addToken(web3.utils.fromUtf8("TEST"), token.address, {
        from: accounts[1],
      })
    );
  });

  it("should handle deposits correctly", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await token.approve(dex.address, 500);
    await dex.deposit(100, web3.utils.fromUtf8("TEST"));
    // we assert that our balance should be 100 after the deposit
    let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("TEST"));
    assert.equal(balance.toNumber(), 100);
  });

  it("should handle faulty withdrawals correctly", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await truffleAssert.reverts(dex.withdraw(500, web3.utils.fromUtf8("TEST")));
  });
  it("should handle correct withdrawals correctly", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await truffleAssert.passes(dex.withdraw(100, web3.utils.fromUtf8("TEST")));
  });
  it("should deposit the correct amount of ETH", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await dex.depositEth({ value: 1000 });
    let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));
    assert.equal(balance.toNumber(), 1000);
  });
  it("should withdraw the correct amount of ETH", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await dex.withdrawEth(1000);
    let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));
    assert.equal(balance.toNumber(), 0);
  });
  it("should not allow over-withdrawing of ETH", async () => {
    let dex = await Dex.deployed();
    let token = await TestToken.deployed();
    await truffleAssert.reverts(dex.withdrawEth(100));
  });
});
