import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-vyper";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  vyper: {
    version: "0.3.10",
  },
  networks: {
    kairos: {
      url: "https://public-en-kairos.node.kaia.io",
      accounts: ["0x908678d4389b94f6160b4ae5c7749002ad25d9d832bbd6c1db94a9519d105e70"],
    }
  },  
  etherscan: {
    apiKey: {
      kairos: "unnecessary",
    },
    customChains: [
      {
        network: "kairos",
        chainId: 1001,
        urls: {
          apiURL: "https://kairos-api.kaiascan.io/hardhat-verify",
          browserURL: "https://kairos.kaiascan.io",
        }
      },
    ]
  }
};

export default config;
