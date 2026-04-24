const fs = require("fs").promises;
const path = require("path");

async function processFiles() {
  const files = ["file1.txt", "file2.txt", "file3.txt"];

  const results = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(__dirname, file);
      try {
        const content = await fs.readFile(filePath, "utf8");
        return content.toUpperCase();
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
        const validContent = `Content of ${file}`;
        await fs.writeFile(filePath, validContent, "utf8");
        console.log(`Created ${file}`);
        return validContent.toUpperCase();
      }
    })
  );

  console.log("All files processed:", results);
}

processFiles().catch((error) => {
  console.error("Error processing files:", error);
});
