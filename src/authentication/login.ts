import { lensClient } from "../lens-apollo-client";

import { GetChallengue } from "../grapql/generated";

import { ChallengueRequest } from "../grapql/lens.types";
import { getAuthenticationToken } from "../state";
import { getAddressFromSigner } from "../ethers.service";

const generateChallenge = async (request: ChallengueRequest) => {
  const variables: ChallengueRequest = request;

  const challengeResponse = await lensClient.request(GetChallengue, variables);

  console.log(challengeResponse);
};

const login = async () => {
  const address = getAddressFromSigner();

  if (getAuthenticationToken()) {
    console.log("login: Already logged in");
    return;
  }

  console.log("login: Login with addres: ", address);
};

(async () => {
  await login();
})();

export { generateChallenge, login };
