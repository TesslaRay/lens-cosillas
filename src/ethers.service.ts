import { ethers, Wallet } from "ethers";

import { CONFIG } from "./config";

const ethersProvider = new ethers.providers.JsonRpcProvider(CONFIG.POLYGON_RPC);

const getSigner = () => {
  const wallet = new Wallet(CONFIG.PK as string, ethersProvider);

  return wallet;
};

const getAddressFromSigner = () => {
  const address = getSigner().address;

  return address;
};

export { ethersProvider, getSigner, getAddressFromSigner };
