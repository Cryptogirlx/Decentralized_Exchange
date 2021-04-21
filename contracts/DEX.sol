pragma solidity ^0.8.0;
import "./Wallet.sol";

 contract Dex is Wallet{

     struct Order{
         uint id; // id in orders array
         address trader; // traders address
         bool isBuy; // sell or buy order => if isBuy is false then its a sell order
         bytes32 tokenTicker; // token in order
         uint amount;
         uint price; // how much
     }

     enum buyOrSell{ // enum is a custom variable that can have different properties
         BUY,
         SELL
     }

     // We need one orderbook for each asset

     mapping(bytes32 =>mapping(uint=> Order[]));
 }






