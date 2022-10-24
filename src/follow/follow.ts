import { getAddressFromSigner, signedTypeData } from "../ethers.service";

import { login } from "../authentication/login";

import { changeHeaders, lensClient } from "../lens-apollo-client";
import { CreateFollowDataType } from "../grapql/generated";
import { FollowRequest } from "../grapql/lens.types";

const createFollowTypedData = async (request: FollowRequest) => {
  const variables: FollowRequest = request;

  const challengeResponse = await lensClient.request(
    CreateFollowDataType,
    variables
  );

  return challengeResponse.createFollowTypedData;
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
};

(async () => {
  await follow("0x0102cc");
})();
