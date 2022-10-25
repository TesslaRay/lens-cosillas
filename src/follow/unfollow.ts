import {
  calcGas,
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from "../ethers.service";

import { lensClient } from "../lens-apollo-client";
import { lensHub } from "../lens-hub";
import { CreateUnfollowTypedData } from "../grapql/generated";
import { UnfollowRequest } from "../grapql/lens.types";

import { login } from "../authentication/login";

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

  // unfollow transaction
  try {
    // const gasEstimated = await lensHub.estimateGas.burn(
    //   typedData.value.tokenId
    // );

    // const gas = await calcGas(gasEstimated);

    const unfollowTx = await lensHub.burn(typedData.value.tokenId);

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
