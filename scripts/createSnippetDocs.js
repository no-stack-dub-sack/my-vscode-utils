const fs = require("fs");
const snippetsFolder = "./snippets";

const files = fs.readdirSync(snippetsFolder);

files.forEach((file) => {
  // Skip files that do not end in .json
  if (!file.endsWith(".json")) {
    return;
  }

  let markdownContent = "# Snippets\n\n";

  const data = JSON.parse(fs.readFileSync(`${snippetsFolder}/${file}`));
  const language = file.split(".")[0]; // Assuming file is named like language.json

  markdownContent += `## ${language}\n\n`;

  Object.keys(data).forEach((snippetKey) => {
    const snippet = data[snippetKey];
    markdownContent += `- **${snippetKey}** (_${snippet.prefix}_): ${
      snippet.description || "No description provided"
    }\n`;
  });

  fs.writeFileSync(`${snippetsFolder}/docs/${language}.md`, markdownContent);
});
