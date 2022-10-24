import { lensClient } from "../lens-apollo-client";

import { GetChallengue } from "../grapql/generated";

import { ChallengueRequest } from "../grapql/lens.types";

const generateChallenge = async (request: ChallengueRequest) => {
  const variables: ChallengueRequest = {
    request: { address: "0x3aeC2276326CDC8E9a8A4351c338166e67105AC3" },
  };

  const challengeResponse = await lensClient.request(GetChallengue, variables);

  console.log(challengeResponse);
};

export { generateChallenge };
