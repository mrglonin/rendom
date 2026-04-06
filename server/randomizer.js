const { randomInt } = require("crypto");

function shuffleRecords(records) {
  const output = [...records];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
}

function sortDrawResults(records, displayColumn, direction) {
  if (direction === "no") {
    return [...records];
  }

  const multiplier = direction === "desc" ? -1 : 1;

  return [...records].sort((left, right) => {
    const leftValue = String(left[displayColumn] || "");
    const rightValue = String(right[displayColumn] || "");

    return leftValue.localeCompare(rightValue, "ru", {
      numeric: true,
      sensitivity: "base",
    }) * multiplier;
  });
}

function pickWinners(records, winnersCount) {
  return shuffleRecords(records).slice(0, winnersCount);
}

module.exports = {
  pickWinners,
  sortDrawResults,
};
