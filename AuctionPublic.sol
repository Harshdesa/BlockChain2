pragma solidity ^0.5.0;

contract AuctionPublic {
    
   uint bid;

   function setHighestBid(uint _bid) public {
       bid = _bid;
   }
   
   function getHighestBid() view public returns (uint) {
       return (bid);
   }
   
}
