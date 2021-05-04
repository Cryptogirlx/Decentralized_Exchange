pragma solidity ^0.8.0;
import "./Wallet.sol";

contract Dex is Wallet {
    struct Order {
        uint256 id; // id in orders array
        address trader; // traders address
        bool isBuy; // sell or buy order => if isBuy is false then its a sell order
        bytes32 tokenTicker; // token in order
        uint256 amount;
        uint256 price; // how much
    }

    enum buyOrSell {
        // enum is a custom variable that can have different properties
        BUY,
        SELL
    }

    // We need one orderbook for each asset

    mapping(bytes32 => mapping(uint256 => Order[])) public orderBook;

    function getOrderBook(bytes32 ticker, buyOrSell buyorsell)
        public
        view
        returns (Order[] memory)
    {
        return orderBook[ticker][uint256(buyorsell)];
    }

    // function createLimitOrder(
    //     buyOrSell buyorsell,
    //     bytes32 ticker,
    //     uint256 amount,
    //     uint256 price
    // ) public {}
}
