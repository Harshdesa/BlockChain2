import Web3 from "web3";
const web3 = new Web3("ws://localhost:8547");

const web4 = new Web3(Web3.givenProvider);
console.log(Web3.givenProvider);
console.log(Web3.currentProvider);
var sha256 = require('js-sha256');

console.log("15" + sha256('15'));

console.log(web4);
console.log('web4: ');
web4.eth.getAccounts(console.log);
web4.eth.getBlockNumber(console.log);
console.log(web4.eth.accounts[0]);
try {
 console.log("Printing balance on public");
 console.log(web4.givenProvider.selectedAddress);
}
catch (e) {
console.log(e);
}

import {abi} from './Auctionabi';

import {bytecode} from './Auctionbytecode';

import {abiPublic} from './AuctionPublicabi';

import {bytecodePublic} from './AuctionPublicbytecode';

import {abiCongressFactory} from './CongressFactoryabi';

import {bytecodeCongressFactory} from './CongressFactorybytecode';

import {abiCongress} from './Congressabi';

import {bytecodeCongress} from './Congressbytecode';

import {accountMap} from './accountMappings';

var myContract = new web3.eth.Contract(abi, "0xa01001b15751458e7351bdcac29a14ae0b433dfe");

var myPublicContract = new web4.eth.Contract(abiPublic, "0x8c257b187d218f2c33e42ee99cf52e9672415741");

var myCongressFactoryContract = new web4.eth.Contract(abiCongressFactory, "0xa1AD255f723CdACdB60EEadeC227f088485cAf3d");

var congressAddress;

//JAVASCRIPT VARIABLES
var signup;
var newAccountPassword;
var loginAccount;
var loginPassword;
var loginButton;
var accountButtonsContainer;
var privateBalance;
var publicBalance;
var dashboards;
var privateAccount;
var listAccounts;
var publicAccount;
var bidEvents;
var auctionStatus;

var auctionData;

var auctioneer;
var auctionEnd_form;

var participant;
var bidButton;
var revealButton;
var bidAmount;
var revealAmount;
var revealRandom;

var startBid;
var startReveal;
var breachButton;
var accuseList;
var voteDecision;
var voteButton;

var accused;
var accuser;
var auctioneerCheck;
var voteResult;
var adjudicationEvents;

