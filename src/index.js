//Web3 = require('web3');
//web3 = new Web3.providers.HttpProvider("http://localhost:8546");
//var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8547');
//let web3 = new Web3();
//web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8546"));
//web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8547'));

import Web3 from "web3";
const web3 = new Web3("ws://localhost:8547");

import {abi} from './Auctionabi';
console.log(abi);

import {bytecode} from './Auctionbytecode';
console.log(bytecode);

var myContract = new web3.eth.Contract(abi, "0x2e7d013d076d6bfb9ca330da5d25d13a5604dc49");
//var instance_main = abiWeb3.at("0x2e7d013d076d6bfb9ca330da5d25d13a5604dc49");
console.log(myContract);
//console.log(myContract.methods.highestBid());
myContract.methods.highestBid().call().then(console.log);
myContract.methods.highestBidder().call().then(console.log);

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
