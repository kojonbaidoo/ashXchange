const { expect } = require("chai");
const hre = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Lock", function () {

    async function deployOneYearLockFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const lockedAmount = 1_000_000_000;

        const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

        // deploy lock contract
        const Lock = await hre.ethers.getContractFactory("Lock");
        const lock = await Lock.deploy(unlockTime, { value: lockedAmount});

        return { lock, unlockTime, lockedAmount };

    };

    it("Should set the right unlockTime", async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        // assert that the value is correct
        expect(await lock.unlockTime()).to.equal(unlockTime);
    });

    it("Should fail with the correct error if called too soon" , async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);
        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
    });

    it("Should transfer funds to the owner" , async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await lock.withdraw();
    });

    it("Should fail to transfer funds to the non-owner" , async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

        const [ owner, otherAccount ] = await ethers.getSigners();
        await time.increaseTo(unlockTime);
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
    });
});