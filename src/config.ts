import * as dotenv from "dotenv";

import * as fs from "fs";
import * as path from "path";

dotenv.config();

const fileLensHub = fs.readFileSync(
  path.join(__dirname, "abis/lens-hub-contract-abi.json"),
  "utf8"
);

// Global config
export const CONFIG = {
  POLYGON_RPC: "https://polygon-rpc.com/",
  PK: process.env.PK,
  LENS_HUB_CONTRACT_ADDRESS: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
  LENS_HUB_ABI: JSON.parse(fileLensHub),
};
