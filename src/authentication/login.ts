import { lensClient } from "../lens-apollo-client";

import { GetChallengue } from "../grapql/generated";

import { ChallengueRequest } from "../grapql/lens.types";
import { getAuthenticationToken } from "../state";
import { getAddressFromSigner, signText } from "../ethers.service";

const generateChallenge = async (request: ChallengueRequest) => {
  const variables: ChallengueRequest = request;

  const challengeResponse = await lensClient.request(GetChallengue, variables);

  return challengeResponse.challenge;
};

const login = async () => {
  const address = getAddressFromSigner();

  if (getAuthenticationToken()) {
    console.log("login: Already logged in");
    return;
  }

  console.log("login: Login with addres: ", address);

  // request a challenge from the server
  const challengeResponse = await generateChallenge({ request: { address } });

  console.log("login: challengeResponse", challengeResponse.text);

  // sign the challenge with the wallet
  const signature = await signText(challengeResponse.text);

  console.log("login: signature", signature);
};

(async () => {
  await login();
})();

export { generateChallenge, login };
