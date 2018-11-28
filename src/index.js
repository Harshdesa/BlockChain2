import Web3 from "web3";
const web3 = new Web3("ws://localhost:8547");

const web4 = new Web3(Web3.givenProvider);

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

var myContract = new web3.eth.Contract(abi, "0x2e7d013d076d6bfb9ca330da5d25d13a5604dc49");

var myPublicContract = new web4.eth.Contract(abiPublic, "0x013451bf30c7c0611febd97397c2f72bf29b8624");

myContract.methods.highestBid().call().then(console.log);
myContract.methods.highestBidder().call().then(console.log);

myPublicContract.methods.getHighestBid().call().then(console.log);

//JAVASCRIPT VARIABLES
var signup;
var newAccountPassword;
var loginAccount;
var loginPassword;
var loginButton;
var accountButtonsContainer;
var balance;
var accountDetails;
var currentAccount;
var listAccounts;

var bidEvents;
var auctionStatus;

var auctioneer;
var auctionEnd_form;

var participant;
var bid_form;
var bid_amount;
var withdraw_form;

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
    balance.textContent = balance.textContent + (await web3.eth.getBalance(loginAccount.value));
    currentAccount.textContent = currentAccount.textContent + loginAccount.value;
    var allAccounts = await web3.eth.getAccounts(console.log);
    var i=0;
    while(allAccounts.length>i)
    {
      listAccounts.textContent = listAccounts.textContent + '\n' + allAccounts[i] + '\n';
      i++;
    }

    accountButtonsContainer.classList.add("hidden");
    accountDetails.classList.remove("hidden");
    if((loginAccount.value).toUpperCase() == (allAccounts[0]).toUpperCase()) {
      participant.classList.add("hidden");
    } else {
      auctioneer.classList.add("hidden");
    }

  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
    }
}


async function unlockAccount(account, password) {
    await web3.eth.personal.unlockAccount(account, password);
}

async function bid() {
  try {
    console.log(bid_amount.value);
    console.log(loginAccount.value);
    myContract.methods.bid().send({from:loginAccount.value, value: bid_amount.value, gas: 100000}, function(error, transactionHash){
      console.log(transactionHash);
      console.log(error);
    });
  } catch (e) {
      alert("Something went Wrong! Check logs");
      console.log(e);
    }
  
}

async function withdraw() {

}

async function auctionEnd() {

}

function onLoad() {

  //HTML -> JAVASCRIPT
  signup = document.getElementById("signup_form");
  newAccountPassword  = document.getElementById("new_account_password_form");
  loginAccount = document.getElementById("account_login_form");
  loginPassword = document.getElementById("login_password_form");
  loginButton = document.getElementById("login_form");
  accountButtonsContainer = document.getElementById("accountButtons"); 
  accountDetails = document.getElementById("accountDetails");
  balance = document.getElementById("balance");
  currentAccount = document.getElementById("currentAccount");
  listAccounts = document.getElementById("listAccounts");
  
  bidEvents = document.getElementById("bidEvents");
  auctionStatus = document.getElementById("auctionStatus");

  auctioneer = document.getElementById("auctioneer");
  auctionEnd_form = document.getElementById("auctionEnd_form");

  participant = document.getElementById("participant");
  bid_form = document.getElementById("bid_form");
  bid_amount = document.getElementById("bid_amount");
  withdraw_form = document.getElementById("withdraw_form");
  

  //BUTTON EVENT HANDLERS
  loginButton.onclick = login;
  signup.onclick = createAccount;
  bid_form.onclick = bid;
  withdraw_form.onclick = withdraw;
  auctionEnd_form.onclick = auctionEnd;
}

document.body.onload = onLoad;
