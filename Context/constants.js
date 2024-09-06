import { ethers } from "ethers";
import StakingABI from "./StakingDapp.json";
import TokenICOABI from "./TokenICO.json";
import ERC20ABI from "./ERC20.json";

// Contract addresses
const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const TOKEN_ICO = process.env.NEXT_PUBLIC_TOKEN_ICO;

// TOKEN addresses
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

// FUNCTIONS
export function toEth(amount, decimals = 18) {
  const toEth = ethers.utils.formatUnits(amount, decimals);
  return toEth.toString();
}

export const tokenContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      DEPOSIT_TOKEN,
      ERC20ABI.abi,
      signer
    );
    console.log(contractReader);
    return contractReader;
  }
};

export const contract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      STAKING_ADDRESS,
      StakingABI.abi,
      signer
    );

    return contractReader;
  }
};

export const ERC20 = async (address, userAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(address, ERC20ABI.abi, signer);

    const token = {
      name: await contractReader.name(),
      symbol: await contractReader.symbol(),
      address: await contractReader.address(),
      totalSupply: toEth(await contractReader.totalSupply()),
      balance: toEth(await contractReader.balanceOf(userAddress)),
      contractTokenBalance: toEth(
        await contractReader.balanceOf(STAKING_ADDRESS)
      ),
    };

    return token;
  }
};

// TOKEN ICO CONTRACT

export const LoadTokenICO = async () => {
  try {
    const contract = await tokenICOContract();
    const tokenAddress = await contract.tokenAddress();

    const zeroAddress = 0x0000000000000000000000000000000000000000;

    if (tokenAddress != zeroAddress) {
      const tokenDetails = await contract.getTokenDetails();
      const contractOwner = await contract.owner();
      const soldTokens = await contract.soldTokens();

      const icoToken = await tokenICOERC20();

      const token = {
        tokenBal: ethers.utils.formatEther(tokenDetails.balance.toString()),
        name: tokenDetails.name,
        symbol: tokenDetails.symbol,
        supply: ethers.utils.formatEther(tokenDetails.supply.toString()),
        tokenPrice: ethers.utils.formatEther(
          tokenDetails.tokenPrice.toString()
        ),
        tokenAddr: tokenDetails.tokenAddr,
        owner: contractOwner.toLowerCase(),
        soldTokens: soldTokens.toNumber(),
        token: icoToken,
      };

      return token;
    }
  } catch (error) {
    console.log(error);
  }
};

export const tokenICOContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  if (ethereum) {
    const signer = provider.getSigner();

    const contractReader = new ethers.Contract(
      TOKEN_ICO,
      TokenICOABI.abi,
      signer
    );
    return contractReader;
  }
};

export const tokenICOERC20 = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { ethereum } = window;

  try {
    if (ethereum) {
      const signer = provider.getSigner();

      const contractReader = new ethers.Contract(
        DEPOSIT_TOKEN,
        ERC20ABI.abi,
        signer
      );

      // USER ADDRESS
      const userAddress = await signer.getAddress();
      const nativeBalance = await signer.getBalance();
      // const balance = await contractReader.balanceOf(userAddress);

      const token = {
        address: await contractReader.address(),
        name: await contractReader.name(),
        symbol: await contractReader.symbol(),
        decimals: await contractReader.decimals(),
        supply: toEth(await contractReader.totalSupply()),
        balance: toEth(await contractReader.balanceOf(userAddress)),
        nativeBalance: toEth(nativeBalance.toString()),
      };

      return token;
    }
  } catch (error) {
    console.log(error);
  }
};
