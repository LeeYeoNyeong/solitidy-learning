import hre from "hardhat";
import { expect } from "chai";
import { DECIMALS, MINTING_AMOUNT } from "./constant";
import { MyToken, TinyBank } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TinyBank", () => {
    let signers: HardhatEthersSigner[];
    let myTokenC: MyToken;
    let tinyBankC: TinyBank;
    beforeEach(async () => {
        signers = await hre.ethers.getSigners();
        myTokenC = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            DECIMALS,
            MINTING_AMOUNT,
        ]);
        tinyBankC = await hre.ethers.deployContract("TinyBank", [
            await myTokenC.getAddress(),
        ]);
    });

    describe("Initialized state check", () => {
        it("should return totalStaked 0", async () => {
            expect(await tinyBankC.totalStaked()).equal(0);
        });
        it("should return staked 0 amount of singer0", async () => {
            expect(await tinyBankC.staked(signers[0].address)).equal(0);
        });
    })

    describe("Staking", async () => {
        it("should return staked amount", async () => {
            const signer0 = signers[0];
            const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
            await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
            await tinyBankC.stake(stakingAmount);
            expect(await tinyBankC.staked(signer0.address)).equal(stakingAmount);
            expect(await tinyBankC.totalStaked()).equal(stakingAmount);
            expect(await myTokenC.balanceOf(tinyBankC)).equal(await tinyBankC.totalStaked());
        });
    });
})