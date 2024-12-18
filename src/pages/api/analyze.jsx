import { HfInference } from "@huggingface/inference";

const inference = new HfInference(process.env.HUGGINGFACE_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {
    const { links, quotes, notes, reflections } = JSON.parse(req.body.content);

    // 1. Analyze Quotes - Sentiment Analysis using a proper model
    const sentimentResults = await Promise.all(
      quotes.map(async (quote) => {
        try {
          const result = await inference.textClassification({
            model: "cardiffnlp/twitter-roberta-base-sentiment", // Free-tier sentiment model
            inputs: quote,
          });

          // Map LABEL_0, LABEL_1, LABEL_2 to human-readable sentiments
          const labelMap = {
            LABEL_0: "Negative",
            LABEL_1: "Neutral",
            LABEL_2: "Positive",
          };

          return {
            quote,
            sentiment: labelMap[result[0].label], // Map the label
            score: result[0].score.toFixed(2), // Format the confidence score
          };
        } catch (error) {
          console.error("Sentiment analysis failed:", error);
          return { quote, sentiment: "Error", score: "0.00" };
        }
      })
    );

    // 2. Analyze Reflections - Summarization using the free-tier summarization model
    const reflectionThemes = [];
    for (const reflection of reflections) {
      try {
        const result = await inference.request({
          model: "sshleifer/distilbart-cnn-12-6", // Free-tier summarization model
          inputs: `Summarize and detect themes in the following reflection: ${reflection}`,
          parameters: {
            max_new_tokens: 50,
          },
        });
        const generatedText =
          result?.[0]?.generated_text || "No theme detected.";
        reflectionThemes.push(generatedText);
      } catch (error) {
        console.error("Reflection analysis failed:", error);
        reflectionThemes.push("Unable to analyze due to an error.");
      }
    }

    // 3. Group Links by Domain
    const linkGroups = links.reduce((groups, link) => {
      const domain = new URL(link).hostname;
      groups[domain] = groups[domain] || [];
      groups[domain].push(link);
      return groups;
    }, {});

    // 4. Prepare and Send Response
    const analysis = {
      sentimentResults,
      reflectionThemes,
      linkGroups,
    };

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Error during Hugging Face inference:", error);
    res.status(500).json({ error: "Failed to analyze content" });
  }
}