myContract.events.HighestBidIncreased({ 
}, function(error, event){ console.log(event); }).on('data', function(event){ 
    console.log(event.returnValues[0]); // same results as the optional callback above 
    try {
      bidEvents.textContent = "EVENTS: Highest Bid raised to " + event.returnValues[1];
      myPublicContract.methods.setHighestBid(event.returnValues[1]).send({from:"0x736B1Cd349D45F7f4daA785aA879eE77d7F97572", gas: 100000}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
    } catch (e) {
        console.log(e);
      }
    console.log(event.returnValues[1]); 
}).on('changed', function(event){ 
    //console.log(event.returnValues); // remove event from local database 
}).on('error', console.error);



myContract.events.AuctionEnded({
}, function(error, event){ console.log(event); }).on('data', function(event){
    console.log(event.returnValues[1]); // same results as the optional callback above
    try {
      bidEvents.textContent = "EVENTS: Auction has ended and the winner is  " + event.returnValues[0];
      myPublicContract.methods.setHighestBid(event.returnValues[1], event.returnValues[3]).send({from: accountMap[loginAccount.value] , gas: 100000}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
  
      myPublicContract.methods.setHighestBidder(event.returnValues[0], event.returnValues[2]).send({from: accountMap[loginAccount.value] , gas: 100000}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
    } catch (e) {
        console.log(e);
      }
    console.log(event.returnValues[1]);
}).on('changed', function(event){
    //console.log(event.returnValues); // remove event from local database
}).on('error', console.error);

async function createAccount() {
    try {
        var password = newAccountPassword.value; 
        var account = await web3.eth.personal.newAccount(password)
        await unlockAccount(account, password);
    } catch (e) {
        alert("Something went Wrong! Check logs");
        console.log(e);
    }
}

async function login(){
  try {
    await unlockAccount(loginAccount.value, loginPassword.value); 

    privateAccount.textContent += loginAccount.value;
    privateBalance.textContent += (await web3.eth.getBalance(loginAccount.value));
    publicAccount.textContent += accountMap[loginAccount.value];
    publicBalance.textContent += (await web4.eth.getBalance(accountMap[loginAccount.value]));

    await myPublicContract.methods.highestBid().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
      highestBidA.textContent += res;
    });
    await myPublicContract.methods.secondHighestBid().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
      highestBidB.textContent += res;
    });
    await myPublicContract.methods.highestBidder().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
     highestBidderA.textContent += res;
    });
    await myPublicContract.methods.secondHighestBidder().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
     highestBidderB.textContent += res;
    });

    var auctionHasNotStartedYet = true;
   
    await myContract.methods.ended().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
      if(res) {
        auctionStatus.textContent += " The auction has ended. Winners are declared. If you suspect a breach, please see your dashboard."
        auctionHasNotStartedYet = false;
      }
    });
    
    await myContract.methods.bidStarted().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
      if(res) {
        auctionStatus.textContent += " The bidding phase has started. Please place your bids using your dashboard." 
        auctionHasNotStartedYet = false;
      }
    });

    await myContract.methods.revealStarted().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
      if(res) {
        auctionStatus.textContent += " The reveal phase has started. Please send in the array of values and random numbers you used to place bids."
        auctionHasNotStartedYet = false;
      }
    });
    
    if(auctionHasNotStartedYet) {
      auctionStatus.textContent += "The auction has not started yet. Auctioneer, please start the auction";
    }
    
   
    var adjudication=0;
    
   await myPublicContract.methods.breachContract().call({from: accountMap[loginAccount.value]}, (error, result) => {
      console.log(result.indexOf('0x00'));
      adjudication = result.indexOf('0x00');
    });

  console.log(adjudication);
  if(adjudication < 0) {
//ADJUDICATION DASHBOARD
  //For loop required here
  accused =  document.getElementById("accused");
  await myCongressFactoryContract.methods.accused(0).call({from: accountMap[loginAccount.value]}, (error, res) => {
      accused.textContent += res
    });

  accuser = document.getElementById("accuser");
  await myCongressFactoryContract.methods.accuser().call({from: accountMap[loginAccount.value]}, (error, res) => {
      accuser.textContent += res
    });

  //STEP 5
  await myPublicContract.methods.auctioneerBreachDecision(["0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085"]).send({from: accountMap[loginAccount.value]}, function(error, transactionHash){
       console.log(transactionHash);
    });

  auctioneerCheck = document.getElementById("auctioneerCheck");
  await myCongressFactoryContract.methods.breachSuspected().call({from: accountMap[loginAccount.value]}, (error, res) => {
      auctioneerCheck.textContent += " It is " + res + " that the auctioneer is cheating. "
    });

  voteResult = document.getElementById("voteResult");
  adjudicationEvents = document.getElementById("adjudicationEvents");
  await myPublicContract.methods.breachContract().call({from: accountMap[loginAccount.value]}, (error, res) => {
      adjudicationEvents.textContent += "The current congress contract address is: " + res
      congressAddress = res;
    });


  //STEP 8
  await myPublicContract.methods.breachDecision(congressAddress, 0).send({from: accountMap[loginAccount.value], gas: 1400000}, function(error, transactionHash){
       console.log(transactionHash);
    });

  await myPublicContract.methods.breachCommitted().call({from: accountMap[loginAccount.value]}, (error, res) => {
      voteResult.textContent += "Voting is live. So far, it is " + res + " that a breach has been committed";
    });
  }

    var allAccounts = await web3.eth.getAccounts(console.log);
    var i=0;
    //while(allAccounts.length>i)
   // {
   //   listAccounts.textContent = listAccounts.textContent + '\n' + allAccounts[i] + '\n';
   //   i++;
   // }

    accountButtonsContainer.classList.add("hidden");
    dashboards.classList.remove("hidden");
    if((loginAccount.value).toUpperCase() == (allAccounts[0]).toUpperCase()) {
      participant.classList.add("hidden");
      populateAuctioneerData();
    } else {
      auctioneer.classList.add("hidden");
    }

  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
    }
}


