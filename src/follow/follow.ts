import {
  calcGas,
  getAddressFromSigner,
  getTransactionCount,
  signedTypeData,
  splitSignature,
} from "../ethers.service";

import { login } from "../authentication/login";

import { lensClient } from "../lens-apollo-client";
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

const followWithSig = async (profileId: string = "0x11") => {
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

  // get transaction count
  const nonce = await getTransactionCount();

  console.log("\nfollow: nonce", nonce);

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

    const followWithSigTx = await lensHub.followWithSig(
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

    console.log("\nfollow: followWithSigTx", followWithSigTx);

    setTimeout(() => {
      console.log("\nfollow: Waiting for followWithSigTx to be mined...");
    }, 5000);

    await followWithSigTx.wait();

    console.log('\nfollow: Successfully followed: "', profileId);

    return followWithSigTx.hash;
  } catch (error) {
    console.log("\nfollow: error", error);
  }
};

const follow = async (profileId: string = "0x11") => {
  try {
    const gasEstimated = await lensHub.estimateGas.follow([profileId], [0x0]);

    const gas = await calcGas(gasEstimated);

    const followTx = await lensHub.follow([profileId], [0x0], {
      gasLimit: gas.gasLimit,
      maxFeePerGas: gas.maxFeePerGas,
      maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
    });

    console.log("\nfollow: followTx", followTx);

    await followTx.wait();

    console.log("\nfollow: Successfully followed: ", profileId);
  } catch (error) {
    console.log("\nfollow: error", error);
  }
};

(async () => {
  await followWithSig("0x016305");
})();

// (async () => {
//   await follow("0x576b");
// })();
