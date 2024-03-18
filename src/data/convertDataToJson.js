console.time("Time");
import { readFileSync, writeFileSync } from "fs";

//read data from file
const allContents = readFileSync("PriorityMints.txt", "utf-8");
const mintAmount = {};

let currentProvider = "";

allContents.split(/\r?\n/).forEach((line) => {
  //console.log("line: ", line);
  if (line.trim() === "" || line.startsWith("#")) return;
  if (line.startsWith("*")) {
    currentProvider = line.split("*")[1].trim();
    mintAmount[currentProvider] = {};
    return;
  }

  const [address, amount] = line.split(",");

  if (mintAmount[currentProvider][address] === undefined) {
    mintAmount[currentProvider][address] = 0;
  }

  mintAmount[currentProvider][address] += parseInt(amount);
});

console.log("mintAmount: ", JSON.parse(JSON.stringify(mintAmount)));
console.timeEnd("Time");

//export json data to file.json
const whitelistData = JSON.stringify(mintAmount, null, 2);
writeFileSync("mintAmount.json", whitelistData);

export default whitelistData;
