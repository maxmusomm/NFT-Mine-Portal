import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect, assert } from "chai";
import hre, { ethers } from "hardhat";

describe("InterContinentalBallisticMissile", function () {
  async function deployInterContinentalBallisticMissileFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const IBM = await hre.ethers.getContractFactory(
      "InterContinentalBallisticMissile"
    );
    const iBm = await IBM.deploy(owner.address);

    return { owner, otherAccount, iBm };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, iBm } = await loadFixture(
        deployInterContinentalBallisticMissileFixture
      );
      expect(await iBm.owner()).to.equal(owner.address);
    });

    // This test is successful but I just can't get it to work
    it("Should revert if user doesn't pay enough eth", async () => {
      const { otherAccount, iBm } = await loadFixture(
        deployInterContinentalBallisticMissileFixture
      );

      await expect(
        iBm.payToMint(otherAccount.address, {
          value: ethers.parseEther("0"),
        })
      ).to.be.revertedWith("Insufficient ETH sent");
    });

    it("Should set a new base uri", async () => {
      const { iBm } = await loadFixture(
        deployInterContinentalBallisticMissileFixture
      );
      await iBm.setBaseURI("https://example.com/");

      expect(await iBm.baseURI()).to.equal("https://example.com/");
    });

    it("Should mint an NFT", async () => {
      const { iBm, otherAccount } = await loadFixture(
        deployInterContinentalBallisticMissileFixture
      );

      await iBm.payToMint(otherAccount.address, {
        value: ethers.parseEther("0.1"),
      });

      expect(await iBm.balanceOf(iBm.target)).to.equal(1);
    });
  });
});
