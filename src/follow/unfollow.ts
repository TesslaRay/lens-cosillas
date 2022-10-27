import {
  calcGas,
  getAddressFromSigner,
  getSigner,
  getTransactionCount,
  signedTypeData,
  splitSignature,
} from "../ethers.service";

import { lensClient } from "../lens-apollo-client";
import { lensHub } from "../lens-hub";
import { CreateUnfollowTypedData } from "../grapql/generated";
import { UnfollowRequest } from "../grapql/lens.types";

import { login } from "../authentication/login";
import { ethers } from "ethers";
import { CONFIG } from "../config";

const createUnfollowTypedData = async (request: UnfollowRequest) => {
  const variables: UnfollowRequest = request;

  const createUnfollowTypedDataResponse = await lensClient.request(
    CreateUnfollowTypedData,
    variables
  );

  return createUnfollowTypedDataResponse.createUnfollowTypedData;
};
const unfollow = async (profileId: string = "0x11") => {
  const address = getAddressFromSigner();

  console.log("unfollow: address", address);

  await login();

  console.log(
    "\nunfollow: Creating unfollow typed data for profile:",
    profileId
  );
  const unfollowTypedData = await createUnfollowTypedData({
    request: { profile: profileId },
  });

  // Creating unfollow typed data for profile
  console.log("unfollow: typedData", unfollowTypedData.typedData);

  const typedData = unfollowTypedData.typedData;

  console.log("\nunfollow: Signing typedData with wallet...");
  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );

  console.log("unfollow: signature", signature);

  // split signature
  const { v, r, s } = splitSignature(signature);

  // load up the follower nft contract
  const followerNftContract = new ethers.Contract(
    typedData.domain.verifyingContract,
    CONFIG.LENS_FOLLOW_NFT_ABI,
    getSigner()
  );

  const sig = {
    v,
    r,
    s,
    deadline: typedData.value.deadline,
  };

  // get transaction count
  const nonce = await getTransactionCount();

  console.log("\nfollow: nonce", nonce);

  // unfollow transaction
  try {
    const gasEstimated = await followerNftContract.estimateGas.burnWithSig(
      typedData.value.tokenId,
      sig
    );

    const gas = await calcGas(gasEstimated);

    const unfollowTx = await followerNftContract.burnWithSig(
      typedData.value.tokenId,
      sig,
      {
        gasLimit: gas.gasLimit,
        maxFeePerGas: gas.maxFeePerGas,
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
      }
    );

    console.log("\nunfollow: unfollowTx", unfollowTx);

    await unfollowTx.wait();

    console.log('\nunfollow: Successfully unfollowed: "', profileId);

    return unfollowTx.hash;
  } catch (error) {
    console.log("\nunfollow: error", error);
  }
};

(async () => {
  await unfollow("0x0f85");
})();
