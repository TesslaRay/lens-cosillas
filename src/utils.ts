import { BigNumber, BigNumberish } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export function formatEther(wei: BigNumberish): string {
  return formatUnits(wei, 18);
}

export function parseEther(ether: string): BigNumber {
  return parseUnits(ether, 18);
}
