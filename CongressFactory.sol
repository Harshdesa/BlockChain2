pragma solidity ^0.5.0;

contract CongressFactory {
    
    uint public test;
    address[] public accused;
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
    
    //MUST BE DONE CONSTANTLY
    function storeCommitments(bytes32 _commitment) public prohibitedTo(auctioneer){
      commitments[msg.sender].push(_commitment);
      addBidder(msg.sender);
    }
    
    
    
    function addBidder(address _bidder) internal {
      bool exist = false;
      for(uint i =0; i < bidders.length; i++) {
          if(bidders[i] == _bidder) { exist = true; }
       }
       if(exist == false) { bidders.push(_bidder); }
      }
    
    //MUST BE DONE BEFORE createCongress
    function setCommitmentsFromAuctioneer(bytes32[] memory _commitments) public onlyBy(auctioneer) {
        commitmentsFromAuctioneer = _commitments;
    }
    
    function checkCommitments(address _accused) internal returns(bool){
        breachSuspected = false;
        for(uint i=0; i< commitments[_accused].length; i++){
            if (commitments[_accused][i] == commitmentsFromAuctioneer[i]) { breachSuspected = false; }
            else { breachSuspected = true; break;}
        }
        return breachSuspected;
    }
    
    function createCongress(address[] memory _accused, uint _test) public returns (address){
        test = _test;
        accused = _accused;
        
        for(uint i = 0; i< accused.length; i++) {
          breach = checkCommitments(accused[i]);
        }
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
    
    event ProposalAdded(uint proposalID, address recipient, uint amount, bytes32 description);
    event Voted(uint proposalID, bool position, address voter, bytes32 justification);
    event ProposalTallied(uint proposalID, int result, uint quorum, bool active);

    struct Proposal {
        address recipient;
        uint amount;
        bytes32 description;
        uint votingDeadline;
        bool executed;
        bool proposalPassed;
        uint numberOfVotes;
        int currentResult;
        bytes32 proposalHash;
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
    
    function newProposal(address beneficiary,uint weiAmount, bytes32 jobDescription, bytes32 transactionBytecode) onlyMembers public
    returns (uint proposalID)
    {
        proposalID = proposals.length++;
        Proposal storage p = proposals[proposalID];
        p.recipient = beneficiary;
        p.amount = weiAmount;
        p.description = jobDescription;
        p.proposalHash = keccak256(abi.encodePacked(beneficiary, weiAmount, transactionBytecode));
        p.votingDeadline = now + debatingPeriodInMinutes * 1 minutes;
        p.executed = false;
        p.proposalPassed = false;
        p.numberOfVotes = 0;
        emit ProposalAdded(proposalID, beneficiary, weiAmount, jobDescription);
        numProposals = proposalID+1;

        return proposalID;
    }
    
    //FOR TESTING PURPOSES
    function checkProposalCode( uint proposalNumber, address beneficiary, uint weiAmount, bytes32 transactionBytecode ) public view
    returns (bool codeChecksOut)
    {
        Proposal storage p = proposals[proposalNumber];
        return p.proposalHash == keccak256(abi.encodePacked(beneficiary, weiAmount, transactionBytecode));
    }
    
    function vote( uint proposalNumber, bool supportsProposal, bytes32 justificationText ) onlyMembers public
    returns (uint voteID)
    {
        Proposal storage p = proposals[proposalNumber];         // Get the proposal
        require(!p.voted[msg.sender]);         // If has already voted, cancel
        p.voted[msg.sender] = true;                     // Set this voter as having voted
        p.numberOfVotes++;                              // Increase the number of votes
        if (supportsProposal) { p.currentResult++;  } 
        else { p.currentResult--;  }

        // Create a log of this event
        emit Voted(proposalNumber,  supportsProposal, msg.sender, justificationText);
        return p.numberOfVotes;
    }
    
    function executeProposal(uint proposalNumber, bytes32 transactionBytecode) public returns (bool success) {
        Proposal storage p = proposals[proposalNumber];

        require(now > p.votingDeadline  && !p.executed 
        && p.proposalHash == keccak256(abi.encodePacked(p.recipient, p.amount, transactionBytecode)) && p.numberOfVotes >= minimumQuorum);

        if (p.currentResult > majorityMargin) {
           p.executed = true; // Avoid recursive calling
           //require(p.recipient.call.value(p.amount)(transactionBytecode));

            p.proposalPassed = true;
        } else { p.proposalPassed = false; }

        // Fire Events
        emit ProposalTallied(proposalNumber, p.currentResult, p.numberOfVotes, p.proposalPassed);
        return true;
    }
    
    function getProposalDecision(uint proposalNumber) public view returns (uint decision_code) {
        Proposal storage p = proposals[proposalNumber];
        if (now < p.votingDeadline) { return 2; }
        else if (!p.executed && p.numberOfVotes >= minimumQuorum && p.currentResult > majorityMargin) { return 1; }
        else { return 0; }
    }
    
}

