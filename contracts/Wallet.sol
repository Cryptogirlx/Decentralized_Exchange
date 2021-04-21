import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable {
    using SafeMath for uint256;

    // 1 token object needs to have the ticker and the contract address so we can interact with it
    struct Token {
        bytes32 ticker;
        address tokenAddress;
    }

    // mapping the ticker to a token object
    mapping(bytes32 => Token) public tokens;

    //array for keeping track of the list of tokens we have
    bytes32[] public tokenList;

    // mapping to keep track of different token balances
    //bytes32 is the ticker symbol for the token
    mapping(address => mapping(bytes32 => uint256)) public tokenBalances;

    // check if the token address is an initialized address => 0 addresses are not initialized
    modifier TokenExists(bytes32 ticker) {
        require(
            tokens[ticker].tokenAddress != address(0),
            "Token does not exists"
        );
        _;
    }

    function addToken(bytes32 ticker, address tokenAddress) external onlyOwner {
        tokens[ticker] = Token(ticker, tokenAddress);
        tokenList.push(ticker);
    }

    // here we need to interact with an ERC20 token contract (from openZeppelin)

    // we need the user to be able to call the ERC20 contract to deposit to this contract
    // we are asking the ERC20 contract to transfer from msg.sender to us
    function deposit(uint256 amount, bytes32 ticker)
        external
        TokenExists(ticker)
    {
        IERC20(tokens[ticker].tokenAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        tokenBalances[msg.sender][ticker] = tokenBalances[msg.sender][ticker]
            .add(amount); // add amount to balance
    }

    // here we are withdrawing from our wallet to deposit to an ERC address
    function withdraw(uint256 amount, bytes32 ticker)
        external
        TokenExists(ticker)
    {
        require(
            tokenBalances[msg.sender][ticker] >= amount,
            "Insufficient balance"
        ); // cheking that we have enough balance to withdraw
        IERC20(tokens[ticker].tokenAddress).transfer(msg.sender, amount); // use transfer function from IERC20
        tokenBalances[msg.sender][ticker] = tokenBalances[msg.sender][ticker]
            .sub(amount); // deduct amount from out balance
    }
}
