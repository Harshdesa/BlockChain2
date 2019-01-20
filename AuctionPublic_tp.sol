pragma solidity ^0.5.0;

contract AuctionPublic {
    
   uint public highestBid;
   uint public secondHighestBid;
   
   address public highestBidder;
   address public secondHighestBidder;
 
   address congressFactoryAddress = 0x7c2842d44e7d4535b50f1c975d5cb04f5324ac8f;
   address public breachContract;
 
   address public auctioneer;

   mapping (address => bytes32[]) commitments; 


   modifier onlyBy(address _auctioneer){ require(msg.sender == _auctioneer); _; }
   modifier prohibitedTo(address _auctioneer){ require(msg.sender != _auctioneer); _; }

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
   
   function storeCommitments(bytes32 _commitment) public prohibitedTo(auctioneer){
      commitments[msg.sender].push(_commitment);   
   }
   
   function breachSuspected(address[] memory _accused) public {
       CongressFactory congressObject = CongressFactory(congressFactoryAddress);
       breachContract = congressObject.createCongress(_accused, highestBid);
       Congress bc = Congress(breachContract);
   }
   
  
}

interface Congress {
    function addMember(address targetMember, bytes32 memberName) external;
    function newProposalInEther(address beneficiary, uint etherAmount, bytes32 jobDescription, bytes32 transactionBytecode) external returns (uint proposalID);
    function vote(uint proposalNumber, bool supportsProposal, bytes32 justificationText) external returns (uint voteID);
    function executeProposal(uint proposalNumber, bytes32 transactionBytecode) external returns (bool success);
    function getProposalDecision(uint proposalNumber) external returns (uint decision_code);
}

interface CongressFactory {
    function createCongress(address [] calldata , uint doh) external returns (address _congressAddress);
}
