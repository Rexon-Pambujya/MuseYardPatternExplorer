export function parseWhatsAppChat(text) {
  const lines = text.split("\n");
  const result = { links: [], quotes: [], notes: [], reflections: [] };

  lines.forEach((line) => {
    if (line.includes("https://")) {
      result.links.push(line.match(/https?:\/\/\S+/)[0]);
    } else if (line.includes('"')) {
      result.quotes.push(line.match(/"([^"]+)"/)[1]);
    } else if (
      line.toLowerCase().includes("note to self") ||
      line.toLowerCase().includes("journal entry")
    ) {
      result.notes.push(line);
    } else if (
      line.toLowerCase().includes("reflection") ||
      line.toLowerCase().includes("thought")
    ) {
      result.reflections.push(line);
    }
  });

  return result;
}
