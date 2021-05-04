pragma solidity >=0.4.22 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() public ERC20("TestToken", "TEST") {
        _mint(msg.sender, 1000);
    }
}
