pragma solidity ^0.5.0;

contract AuctionPublic {
    
   uint public highestBid;
   uint public secondHighestBid;
   
   address public highestBidder;
   address public secondHighestBidder;
 
   address public congressFactoryAddress = 0x0fC6793DC255866DD52501Bbd348F713b81C47dc;
   address public breachContract;
   
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
   
   
   
   function breachSuspected(address[] memory _accused) public {
       CongressFactory congressObject = CongressFactory(congressFactoryAddress);
       //breachContract = congressObject.createCongress(_accused, highestBid);
       breachContract = congressObject.createCongress(_accused, 1);
       Congress bc = Congress(breachContract);
       
   }
   
  
}

interface Congress {
    function newProposal(address beneficiary, uint etherAmount, bytes32 jobDescription, bytes32 transactionBytecode) external returns (uint proposalID);
    function vote(uint proposalNumber, bool supportsProposal, bytes32 justificationText) external returns (uint voteID);
    function executeProposal(uint proposalNumber, bytes32 transactionBytecode) external returns (bool success);
    function getProposalDecision(uint proposalNumber) external returns (uint decision_code);
}

interface CongressFactory {
    //function createCongress(address [] calldata , uint doh) external returns (address _congressAddress);
    function createCongress(address [] calldata, uint doh) external returns (address _breachContract);
}
