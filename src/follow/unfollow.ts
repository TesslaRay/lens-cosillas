import { lensHub } from "../lens-hub";

import { lensClient } from "../lens-apollo-client";
import { CreateUnfollowTypedData } from "../grapql/generated";
import { UnfollowRequest } from "../grapql/lens.types";

import {
  calcGas,
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from "../ethers.service";
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

  console.log("\nfollow: Signing typedData with wallet...");
  const signature = await signedTypeData(
    typedData.domain,
    typedData.types,
    typedData.value
  );

  console.log("follow: signature", signature);

  // split signature
  const { v, r, s } = splitSignature(signature);

  // follow transaction
  try {
    const gasEstimated = await lensHub.estimateGas.followWithSig({
      follower: getAddressFromSigner(),
      profileIds: typedData.value.profileIds,
      datas: typedData.value.datas,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });

    const gas = await calcGas(gasEstimated);

    const followTx = await lensHub.followWithSig(
      {
        follower: getAddressFromSigner(),
        profileIds: typedData.value.profileIds,
        datas: typedData.value.datas,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      },
      {
        gasLimit: gas.gasLimit,
        maxFeePerGas: gas.maxFeePerGas,
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
      }
    );

    console.log("\nfollow: followTx", followTx);

    await followTx.wait();

    console.log('\nfollow: Profile followed: "', profileId, '"');

    return followTx.hash;
  } catch (error) {
    console.log("\nfollow: error", error);
  }
};

(async () => {
  await unfollow("0x0f85");
})();
