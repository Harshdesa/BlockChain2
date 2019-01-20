pragma solidity ^0.5.0;

contract AuctionPublic {
    
   uint public highestBid;
   uint public secondHighestBid;
   
   address public highestBidder;
   address public secondHighestBidder;
 
   address public auctioneer;

   modifier onlyBy(address _auctioneer){ require(msg.sender == _auctioneer); _; }

   constructor() public {
     auctioneer = msg.sender;
   }

   function setHighestBid(uint _highestBid, uint _secondHighestBid) public onlyBy(auctioneer){
       highestBid = _highestBid;
       secondHighestBid = _secondHighestBid;
   }
   
   function setHighestBidder(address _highestBidder, address _secondHighestBidder) public onlyBy(auctioneer){
       highestBidder = _highestBidder;
       secondHighestBidder = _secondHighestBidder;
   }
   
   function getHighestBid() view public returns (uint, uint) {
       return (highestBid, secondHighestBid);
   }
   
   function getHighestBidder() view public returns (address, address) {
       return (highestBidder, secondHighestBidder);
   }
}
