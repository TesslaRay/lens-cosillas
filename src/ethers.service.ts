import { ethers, TypedDataDomain, Wallet } from "ethers";

import { CONFIG } from "./config";
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

  // remove the __typedname from the signature!
  return signer._signTypedData(domain, types, value);
};

export {
  ethersProvider,
  getSigner,
  getAddressFromSigner,
  signText,
  signedTypeData,
};
