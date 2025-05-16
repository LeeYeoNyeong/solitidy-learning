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
            signers[0].address,
            signers[1].address,
            signers[2].address,
            signers[3].address,
            signers[4].address,
        ]);
        await myTokenC.setManager(tinyBankC.getAddress());
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

    describe("Withdraw", () => {
        it("should return 0 staked after withdrawing total token", async () => {
            const signer0 = signers[0];
            const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
            await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
            await tinyBankC.stake(stakingAmount);
            await tinyBankC.withdraw(stakingAmount);
            expect(await tinyBankC.staked(signer0.address)).equal(0);
        });
    });

    describe("reward", () => {
        it("should reward 1MT every block", async () => {
            const singer0 = signers[0];
            const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
            await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
            await tinyBankC.stake(stakingAmount);

            const BLOCKS = 5n;
            const transferAmount = hre.ethers.parseUnits("1", DECIMALS);
            for (var i = 0; i < BLOCKS; i++) {
                await myTokenC.transfer(transferAmount, singer0.address);
            }

            await tinyBankC.withdraw(stakingAmount);
            expect(await myTokenC.balanceOf(singer0.address)).equal(
                hre.ethers.parseUnits((BLOCKS + MINTING_AMOUNT + 1n).toString())
            );
        });
    });

    describe("MultiManger Access", () => {
        it("should revert when hacker tries to set reward per block", async () => {
            const hacker = signers[5]; // 매니저가 아닌 주소
            
            await expect(
                tinyBankC.connect(hacker).confirm()
            ).to.be.revertedWith("You are not a managers");
        });
    
        it("should revert when not all managers confirmed", async () => {
            const manager1 = signers[0];
            const manager2 = signers[1];
            const manager3 = signers[2];
            const newReward = hre.ethers.parseUnits("2", DECIMALS);
    
            // 3명의 매니저만 confirm, 4번째와 5번째 매니저는 confirm 하지 않음
            await tinyBankC.connect(manager1).confirm();
            await tinyBankC.connect(manager2).confirm();
            await tinyBankC.connect(manager3).confirm();

    
            await expect(
                tinyBankC.setRewardPerBlock(newReward)
            ).to.be.revertedWith("Not all managers confirmed yet");
        });
    });
});