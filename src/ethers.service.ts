import { ethers, TypedDataDomain, Wallet } from "ethers";

import { CONFIG } from "./config";

import axios from "axios";
import { omit } from "./helpers";

const ethersProvider = new ethers.providers.JsonRpcProvider(CONFIG.POLYGON_RPC);

const getSigner = () => {
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

  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename")
  );
};

const splitSignature = (signature: string) => {
  const { v, r, s } = ethers.utils.splitSignature(signature);

  return { v, r, s };
};

function parse(data) {
  return ethers.utils.parseUnits(Math.ceil(data) + "", "gwei");
}

const calcGas = async (gasEstimated: ethers.BigNumber) => {
  let gas = {
    gasLimit: gasEstimated, //.mul(110).div(100)
    maxFeePerGas: ethers.BigNumber.from(40000000000),
    maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
  };

  try {
    const { data } = await axios({
      method: "get",
      url: "https://gasstation-mainnet.matic.network/v2",
    });
    gas.maxFeePerGas = parse(data.fast.maxFee);
    gas.maxPriorityFeePerGas = parse(data.fast.maxPriorityFee);
  } catch (error) {}

  console.log("\ncalGas: gas", gas);

  return gas;
};

export {
  ethersProvider,
  getSigner,
  getAddressFromSigner,
  signText,
  signedTypeData,
  splitSignature,
  calcGas,
};
