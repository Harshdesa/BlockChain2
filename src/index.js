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
//var web4 = new Web3(new Web3.providers.HttpProvider(
//    'https://ropsten.infura.io/v3/712ea259789e40bfb36ab7398fcd4430'
//));

import {abi} from './Auctionabi';

import {bytecode} from './Auctionbytecode';

import {abiPublic} from './AuctionPublicabi';

import {bytecodePublic} from './AuctionPublicbytecode';

import {abiCongressFactory} from './CongressFactoryabi';

import {bytecodeCongressFactory} from './CongressFactorybytecode';

import {abiCongress} from './Congressabi';

import {bytecodeCongress} from './Congressbytecode';

import {accountMap} from './accountMappings';


//var myContract = new web3.eth.Contract(abi, "0x2e7d013d076d6bfb9ca330da5d25d13a5604dc49");

var myContract = new web3.eth.Contract(abi, "0xff6f5a92034563cc3556a40e771cb36e0b6806cd");

//var myPublicContract = new web4.eth.Contract(abiPublic, "0xd9a4cca4042e3d15f8bf91bcc27e08f2af66794f");

var myPublicContract = new web4.eth.Contract(abiPublic, "0x1ed7165fe861dd6b133d98b884e5c0415fd5033a");

var myCongressFactoryContract = new web4.eth.Contract(abiCongressFactory, "0xc1faEC6156Fae376da5892B79CafF4f89d27e1f7");

var congressAddress;

console.log("Public contract highest/secondHighest bid details");
//myPublicContract.methods.highestBid().call().then(console.log);
//myPublicContract.methods.highestBidder().call().then(console.log);
//myPublicContract.methods.secondHighestBid().call().then(console.log);
//myPublicContract.methods.secondHighestBidder().call().then(console.log);
myPublicContract.methods.auctioneer().call({from: '0x4a5AD455963CE8935bc5a168EB2DD71c22058363'}, (error, result) => {
  if(result == null) {
    console.log(result + " Result is null");
  }
  else {
    console.log(result);
    console.log(error);
  }
});
myPublicContract.methods.congressFactoryAddress().call({from: '0x4a5AD455963CE8935bc5a168EB2DD71c22058363'}, (error, result) => {
  if(result == null) {
    console.log(result + " Result is null");
  }
  else {
    console.log(result);
    console.log(error);
  }
});
console.log("Details end here");

myContract.methods.highestBid().call().then(console.log);
myContract.methods.highestBidder().call().then(console.log);
myContract.methods.bidEnd().call().then(console.log);
myContract.methods.showValues(2).call({from: '0x21f84d5aa39bd6c73356f96cae6559b133cfaafe'}, (error, result) => {
      console.log(result);
});
myContract.methods.bidders(2).call({from: '0x21f84d5aa39bd6c73356f96cae6559b133cfaafe'}, (error, result) => {
  if(result == null) {
    console.log(result + " Result is null");
  }
});

myPublicContract.methods.getHighestBid().call().then(console.log);


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
//var withdraw_form;

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
      myPublicContract.methods.setHighestBid(event.returnValues[1], 5).send({from:"0x736B1Cd349D45F7f4daA785aA879eE77d7F97572", gas: 100000}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
  
      myPublicContract.methods.setHighestBidder(event.returnValues[0], '0x099bc2afce893cb4e61f9ecca476730ced4c40ea').send({from:"0x736B1Cd349D45F7f4daA785aA879eE77d7F97572", gas: 100000}, function(error, transactionHash){
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
       console.log(error);
    });

  auctioneerCheck = document.getElementById("auctioneerCheck");
  await myCongressFactoryContract.methods.breachSuspected().call({from: accountMap[loginAccount.value]}, (error, res) => {
      auctioneerCheck.textContent += res
    });

  voteResult = document.getElementById("voteResult");
  adjudicationEvents = document.getElementById("adjudicationEvents");
  await myPublicContract.methods.breachContract().call({from: accountMap[loginAccount.value]}, (error, res) => {
      adjudicationEvents.textContent += res
      congressAddress = res;
    });

  //SHOULD NOT BE HERE, ONLY FOR TESTING PURPOSES TEMPORARILY
  //await myPublicContract.methods.createProposal(congressAddress, '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', 5).send({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085'}, function(error, transactionHash){
  //      console.log(transactionHash);
  //      console.log(error);
  //    });

  //STEP 8
  await myPublicContract.methods.breachDecision(congressAddress, 0).send({from: accountMap[loginAccount.value], gas: 1400000}, function(error, transactionHash){
       console.log(transactionHash);
       console.log(error);
    });

  await myPublicContract.methods.breachCommitted().call({from: accountMap[loginAccount.value]}, (error, res) => {
      voteResult.textContent += res
    });


    var allAccounts = await web3.eth.getAccounts(console.log);
    var i=0;
    while(allAccounts.length>i)
    {
      listAccounts.textContent = listAccounts.textContent + '\n' + allAccounts[i] + '\n';
      i++;
    }

    accountButtonsContainer.classList.add("hidden");
    dashboards.classList.remove("hidden");
    if((loginAccount.value).toUpperCase() == (allAccounts[0]).toUpperCase()) {
      participant.classList.add("hidden");
      //populateAuctioneerData();
    } else {
      auctioneer.classList.add("hidden");
    }

  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
    }
}


