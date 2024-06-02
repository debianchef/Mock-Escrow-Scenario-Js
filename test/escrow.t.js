const { expect } = require('chai');
const {
  setReceiver,
  depositFunds,
  releaseFunds,
  refund
} = require('../');



describe('Escrow Contract Interaction Tests', function () {
  this.timeout(60000); // Adjust timeout for async operations


  /**
   * Test to verify setting the receiver address.
   */
  it('should correctly set the receiver address', async function () {
    const receiverAddress = "0xE0E7D81f4778D91ED5CDBE1d01ed121c6B1E31fb";
    const txHash = await setReceiver(receiverAddress);
    expect(txHash).to.be.a('string');
  });

  /**
   * Test to verify depositing funds.
   */
  it('should correctly deposit funds into the contract', async function () {
    const amount = 0.0005;
    const txHash = await depositFunds(amount);
    expect(txHash).to.be.a('string');
  });

  /**
   * Test to verify releasing funds.
   */
  it('should correctly release funds to the receiver', async function () {
    const txHash = await releaseFunds();
    expect(txHash).to.be.a('string');
  });
});
