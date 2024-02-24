function weiToGwei(wei: number): number {
  return wei / 1000000000;
}

function gweiToWei(gwei: number): number {
  return gwei * 1000000000;
}

function etherToWei(ether: number): number {
  return ether * 1000000000000000000;
}

function weiToEther(wei: number): number {
  return wei / 1000000000000000000;
}

function etherToGwei(ether: number): number {
  return ether * 1000000000;
}

function gweiToEther(gwei: number): number {
  return gwei / 1000000000;
}

export { weiToGwei, gweiToWei, etherToWei, weiToEther, etherToGwei, gweiToEther };