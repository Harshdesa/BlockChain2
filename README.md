# BlockChain2
Steps to Perform: 

Private Blockchain
For personalized accounts:
1. password.txt -> This includes the password you will use to unlock your account. 

2. # first we create some accounts 
 geth --datadir=./datadir --password ./password.txt account new > account1.txt 
 geth --datadir=./datadir --password ./password.txt account new > account2.txt

3. genesis.json -> This will init the blockchain. Update this to use the addresses from one of the new accounts 

4. geth --datadir ./datadir init genisis.json

All we do is 

yarn install
yarn run start
Now, you can edit the html and javascript dynamically
