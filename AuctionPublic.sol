pragma solidity ^0.5.0;

contract AuctionPublic {
    
   uint public highestBid;
   uint public secondHighestBid;
   
   address public highestBidder;
   address public secondHighestBidder;
 
   address public congressFactoryAddress = 0xc1faEC6156Fae376da5892B79CafF4f89d27e1f7;
   address public breachContract;
   
   address public auctioneer;
   bool public breachCommitted = false;
   bool public breach = true;


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
   
   
   //TESTED
   function breachSuspected(address[] memory _accused) public returns (address){
       CongressFactory congressObject = CongressFactory(congressFactoryAddress);
       //breachContract = congressObject.createCongress(_accused, highestBid);
       breachContract = congressObject.createCongress(_accused, msg.sender);
       return breachContract;
   }
   
   //TESTED
   function createProposal(address _breachContract, address beneficiary, uint etherAmount) public returns (uint) {
       Congress bc = Congress(_breachContract);
       return bc.newProposal(beneficiary, etherAmount);
   }
   
   //TESTED
   function voteHere(address _breachContract, uint proposalNumber, bool supportsProposal) public returns (uint) {
       Congress bc = Congress(_breachContract);
       return bc.vote(proposalNumber, supportsProposal);
   }
   
   
   //TESTED
   function executeProposalHere(address _breachContract, uint proposalNumber) public returns (bool) {
       Congress bc = Congress(_breachContract);
       return bc.executeProposal(proposalNumber);
   }
   
   //TESTED
   function breachDecision(address _breachContract, uint _proposalNumber) public returns (bool) {
       Congress bc = Congress(_breachContract);
       breachCommitted = bc.getProposalDecision(_proposalNumber);
       return breachCommitted;
   }
   
   //TESTED
   function auctioneerBreachDecision(address[] memory _accused) public returns (bool) {
       CongressFactory congressObject = CongressFactory(congressFactoryAddress);
       breach = true;
       for(uint i = 0; i< _accused.length; i++) {
          breach = congressObject.checkCommitments(_accused[i]);
        }
        return breach;
       
   }
  
}

interface Congress {
    function newProposal(address beneficiary, uint etherAmount) external returns (uint proposalID);
    function vote(uint proposalNumber, bool supportsProposal) external returns (uint voteID);
    function executeProposal(uint proposalNumber) external returns (bool success);
    function getProposalDecision(uint proposalNumber) external returns (bool decision_code);
}

interface CongressFactory {
    //function createCongress(address [] calldata , uint doh) external returns (address _congressAddress);
    function createCongress(address [] calldata, address acc) external returns (address _breachContract);
    function checkCommitments(address _accused) external returns(bool _breach);
    
}
