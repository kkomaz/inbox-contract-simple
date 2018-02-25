const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

// Export the giant object
module.exports = solc.compile(source, 1).contracts[':Inbox'];

// bytecode -- actual code of contract and executed on blockchain
// interface - contract ABI (communication layer between solidity and JS)
