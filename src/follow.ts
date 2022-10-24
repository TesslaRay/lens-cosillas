import { lensHub } from "./lens-hub";

const getOwner = async (address: string) => {
  const response = await lensHub.balanceOf(address);

  console.log(response);
};

getOwner("0x3aeC2276326CDC8E9a8A4351c338166e67105AC3");
