/**
 * Web 3 Versioning
 * v0.x.x - "Primitive" interface - only callbacks for async code
 * v1.x.x - support for promises + async/await
 * Provider - communication layer between Ethereum and Web3.
   Web3 and ganache are trying to communicate via Provider.
   web3 used to create new contracts && can access existing contracts
 * Mocha Starts
   |-> Deploy a new contract
   |-> Manipulate the contract
   |-> Make an assertion about the contract |-> Deploy a new Contract
 */

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //Constructor.  Used to create instances of the library
const provider = ganache.provider();
const web3 = new Web3(provider); // Instance of web3 and conenct to local test network.
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

/**
 * Inbox - contract
 *
 */

beforeEach(async () => {
  // Get a list of all accounts
  // Returns a promise
  accounts = await web3.eth.getAccounts()

  // Use one of accounts to deploy the contract
  // Get access to the contracts bytecode
  // access web3.eth and a contract property.
  // Interact with existing contracts or complete or deploy new contracts
  // inbox - JS representation of the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    // what/how we want to deploy the new contract
    // args: list of arguments to pass to the constructor function when creating a new contract
    // calling deploy does not actually deploy.  it just creates the object
    .deploy({
      data: bytecode,
      arguments: ['hi there!'],
    })
    // Instructs web3 to send actually does the deploy
    .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    // methods contains - message && setMessage .setMessage()
    // first set of () - apply to arguments.
    // second set of () - used for customization if sending/modify contract data.  Exactly how its called.
    const message = await inbox.methods.message().call();
    assert.equal(message, 'hi there!');
  });

  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({
      from: accounts[0]
    });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  })
});
