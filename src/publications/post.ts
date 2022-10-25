import { CreatePostTypedData } from "../grapql/generated";
import { CreatePublicPostRequest } from "../grapql/lens.types";
import { lensClient } from "../lens-apollo-client";

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
};
