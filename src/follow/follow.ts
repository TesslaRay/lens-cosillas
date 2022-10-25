import {
  calcGas,
  getAddressFromSigner,
  signedTypeData,
  splitSignature,
} from "../ethers.service";

import { login } from "../authentication/login";

import { changeHeaders, lensClient } from "../lens-apollo-client";
import { CreateFollowDataType } from "../grapql/generated";
import { FollowRequest } from "../grapql/lens.types";
import { lensHub } from "../lens-hub";

const createFollowTypedData = async (request: FollowRequest) => {
  const variables: FollowRequest = request;

  const createFollowTypedDataResponse = await lensClient.request(
    CreateFollowDataType,
    variables
  );

  return createFollowTypedDataResponse.createFollowTypedData;
};

const follow = async (profileId: string = "0x11") => {
  const address = getAddressFromSigner();

  console.log("follow: address", address);

  await login();

  console.log("\nfollow: Creating follow typed data for profile:", profileId);
  const followTypedData = await createFollowTypedData({
    request: { follow: [{ profile: profileId }] },
  });

  // Creating follow typed data for profile
  console.log("follow: typedData", followTypedData.typedData);

  const typedData = followTypedData.typedData;

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

    // const gasEstimated = await lensHub.estimateGas.follow([profileId], [0x0]);

    // const gas = await calcGas(gasEstimated);

    // const followTx = await lensHub.follow([profileId], [0x0], {
    //   gasLimit: gas.gasLimit,
    //   maxFeePerGas: gas.maxFeePerGas,
    //   maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
    // });

    console.log("\nfollow: followTx", followTx);

    // await followTx.wait();

    return followTx.hash;
  } catch (error) {
    console.log("\nfollow: error", error);
  }
};

(async () => {
  await follow("0x0102cc");
})();
