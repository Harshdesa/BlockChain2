# BlockChain2
Steps to Perform: 

Private Blockchain

#For personalized accounts:<br />
#This includes the password you will use to unlock your account.<br />
password.txt<br />

#This script will create accounts for the blockchain which you will pre fund in the genesis.json<br />
sh preFundAccount.sh<br />

#Update this everytime to pre fund accounts. Account addresses will change everytime.<br />
genesis.json<br />

#Initialize Blockchain<br />
geth --datadir ./privateDataDir init genesis.json<br />

#Start the blockchain in console mode with the endpoints configured<br />
geth --datadir ./privateDataDir --networkid 1114 --rpc --rpcaddr "localhost" --rpccorsdomain "*" --rpcport 8546 --rpcapi admin,db,eth,debug,net,txpool,personal,web3 --ws --wsorigins "http://localhost:8080" --wsport 8547 --wsapi="eth,web3,personal,miner" console 2>> privateEth.log<br />

#Set the miner. Without a miner, transactions can't be committed. Thus events won't be fired. Thus, nothing will commit to the public blockchain<br />
miner.setEtherbase(web3.eth.accounts[0])
miner.start()

#Open a node console and call the blockchain from there<br />
Web3 = require('web3')<br />
web3 = new Web3();<br />
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8546"));<br />

#Tail the logs for debugging<br />
tail -f privateEth.log<br />

#How to deploy the smart contract<br />
#geth console command for existing BC<br />
var abi = eth.contract([{"constant"...Auctionabi...])<br />
var bytecode = '0x60806040523...Auctionbytecode...'<br />
var deploy = {from:eth.coinbase, data:bytecode, gas: 2000000}<br />
var instance = abi.new(10000, deploy)<br />
instance.address<br />
#geth console command for existing BC<br />
var instance_main = abi.at(instance.address)<br />
instance_main.bid({from: web3.eth.accounts[1], value: 1000, gas: 1000000})<br />
instance_main.highestBid()<br />
instance_main.highestBidder()<br />

All we do is 

yarn install
yarn run start
Now, you can edit the html and javascript dynamically
