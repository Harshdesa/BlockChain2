pragma solidity ^0.5.0;

contract Auction {
    address payable public auctioneer;
    uint public bidEnd;
    uint public revealEnd;

    uint256 public total_amount_false = 0;
    uint256 public amount_true = 0;
    uint256 public lengthOfBids = 0;

    address public highestBidder;
    address public secondHighestBidder;

    uint public highestBid;
    uint public secondHighestBid;

    mapping(address => bytes32[]) public bids;
    mapping(address => uint[]) public values;
    mapping(address => uint[]) public randoms;
    address[] public bidders;
    uint public bidderLength = 0;
    bytes32[] public bidsPerParticipant;
    uint[] public valuesPerParticipant;
    uint[] public randomsPerParticipant;
    uint public bidsPerParticipantLength;

    bool public ended = false;
    bool public reachedPlaceBid = false;
    bool public bidStarted = false;
    bool public revealStarted = false;

    // Events
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount, address winnerb, uint amountb);
    event Penalize(address malice, uint amount);

    //Modifiers
    modifier onlyBefore(uint _time) { /*require(now < _time);*/ _; }
    modifier onlyAfter(uint _time) { /*require(now > _time);*/ _; }

    //TESTED
    constructor(uint _bidTimeLimit, uint _revealTimeLimit) public {
        auctioneer = msg.sender;
        bidEnd = now + _bidTimeLimit;
        revealEnd = bidEnd + _revealTimeLimit;
    }

    function startBid() public {
        require(msg.sender == auctioneer, "You are not the auctioneer");
        //TO BE REPLACED BY AN EVENT
        ended = false;
        bidStarted = true;
    }

    function startReveal() public {
        require(msg.sender == auctioneer, "You are not the auctioneer");
        //TO BE REPLACED BY EVENTS
        bidStarted = false;
        revealStarted = true;
    }

    //onlyByAuctioneer
    function getNumberOfBidders() public {
        bidderLength = bidders.length;
    }
    
    //onlyByAuctioneer
    function storeBidsPerParticipant(address _bidder) public {
        delete bidsPerParticipant;
        delete valuesPerParticipant;
        delete randomsPerParticipant;
        bidsPerParticipant = bids[_bidder];
        valuesPerParticipant = values[_bidder];
        randomsPerParticipant = randoms[_bidder];
        bidsPerParticipantLength = bidsPerParticipant.length;
    }

    //TESTED
    function bidCommitment(address _bidder, bytes32 _bid) public {
        require(revealStarted == true,"Auction already ended.");
        require(msg.sender == auctioneer, "You are not the auctioneer");
        bids[_bidder].push(_bid);
        addBidder(_bidder);
    }
    
    
    //TESTED
    function addBidder(address _bidder) internal {
      bool exist = false;
      for(uint i =0; i < bidders.length; i++) {
          if(bidders[i] == _bidder) {
            exist = true;
          }
       }
       if(exist == false) {
        bidders.push(_bidder);
      }
          
      }
    
    function showValues(uint value) pure public returns (bytes32){
        return keccak256(abi.encodePacked(value));
    }
    
    
    //TESTED
    function revealCommitment(uint[] memory _values, uint[] memory _randoms) public {
        require(revealStarted == true,"Auction already ended.");
        lengthOfBids = bids[msg.sender].length;
        require(_values.length == lengthOfBids, "values length is not matching");
        //require(_randoms.length == lengthOfBids, "randoms length is not matching");
        
        values[msg.sender] = _values;
        randoms[msg.sender] = _randoms;
        
        amount_true = 0;
        total_amount_false = 0;

        for(uint i = 0; i < _values.length; i++) {
          if(bids[msg.sender][i] == keccak256(abi.encodePacked(_values[i]))) {
              amount_true = _values[i];
          }
          else {
              total_amount_false = total_amount_false + _values[i];
              emit Penalize(msg.sender, total_amount_false);
          }
        }
        reachedPlaceBid = placeBid(msg.sender, amount_true);
    }

    function placeBid(address _bidder, uint _value) internal
            returns (bool success)
    {
        if (_value <= highestBid) {
            if(_value >= secondHighestBid) {
                secondHighestBid = _value;
                secondHighestBidder = _bidder;
                return true;
            } else {
                return false;
            }
        }
        secondHighestBid = highestBid;
        highestBid = _value;
        
        secondHighestBidder = highestBidder;
        highestBidder = _bidder;
        
        return true;
    }


    function auctionEnds() public onlyAfter(revealEnd){
        require(msg.sender == auctioneer, "You are not the auctioneer");
        require(!ended, "auctionEnd has already been called.");
        ended = true;
        bidStarted = false;
        revealStarted = false;
        
        emit AuctionEnded(highestBidder, highestBid, secondHighestBidder, secondHighestBid);
        //auctioneer.transfer(highestBid);
    }
    
    function reset() public {
        highestBid = 0;
        secondHighestBid= 0;
        ended = false;
        bidStarted = false;
        revealStarted = false;
        total_amount_false = 0;
        amount_true = 0;
        for(uint i =0; i < bidders.length; i++) {
          address _bidder = bidders[i];
          bids[_bidder].length = 0;
       }
        delete bidders;
        bidderLength = 0;
    }
}
