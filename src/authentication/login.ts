import { getAddressFromSigner, signText } from "../ethers.service";

import { lensClient } from "../lens-apollo-client";
import { Authenticate, GetChallengue } from "../grapql/generated";
import { ChallengueRequest, SignedAuthChallenge } from "../grapql/lens.types";

import { getAuthenticationToken, setAuthenticationToken } from "../state";

const generateChallenge = async (request: ChallengueRequest) => {
  const variables: ChallengueRequest = request;

  const challengeResponse = await lensClient.request(GetChallengue, variables);

  return challengeResponse.challenge;
};

const authenticate = async (request: SignedAuthChallenge) => {
  const variables: SignedAuthChallenge = request;

  const authResponse = await lensClient.request(Authenticate, variables);

  return authResponse.authenticate;
};

const login = async () => {
  const address = getAddressFromSigner();

  if (getAuthenticationToken()) {
    console.log("login: Already logged in");
    return;
  }

  console.log("\nlogin: Login with address:\n", address);

  // request a challenge from the server
  console.log("\nlogin: Requesting challenge from server...");
  const challengeResponse = await generateChallenge({ request: { address } });

  console.log("login: challengeResponse:", challengeResponse.text);

  // sign the challenge with the wallet
  console.log("login: Signing challenge with wallet...");
  const signature = await signText(challengeResponse.text);

  console.log("login: signature", signature);

  // send the signed challenge to the server
  console.log("\nlogin: Sending signed challenge to server...");
  const authenticationResponse = await authenticate({
    request: { address, signature },
  });

  console.log("login: authenticationResponse", authenticationResponse);

  setAuthenticationToken(authenticationResponse.accessToken);

  return authenticationResponse;
};

export { generateChallenge, login };
