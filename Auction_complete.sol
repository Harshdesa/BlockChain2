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

    bool public ended = false;
    bool public reachedPlaceBid = false;
    bool public bidStarted = false;
    bool public revealStarted = false;

    // Events
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
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

    //TESTED
    function bidCommitment(bytes32 _bid) public {
        require(bidStarted == true,"Auction already ended.");
        bids[msg.sender].push(_bid);
        addBidder(msg.sender);
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
        //require(_values.length == lengthOfBids, "values length is not matching");
        //require(_randoms.length == lengthOfBids, "randoms length is not matching");
        
        //for(uint i = 0; i < lengthOfBids; i++) {
        //  values[msg.sender][i] = _values[i];
        //  randoms[msg.sender][i] = _randoms[i];
        //}
        
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
            return false;
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
        
        emit AuctionEnded(highestBidder, highestBid);
        //auctioneer.transfer(highestBid);
    }
}
