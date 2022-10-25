import { getAddressFromSigner } from "../ethers.service";

import { lensClient } from "../lens-apollo-client";
import { CreatePostTypedData } from "../grapql/generated";
import { CreatePublicPostRequest } from "../grapql/lens.types";

const createPostTypedData = async (request: CreatePublicPostRequest) => {
  const variables: CreatePublicPostRequest = request;

  const createPostTypedDataResponse = await lensClient.request(
    CreatePostTypedData,
    variables
  );

  return createPostTypedDataResponse.createPostTypedData;
};

const createPost = async () => {
  const profileId = "0xe222";

  const address = getAddressFromSigner();

  console.log("createPost: address", address);
};
