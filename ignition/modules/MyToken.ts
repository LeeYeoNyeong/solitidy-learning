import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenDeploy", (m) => {
    const myTokenC = m.contract("MyToken", ["MyToken", "MT", 18])
    return { myTokenC };
})