async function populateAuctioneerData() {

  console.log("Populating auctioneer data");
  var result = 1;
  var i = 0;
  while(result == 1) {
    try {
    await myContract.methods.bidders(i).call({from: '0x21f84d5aa39bd6c73356f96cae6559b133cfaafe', gas: 2000001}, (error, res) => {
      if(res == null) {
        console.log(res + " Result is null");
        result = 0;
      }
      else { console.log(res); auctionData.textContent += res; i++;}
    });
    }
    catch(e) {alert("Something went wrong!");console.log(e);}
  }

}

async function unlockAccount(account, password) {
    await web3.eth.personal.unlockAccount(account, password);
}

async function bid() {
  try {
    console.log(bidAmount.value);
    console.log(loginAccount.value);
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

}

async function auctioneerStartBid() {

  console.log("Auctioneer starts  Bid");
  await myContract.methods.startBid().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt); 
  });
}

async function auctioneerStartReveal() {

  console.log("Auctioneer starts Reveal");
  await myContract.methods.startReveal().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt); 
  });
}

async function withdraw() {

}

async function auctionEnd() {

  console.log("Auctioneer ends Auction");
  await myContract.methods.auctionEnds().send({from:loginAccount.value,  gas: 100000})
  .then((receipt) => {
      console.log(receipt);
  });
}

//TESTED (INCLUDES SETTING COMMITMENTS FROM AUCTIONEER)
async function breachSuspected() {

  console.log(accuseList.value);

  //STEP 2
  await myPublicContract.methods.breachSuspected(["0x4a5AD455963CE8935bc5a168EB2DD71c22058363"]).send({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085'}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
    await myPublicContract.methods.breachContract().call({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', gas: 2000001}, (error, res) => {
      congressAddress = res;
      console.log(congressAddress);
    });
  //STEP 3
    await myPublicContract.methods.createProposal(congressAddress, '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', 5).send({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085'}, function(error, transactionHash){
        console.log(transactionHash);
        console.log(error);
      });
  auctionStatus.textContent += " Auctioneer please enter your commitments for " + accuseList.value + ", a breach has been suspected!! (Wait for 5 seconds for automation)"
  await sleep(5000); 
  
  //STEP 4
  await myCongressFactoryContract.methods.setCommitmentsFromAuctioneer(["0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4c"]).send({from: '0x736B1Cd349D45F7f4daA785aA879eE77d7F97572'}, function(error, result) {
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

  await myPublicContract.methods.breachContract().call({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', gas: 2000001}, (error, res) => {
  congressAddress = res;
  console.log(congressAddress);
  });
  //STEP 6
  await myPublicContract.methods.voteHere(congressAddress, 0, voteDecision.value).send({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', gas: 1400000}, function(error, transactionHash){
  console.log(transactionHash);
  console.log(error);
  });

  //STEP 7
  await myPublicContract.methods.executeProposalHere(congressAddress, 0).send({from: '0x4ACaa5a220c1Da0a59990a034b5C6faC611ce085', gas: 1400000}, function(error, transactionHash){
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
  listAccounts = document.getElementById("listAccounts");
 
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
//  withdraw_form = document.getElementById("withdraw_form");
  
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
