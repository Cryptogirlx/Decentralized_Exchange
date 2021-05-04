// The user must have ETH deposited (eth >= buy order value)
//The user who calls this function must have enough tokens deposited (balance > sell order value )
//First order in the BUY orderbook should have the highest price, elements should be ordered from highest price to lowest in array of orders

const Dex = artifacts.require("Dex");
const TestToken = artifacts.require("TestToken");
const truffleAssert = require("truffle-assertions");

it("should throw an error if balance is less than buy order value", async () => {
  let dex = await Dex.deployed();
  let token = await TestToken.deployed();

  await truffleAssert.reverts(
    dex.createLimitOrder(0, web3.utils.fromUtf8("TEST"), 1, 100)
  );
  await truffleAssert.passes(
    dex.createLimitOrder(0, web3.utils.fromUtf8("TEST"), 1, 200)
  );
});

it("should throw error if balance is less than sell order value", async () => {
  let dex = await Dex.deployed();
  let token = await TestToken.deployed();
  await truffleAssert.reverts(
    dex.createLimitOrder(1, web3.utils.fromUtf8("TEST"), 1, 200)
  );

  // for this test to pass the user needs to deposit from TestToken
  token.approve(dex.address, 500);
  await dex.deposit(20, web3.utils.fromUtf8("TEST"));
  await truffleAssert.passes(
    dex.createLimitOrder(1, web3.utils.fromUtf8("TEST"), 1, 100)
  );
});

it("should put the highest price element first in the BUY order book array", async () => {
  let dex = await Dex.deployed();
  let token = await TestToken.deployed();
  await token.approve(dex.address, 500);
  // we create different orders to be pushed in the array
  await dex.createLimitOrder(0, web3.utils.fromUtf8("TEST"), 1, 300);
  await dex.createLimitOrder(0, web3.utils.fromUtf8("TEST"), 1, 100);
  await dex.createLimitOrder(0, web3.utils.fromUtf8("TEST"), 1, 200);

  //then we get all elements from the orderbook and make every element compare itself to the element next to it, then arrange accordingly
  let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("TEST"), 0);
  for (let i = 0; i < orderbook.length - 1; i++) {
    const element = array[index];
    assert(orderbook[i] >= orderbook[i + 1]);
  }
});

it("should put the lowest price element first in the SELL order book array", async () => {
  let dex = await Dex.deployed();
  let token = await TestToken.deployed();
  await token.approve(dex.address, 500);
  await dex.createLimitOrder(1, web3.utils.fromUtf8("TEST"), 1, 300);
  await dex.createLimitOrder(1, web3.utils.fromUtf8("TEST"), 1, 100);
  await dex.createLimitOrder(1, web3.utils.fromUtf8("TEST"), 1, 200);

  let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("TEST"), 1);
  for (let i = 0; i < orderbook.length - 1; i++) {
    const element = array[index];
    assert(orderbook[i] <= orderbook[i + 1]);
  }
});
