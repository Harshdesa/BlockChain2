pragma solidity ^0.5.0;

contract CongressFactory {
    
    address[] public accused;
    address public accuser;
    address public auctioneer;
    address[] public congressContracts;
    bool public breachSuspected = false;
    bool public breach = true;
    
    mapping (address => bytes32[]) public commitments;
    bytes32[] public commitmentsFromAuctioneer;
    address [] public bidders;
    
    modifier onlyBy(address _auctioneer){ require(msg.sender == _auctioneer); _; }
    modifier prohibitedTo(address _auctioneer){ require(msg.sender != _auctioneer); _; }
    constructor () public {
        auctioneer = msg.sender;
    }
    
    //MUST BE DONE CONSTANTLY ///TESTED
    function storeCommitments(bytes32 _commitment) public prohibitedTo(auctioneer){
      commitments[msg.sender].push(_commitment);
      addBidder(msg.sender);
    }
    
    
    //TESTED
    function addBidder(address _bidder) internal {
      bool exist = false;
      for(uint i =0; i < bidders.length; i++) {
          if(bidders[i] == _bidder) { exist = true; }
       }
       if(exist == false) { bidders.push(_bidder); }
      }
    
    //MUST BE DONE BEFORE createCongress, must be equal in length to function //TESTED
    function setCommitmentsFromAuctioneer(bytes32[] memory _commitments) public onlyBy(auctioneer) {
        commitmentsFromAuctioneer = _commitments;
    }
    
    //TESTED
    function checkCommitments(address _accused) public returns(bool){
        breachSuspected = false;
        for(uint i=0; i< commitments[_accused].length; i++){
            if (commitments[_accused][i] == commitmentsFromAuctioneer[i]) { breachSuspected = false; }
            else { breachSuspected = true; break;}
        }
        return breachSuspected;
    }
    
    function createCongress(address[] memory _accused, address _accuser) public returns (address){
        accused = _accused;
        accuser = _accuser;
        
        
        address congressContract = address(new Congress(bidders));
        congressContracts.push(congressContract);
        
        return congressContract;
    }
}


contract Congress {
    uint public minimumQuorum;
    uint public debatingPeriodInMinutes;
    int public majorityMargin;
    Proposal[] public proposals;
    uint public numProposals;
    mapping (address => uint) public memberId;
    address[] public members;
    uint public minimumQuorumForProposals = 5;
    uint public minutesForDebate = 10;
    uint public marginOfVotesForMajority = 5;
    
    event ProposalAdded(uint proposalID, address recipient, uint amount);
    event Voted(uint proposalID, bool position, address voter);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);

    struct Proposal {
        address recipient;
        uint amount;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        Vote[] votes;
        mapping (address => bool) voted;
    } 
    
    struct Vote {
        bool inSupport;
        address voter;
        string justification;
    }
    
     modifier onlyMembers { require(memberId[msg.sender] != 0); _; }
     
     constructor (address[] memory _members)  payable public {
        members = _members;
        for(uint i = 0; i< members.length; i++) {
            memberId[members[i]] = 1;
        }
    }
    
    
    //CHANGE HERE , REMOVE onlyMembers
    //When detect breach is pressed, a pop up block should spring to enter these details
    function newProposal(address beneficiary,uint weiAmount) public
    returns (uint)
    {
        uint proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = weiAmount;
        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        emit ProposalAdded(proposalID, beneficiary, weiAmount);
        numProposals = proposalID+1;

        return proposalID;
    }
    
    //FOR TESTING PURPOSES
    function checkProposalCode( uint proposalNumber) public view
    returns (bool)
    {
        Proposal storage p = proposals[proposalNumber];
        return p.proposalPassed;
    }
    
    // For pressing the vote button
    function vote( uint proposalNumber, bool supportsProposal) public
    returns (uint)
    {
        Proposal storage p = proposals[proposalNumber];         // Get the proposal
        require(!p.voted[msg.sender]);         // If has already voted, cancel
        p.voted[msg.sender] = true;                     // Set this voter as having voted
        p.numberOfVotes++;                              // Increase the number of votes
        if (supportsProposal) { p.currentResult++;  } 
        else { p.currentResult--;  }

        // Create a log of this event
        emit Voted(proposalNumber,  supportsProposal, msg.sender);
        return p.numberOfVotes;
    }
    
    //When someone logs in, run this in background first
    function executeProposal(uint proposalNumber) public returns (bool) {
        Proposal storage p = proposals[proposalNumber];

        if (p.currentResult > majorityMargin) {
           p.executed = true; // Avoid recursive calling
           //require(p.recipient.call.value(p.amount)(transactionBytecode));

            p.proposalPassed = true;
        } else { p.proposalPassed = false; }

        // Fire Events
        emit ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
        return true;
    }
    
    
    //TO MODIFY
    //When someone logs in, run this in background second and populate
    function getProposalDecision(uint proposalNumber) public view returns (bool) {
        Proposal storage p = proposals[proposalNumber];
        //if (now < p.votingDeadline) { return 2; }
        //else if (!p.executed && p.numberOfVotes >= minimumQuorum && p.currentResult > majorityMargin) { return 1; }
        //else { return 0; }
        return p.proposalPassed;
    }
    
}

