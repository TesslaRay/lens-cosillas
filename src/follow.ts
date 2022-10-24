import { generateChallenge } from "./authentication/login";
import { getAddressFromSigner } from "./ethers.service";

const follow = async (profileId: string = "0x11") => {
  const address = getAddressFromSigner();

  const challengeResponse = await generateChallenge({
    request: { address },
  });

  console.log(challengeResponse);
};

follow();
