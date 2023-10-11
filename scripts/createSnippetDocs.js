const fs = require("fs");

const snippetsFolder = "./snippets";
const files = fs.readdirSync(snippetsFolder);

const snippetsHeader = "# Snippets\n\n";
const languageHeader = (language) => `## ${language}\n\n`;
const snippetEntry = (
  snippetKey,
  { prefix, description = "No description provided" }
) => `- **${snippetKey}** (_${prefix}_): ${description}\n`;

let allSnippetsMarkdownContent = snippetsHeader;

files.forEach((file) => {
  // skip files that do not end in .json
  if (!file.endsWith(".json")) {
    return;
  }

  let markdownContent = snippetsHeader;

  const data = JSON.parse(fs.readFileSync(`${snippetsFolder}/${file}`));
  const language = file.split(".")[0]; // Assuming file is named like language.json

  markdownContent += languageHeader(language);
  allSnippetsMarkdownContent += languageHeader(language);

  const snippets = Object.entries(data);

  snippets.forEach(([snippetKey, snippet], idx) => {
    markdownContent += snippetEntry(snippetKey, snippet);

    allSnippetsMarkdownContent +=
      snippetEntry(snippetKey, snippet) +
      (idx === snippets.length - 1 ? "\n" : "");
  });

  fs.writeFileSync(`${snippetsFolder}/docs/${language}.md`, markdownContent);
});

fs.writeFileSync(`./snippets/docs/All Snippets.md`, allSnippetsMarkdownContent);