async function populateAuctioneerData() {

  console.log("Populating auctioneer data. Please wait");
  var ended = false;
  await myContract.methods.ended().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
    ended = res;
  });
  var table = document.getElementById("myTable");
  var rowSize = 1;
  var row = table.insertRow(rowSize);
  var cell1 = row.insertCell(0);
  var bidderLength=0;
  await myContract.methods.getNumberOfBidders().send({from:loginAccount.value,  gas: 200001})
    .then((receipt) => {
     console.log(receipt);
    });
  await myContract.methods.bidderLength().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
    bidderLength = res;
  });
  var i=0; 
  while(i<bidderLength) {
    var address;
    await myContract.methods.bidders(i).call({from: loginAccount.value, gas: 2000001}, (error, res) => {
      address = res;
      cell1.innerHTML = address;
    });
    await myContract.methods.storeBidsPerParticipant(address).send({from: loginAccount.value, gas: 2000001})
      .then((receipt) => {
     console.log(receipt);
    });     
    var bidsPerParticipantLength =0;
    await myContract.methods.bidsPerParticipantLength().call({from: loginAccount.value, gas: 2000001}, (error, res) => {
      bidsPerParticipantLength = res;
    });
    var j=0;
    while(j<bidsPerParticipantLength) {
      var cell3;
      await myContract.methods.bidsPerParticipant(j).call({from: loginAccount.value, gas: 2000001}, (error, res) => {
        var cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell2.innerHTML = res;
        cell3.innerHTML = ""
      });
      if(ended) {
        await myContract.methods.valuesPerParticipant(j).call({from: loginAccount.value, gas: 2000001}, (error, res) => {
          cell3.innerHTML = res;
        });
      }
      j++;rowSize++;
      row = table.insertRow(rowSize);
      cell1 = row.insertCell(0);
      cell1.innerHTML = "";      
    }
    i++;
  }
  console.log("Auctioneer data populated");
}

async function unlockAccount(account, password) {
    await web3.eth.personal.unlockAccount(account, password);
}

async function bid() {
  try {
    console.log("Bidder " + loginAccount.value + " is bidding");
    await myContract.methods.bidCommitment(bidAmount.value).send({from:loginAccount.value,  gas: 200001})
    .then((receipt) => {
      console.log(receipt);
  });
  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
    }
  //SENDING SAME COMMITMENT TO CONGRESSFACTORY -> UNCOMMENT BELOW
  try {
    myCongressFactoryContract.methods.storeCommitments(bidAmount.value).send({from: accountMap[loginAccount.value]}, function(error, result) {
    console.log("STEP 2");
    console.log(result);
    console.log(error);
    });
  } catch (e) {
  console.log(e);
  }
  console.log("The bid has been placed!"); 
}

async function reveal() {
  try {
    var values = revealAmount.value.split(",");
    var randoms = revealRandom.value.split(",");
    console.log("Bidder " + loginAccount.value + " is revealing");
    await myContract.methods.revealCommitment(values, randoms).send({from:loginAccount.value,  gas: 200001})
    .then((receipt) => {
     console.log(receipt);
    });
  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
  }
  console.log("The values and randoms have been sent");
}

async function auctioneerStartBid() {

  console.log("Auctioneer starts  Bid");
  await myContract.methods.startBid().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt); 
  });
  console.log("Bid phase started!");
}

async function auctioneerStartReveal() {

  console.log("Auctioneer starts Reveal");
  await myContract.methods.startReveal().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt); 
  });
  console.log("Reveal phase started!");
}


async function auctionEnd() {

  console.log("Auctioneer ends Auction");
  await myContract.methods.auctionEnds().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt);
  });
  console.log("Auction ended!");
}

