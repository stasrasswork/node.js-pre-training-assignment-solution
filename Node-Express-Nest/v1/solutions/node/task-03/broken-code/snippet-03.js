const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function processData() {
  console.log("Starting data processing...");

  try {
    let data;

    try {
      data = await readFile("input.txt", "utf8");
      console.log("File read successfully");
    } catch (err) {
      if (err.code !== "ENOENT") {
        data = "Hello World!";
        await writeFile("input.txt", data, "utf8");
        console.log("Input file not found. Created input.txt with default content.");

        data = await readFile("input.txt", "utf8");
        console.log("File read successfully");
      } else {
        throw err;
      }
    } 
    const processedData = data.toUpperCase();

    await writeFile("output.txt", processedData, "utf8");
    console.log("File written successfully");

    const verifyData = await readFile("output.txt", "utf8");
    console.log("Verification successful");
    console.log("Data length:", verifyData.length);
  } catch (err) {
    console.error("Error:", err);
  }
}

processData();
