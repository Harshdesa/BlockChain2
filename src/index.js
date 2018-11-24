//Web3 = require('web3');
//web3 = new Web3.providers.HttpProvider("http://localhost:8546");
//var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8547');
//let web3 = new Web3();
//web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8546"));
//web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8547'));

import Web3 from "web3";
const web3 = new Web3("ws://localhost:8547");

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
    listAccounts.textContent = listAccounts.textContent + (await web3.eth.getAccounts(console.log));
    accountButtonsContainer.classList.add("hidden");
    accountDetails.classList.remove("hidden");
    
  } catch (e) {
    alert("Something went Wrong! Check logs");
    console.log(e);
    }
}


async function unlockAccount(account, password) {
    await web3.eth.personal.unlockAccount(account, password);
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

  //BUTTON EVENT HANDLERS
  loginButton.onclick = login;
  signup.onclick = createAccount;
}

document.body.onload = onLoad;