//TESTED (INCLUDES SETTING COMMITMENTS FROM AUCTIONEER)
async function breachSuspected() {

  console.log(accuseList.value);

  //STEP 2
  await myPublicContract.methods.breachSuspected(["0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085"]).send({from: accountMap[loginAccount.value]}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
    await myPublicContract.methods.breachContract().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
      congressAddress = res;
      console.log(congressAddress);
    });
  //STEP 3
    await myPublicContract.methods.createProposal(congressAddress, '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', 5).send({from: accountMap[loginAccount.value]}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
  auctionStatus.textContent += " Auctioneer please enter your commitments for " + accuseList.value + ", a breach has been suspected!! (Wait for 5 seconds for automation)"
  await sleep(5000); 
 

  // MAKE THIS UN HARDCODED 
  //STEP 4
  await myCongressFactoryContract.methods.setCommitmentsFromAuctioneer(["0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6","0x8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b"]).send({from: '0x736B1Cd349D45F7f4daA785aA879eE77d7F97572'}, function(error, result) {
    console.log("STEP 4");
    console.log(result);
    console.log(error);
    });
    
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//TESTED 
async function voteHere() {

  console.log(voteDecision.value);

  await myPublicContract.methods.breachContract().call({from: accountMap[loginAccount.value], gas: 2000001}, (error, res) => {
  congressAddress = res;
  console.log(congressAddress);
  });
  //STEP 6
  await myPublicContract.methods.voteHere(congressAddress, 0, voteDecision.value).send({from: accountMap[loginAccount.value], gas: 1400000}, function(error, transactionHash){
  console.log(transactionHash);
  console.log(error);
  });

  //STEP 7
  await myPublicContract.methods.executeProposalHere(congressAddress, 0).send({from: accountMap[loginAccount.value], gas: 1400000}, function(error, transactionHash){
    console.log(transactionHash);
    console.log(error);
  });
  
  
}

async function onLoad() {

  //HTML -> JAVASCRIPT
  signup = document.getElementById("signup_form");
  newAccountPassword  = document.getElementById("new_account_password_form");
  loginAccount = document.getElementById("account_login_form");
  loginPassword = document.getElementById("login_password_form");
  loginButton = document.getElementById("login_form");
  accountButtonsContainer = document.getElementById("accountButtons"); 
  dashboards = document.getElementById("dashboards");
  privateBalance = document.getElementById("privateBalance");
  privateAccount = document.getElementById("privateAccount");
  publicAccount = document.getElementById("publicAccount");
  publicBalance = document.getElementById("publicBalance");
  //listAccounts = document.getElementById("listAccounts");
 
  auctionData = document.getElementById("auctionData");
  
  bidEvents = document.getElementById("bidEvents");
  auctionStatus = document.getElementById("auctionStatus");

  auctioneer = document.getElementById("auctioneer");
  auctionEnd_form = document.getElementById("auctionEnd_form");

  participant = document.getElementById("participant");
  bidButton = document.getElementById("bidButton");
  revealButton = document.getElementById("revealButton");
  bidAmount = document.getElementById("bidAmount");
  revealAmount = document.getElementById("revealAmount");
  revealRandom = document.getElementById("revealRandom");
  
  startBid = document.getElementById("startBid");
  startReveal = document.getElementById("startReveal");

  //BUTTON EVENT HANDLERS
  loginButton.onclick = login;
  signup.onclick = createAccount;
  bidButton.onclick = bid;
  revealButton.onclick = reveal;
  startBid.onclick = auctioneerStartBid;
  startReveal.onclick = auctioneerStartReveal;
  auctionEnd_form.onclick = auctionEnd;


  accuseList = document.getElementById("accuseList"); 
  breachButton = document.getElementById("breachButton");
  breachButton.onclick = breachSuspected;

  voteDecision = document.getElementById("voteDecision");
  voteButton = document.getElementById("voteButton");
  voteButton.onclick = voteHere;;

}

document.body.onload = onLoad;
