const { ethers } = require("ethers");
const { Network, Alchemy } = require("alchemy-sdk");
require('dotenv').config();

// Load environment variables
const privateKey = process.env.PRIVATE_KEY;
const alchemyApiKey = process.env.ALCHEMY_API_KEY;

// Configure Alchemy settings
const settings = {
    apiKey: alchemyApiKey, // Load from environment variable
    network: Network.ETH_SEPOLIA, // Replace with your network
};


const alchemy = new Alchemy(settings);
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`);

const contractAddress = "0x3a14262CCE72F5F423394fc3925b19a675cCF0BD";
const contractABI = [{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"InvalidReceiverDepositor","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FundsReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"address","name":"receiver","type":"address"}],"name":"ReceiverSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"depositor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RefundIssued","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"deposits","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"fundsReleased","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"receivers","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"depositor","type":"address"}],"name":"refund","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"releaseFunds","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_receiver","type":"address"}],"name":"setReceiver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, provider);
const contractWithSigner = contract.connect(wallet);



/**
 * Get the admin address.
 * @returns {Promise<string>} The admin address.
 */
async function getAdmin() {
    return await contract.admin();
}




/**
 * Set the receiver address.
 * @param {string} receiverAddress - The receiver address to be set.
 * @returns {Promise<string>} Transaction hash.
 */
async function setReceiver(receiverAddress) {
    const tx = await contractWithSigner.setReceiver(receiverAddress);
    await tx.wait();
    return tx.hash;
}

/**
 * Deposit funds into the contract.
 * @param {number} amount - The amount to deposit in ether.
 * @returns {Promise<string>} Transaction hash.
 */
async function depositFunds(amount) {
    const value = ethers.parseEther(amount.toString());
    const tx = await contractWithSigner.deposit(value, { value: value });
    await tx.wait();
    return tx.hash;
}


/**
 * Release the funds to the receiver.
 * @returns {Promise<string>} Transaction hash.
 */
async function releaseFunds() {
    const tx = await contractWithSigner.releaseFunds();
    await tx.wait();
    return tx.hash;
}


/**
 * Issue a refund to the depositor.
 * @param {string} depositorAddress - The address of the depositor to refund.
 * @returns {Promise<string>} Transaction hash.
 */
async function refund(depositorAddress) {
    const tx = await contractWithSigner.refund(depositorAddress);
    await tx.wait();
    return tx.hash;
}



module.exports = {
    getAdmin,
    setReceiver,
    depositFunds,
    releaseFunds,
    refund
};