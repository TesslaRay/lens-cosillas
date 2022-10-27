import { ethers, TypedDataDomain, Wallet } from "ethers";

import { CONFIG } from "./config";

import axios from "axios";

import { formatEther } from "./utils";

const getSigner = () => {
  const ethersProvider = new ethers.providers.JsonRpcProvider(
    CONFIG.POLYGON_RPC
  );

  const wallet = new Wallet(CONFIG.PK as string, ethersProvider);

  return wallet;
};

const getAddressFromSigner = () => {
  const address = getSigner().address;

  return address;
};

const signText = (text: string) => {
  const signer = getSigner();

  const signature = signer.signMessage(text);

  return signature;
};

const signedTypeData = (
  domain: TypedDataDomain,
  types: Record<string, any>,
  value: Record<string, any>
) => {
  const signer = getSigner();

  return signer._signTypedData(domain, types, value);
};

const splitSignature = (signature: string) => {
  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { v, r, s };
};

function parse(data: any) {
  return ethers.utils.parseUnits(Math.ceil(data) + "", "gwei");
}

const calcGas = async (gasEstimated: ethers.BigNumber) => {
  let gas = {
    gasLimit: gasEstimated, // .mul(110).div(100),
    maxFeePerGas: ethers.BigNumber.from(40000000000),
    maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
  };

  try {
    const { data } = await axios.get(
      "https://gasstation-mainnet.matic.network/v2"
    );

    gas.maxFeePerGas = parse(data.fast.maxFee);
    gas.maxPriorityFeePerGas = parse(data.fast.maxPriorityFee);
  } catch (error) {
    console.log("calcGas: error", error);
  }

  console.log("\ncalGas: gas");
  console.log("gasLimit:             ", formatEther(gas.gasLimit));
  console.log("maxFeePeerGas:        ", formatEther(gas.maxFeePerGas));
  console.log("maxPriorityFeePerGas: ", formatEther(gas.maxPriorityFeePerGas));

  return gas;
};

const getTransactionCount = async () => {
  const nonce = await getSigner().getTransactionCount();

  return nonce;
};

export {
  getSigner,
  getAddressFromSigner,
  signText,
  signedTypeData,
  splitSignature,
  calcGas,
  getTransactionCount,
};
