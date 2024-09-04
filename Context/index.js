import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";

// imported functions
import {
  contract,
  tokenContract,
  ERC20,
  toEth,
  tokenICOContract,
} from "./constants";

const STAKING_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;

const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
const notifyError = (msg) => toast.error(msg, { duration: 2000 });

// FUNCTIONS
function convertTimestampToReadeable(timestamp) {
  const date = new Date(timestamp * 1000);

  const readeableTime = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return readeableTime;
}

function toWei(amount) {
  const toWei = ethers.utils.parseUnits(amount.toString());
  return toWei.toString();
}

function parseErrorMsg(error) {
  const json = JSON.parse(JSON.stringify(error));
  return json?.reason || json?.error?.message;
}

export const shortenAddress = (address) =>
  `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;

export const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess("Copied Successfully!");
};

export async function contractData(address) {
  try {
    const contractObj = await contract();

    const stakingTokenObj = await tokenContract();

    if (address) {
      const contractOwner = await contractObj.owner();
      const contractAddress = await contractObj.address();

      // NOTIFICATIONS
      const notifications = await contractObj.getNotification();

      const notificationsArray = await Promise.all(
        notifications.map(
          async ({ poolID, amount, user, message, timestamp }) => {
            return {
              poolID: poolID.toNumber(),
              amount: toEth(amount),
              user: user,
              message: message,
              timestamp: convertTimestampToReadeable(timestamp),
            };
          }
        )
      );

      // POOL
      let poolInfoArray = [];
      const poolLength = await contractObj.poolCount();
      const length = poolLength.toNumber();

      for (let i = 0; i < length; i++) {
        const poolInfo = await contractObj.poolInfo(i);
        const userInfo = await contractObj.userInfo(i, address);
        const userReward = await contractObj.pendingReward(i, address);
        const tokenInfoA = await ERC20(poolInfo.depositToken, address);
        const tokenInfoB = await ERC20(poolInfo.rewardToken, address);

        const pool = {
          depositTokenAddress: poolInfo.depositToken,
          rewardTokenAddress: poolInfo.rewardToken,
          depositToken: tokenInfoA,
          rewardToken: tokenInfoB,
          depositedAmount: toEth(poolInfo.depositedAmount.toString()),
          apy: poolInfo.apy.toString(),
          lockDays: poolInfo.lockDays.toString(),

          //USER
          amount: toEth(userInfo.amount.toString()),
          userReward: toEth(userReward),
          lockUntil: convertTimestampToReadeable(userInfo.lockUntil.toNumber()),
          lastRewardAt: toEth(userInfo.lastRewardAt.toString()),
        };

        poolInfoArray.push(pool);
      }

      const totalDepositAmount = poolInfoArray.reduce((total, pool) => {
        return total + parseFloat(pool.depositedAmount);
      }, 0);

      const rewardToken = await ERC20(REWARD_TOKEN, address);
      const depositToken = await ERC20(DEPOSIT_TOKEN, address);

      const data = {
        contractOwner: contractOwner,
        contractAddress: contractAddress,
        notifications: notificationsArray.reverse(),
        rewardToken: rewardToken,
        depositToken: depositToken,
        poolInfoArray: poolInfoArray,
        totalDepositAmount: totalDepositAmount,
        contractTokenBalance:
          depositToken.contractTokenBalance - totalDepositAmount,
      };

      return data;
    }
  } catch (error) {
    console.log(error);
    console.log(parseErrorMsg(error));
    return parseErrorMsg(error);
  }
}

export async function deposit(poolID, amount, address) {
  try {
    notifySuccess("Calling contract...");
    const contractObj = await contract();
    const stakingTokenObj = await tokenContract();

    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

    const currentAllowance = await stakingTokenObj.allowance(
      address,
      contractObj.address
    );

    if (currentAllowance.lt(amountInWei)) {
      notifySuccess("Approving Token...");

      const approveTransaction = await stakingTokenObj.approve(
        contractObj.address,
        amountInWei
      );

      await approveTransaction.wait();

      console.log(`Approved ${amountInWei.toString()} tokens for staking`);
    }

    const gasEstimation = await contractObj.estimateGas.deposit(
      Number(poolID),
      amountInWei
    );

    notifySuccess("Staking token calling...");

    const stakeTransaction = await contractObj.deposit(poolID, amountInWei, {
      gasLimit: gasEstimation,
    });

    const receipt = await stakeTransaction.wait();
    notifySuccess("Token Stake Successfully ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function transferToken(amount, transferAddress) {
  try {
    notifySuccess("Calling contract token...");

    const stakingTokenObj = await tokenContract();

    const transferAmount = ethers.utils.parseEther(amount);

    const approveTransaction = await stakingTokenObj.transfer(
      transferAddress,
      transferAmount
    );

    const receipt = await approveTransaction.wait();
    notifySuccess("Token Transfered Successfully!");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function withdraw(poolID, amount) {
  try {
    notifySuccess("Calling contract...");

    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.withdraw(
      Number(poolID),
      amountInWei
    );

    const data = await contractObj.withdraw(Number(poolID), amountInWei, {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Transaction Successful! ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function claimReward(poolID) {
  try {
    notifySuccess("Calling contract...");

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.claimReward(
      Number(poolID)
    );

    const data = await contractObj.claimReward(Number(poolID), {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Reward claim Successful! ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function createPool(pool) {
  try {
    const { depositToken, rewardToken, apy, lockDays } = pool;

    if (!depositToken || !rewardToken || !apy || !lockDays)
      return notifyError("Provide All the details");

    notifySuccess("Calling contract...");

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.addPool(
      depositToken,
      rewardToken,
      Number(apy),
      Number(lockDays)
    );

    const stakeTransaction = await contractObj.addPool(
      depositToken,
      rewardToken,
      Number(apy),
      Number(lockDays),
      {
        gasLimit: gasEstimation,
      }
    );

    const receipt = await stakeTransaction.wait();
    notifySuccess("Pool created Successfully! ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function modifyPool(poolID, amount) {
  try {
    notifySuccess("Calling contract...");

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.modifyPool(
      Number(poolID),
      Number(amount)
    );

    const data = await contractObj.modifyPool(Number(poolID), Number(amount), {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Pool Modified Successfully! ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

export async function sweep(tokenData) {
  try {
    const { token, amount } = tokenData;

    if (!token || !amount) return notifyError("Data is missing.");

    notifySuccess("Calling contract...");

    const contractObj = await contract();

    const transferAmount = ethers.utils.parseEther(amount);

    const gasEstimation = await contractObj.estimateGas.sweep(
      token,
      transferAmount
    );

    const data = await contractObj.sweep(token, transferAmount, {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("Transaction completed successfully! ✅");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
}

// ADD TOKEN METAMASK
export const addTokenToMetamask = async (token) => {
  if (window.ethereum) {
    const contract = await tokenContract();

    const tokenDecimals = await contract.decimals();
    const tokenAddress = await contract.address();
    const tokenSymbol = await contract.symbol();

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (wasAdded) {
        notifySuccess("Token added successfully ✅");
      } else {
        notifyError("failed to add token");
      }
    } catch (error) {
      notifyError("failed to add token");
    }
  } else {
    notifyError("No wallet found! 😞");
  }
};

//ICO Contract

export const buyToken = async (amount) => {
  try {
    notifySuccess("calling ICO Contract");

    const contract = await tokenICOContract();

    const tokenDetails = await contract.getTokenDetails();
    const availableToken = ethers.utils.formatEther(
      tokenDetails.balance.toString()
    );

    if (availableToken > 1) {
      const price =
        ethers.utils.formatEther(tokenDetails.tokenPrice.toString()) *
        Number(amount);

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      const transaction = await contract.buyToken(Number(amount), {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      const receipt = await transaction.wait();
      notifySuccess("Token bought successfully");
      return receipt;
    } else {
      notifyError("Insufficiant balance");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const tokenWithdraw = async () => {
  try {
    notifySuccess("calling ICO Contract");

    const contract = await tokenICOContract();

    const tokenDetails = await contract.getTokenDetails();
    const availableToken = ethers.utils.formatEther(
      tokenDetails.balance.toString()
    );

    if (availableToken > 1) {
      const transaction = await contract.withdrawAllTokens();

      const receipt = await transaction.wait();
      notifySuccess("Token withdraw successfully");
      return receipt;
    } else {
      notifyError("Insufficiant balance");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const updateToken = async (address) => {
  try {
    if (!address) notifyError("Data is missing");
    notifySuccess("Calling Contract");
    const contract = await tokenICOContract();

    const gasEstimation = await contract.estimateGas.updateToken(address); // change need to do

    const transaction = await contract.updateToken(address, {
      gasLimit: gasEstimation,
    });

    const receipt = await transaction.wait();
    notifySuccess("Updated successfully");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

export const updateTokenPrice = async (price) => {
  try {
    if (!price) notifyError("Data is missing");
    notifySuccess("Calling Contract");
    const contract = await tokenICOContract();

    const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

    const gasEstimation = await contract.estimateGas.updateTokenSalePrice(
      payAmount
    ); // change need to do

    const transaction = await contract.updateTokenSalePrice(payAmount, {
      gasLimit: gasEstimation,
    });

    const receipt = await transaction.wait();
    notifySuccess("Updated successfully");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};
