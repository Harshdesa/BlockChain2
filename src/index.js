import Web3 from "web3";
const web3 = new Web3("ws://localhost:8547");

const web4 = new Web3(Web3.givenProvider);

var sha256 = require('js-sha256');

console.log("15" + sha256('15'));

console.log(web4);
console.log('web4: ');
web4.eth.getAccounts(console.log);
web4.eth.getBlockNumber(console.log);
console.log(web4.eth.accounts[0]);
web4.eth.getBalance("0x736B1Cd349D45F7f4daA785aA879eE77d7F97572").then(console.log);

//var web4 = new Web3(new Web3.providers.HttpProvider(
//    'https://ropsten.infura.io/v3/712ea259789e40bfb36ab7398fcd4430'
//));

import {abi} from './Auctionabi';

import {bytecode} from './Auctionbytecode';

import {abiPublic} from './AuctionPublicabi';

import {bytecodePublic} from './AuctionPublicbytecode';

import {accountMap} from './accountMappings';

//var myContract = new web3.eth.Contract(abi, "0x2e7d013d076d6bfb9ca330da5d25d13a5604dc49");

var myContract = new web3.eth.Contract(abi, "0x4297e7207061ccff4cbe5cb0f7dba4fdcdd2f385");

var myPublicContract = new web4.eth.Contract(abiPublic, "0xd382140c79391bd3aac452081e3989a4a349ad92");

myPublicContract.methods.highestBid().call().then(console.log);
myPublicContract.methods.highestBidder().call().then(console.log);
myPublicContract.methods.secondHighestBid().call().then(console.log);
myPublicContract.methods.secondHighestBidder().call().then(console.log);


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
  
      myPublicContract.methods.setHighestBidder(event.returnValues[0], '0x21f84d5aa39bd6c73356f96cae6559b133cfaafe').send({from:"0x736B1Cd349D45F7f4daA785aA879eE77d7F97572", gas: 100000}, function(error, transactionHash){
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

function onLoad() {

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
//  withdraw_form.onclick = withdraw;
  auctionEnd_form.onclick = auctionEnd;
}

document.body.onload = onLoad;
