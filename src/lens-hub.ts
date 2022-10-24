import { ethers } from "ethers";

import { CONFIG } from "./config";

import { getSigner } from "./ethers.service";

const lensHub = new ethers.Contract(
  CONFIG.LENS_HUB_CONTRACT_ADDRESS,
  CONFIG.LENS_HUB_ABI,
  getSigner()
);

export { lensHub };
