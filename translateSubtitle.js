
const openAIApiKey = "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"

import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

import { createStructuredOutputChainFromZod } from "langchain/chains/openai_functions";

// With a `StructuredOutputParser` we can define a schema for the output.
// const parser = StructuredOutputParser.fromNamesAndDescriptions({
//   fullTranslatedContent: "The translated input content",
//   translatedSentences: "The splitted translated sentences, 1 translated sentence corresponds to 1 or more input items",
// });

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    fullTranslatedContent: z.string().describe("The translated input content"),
    translatedSentences: z.array(z.object({
      sentence: z.string().describe("A short and atomic translated sentence"),
      relatedInputItems: z.array(z.object({
        timestamp: z.string().describe("timestamp of item"),
        text: z.string().describe("subtitle content of item")
      })).describe("Related input items, 1 translated sentence corresponds to 1 or more input items"),
    })).describe("The splitted translated sentences, 1 translated sentence corresponds to 1 or more input items"),
  })
);

const zodSchema = z.object({
  fullTranslatedContent: z.string().describe("The translated input content"),
  translatedSentences: z.array(z.object({
    sentence: z.string().describe("A short and atomic translated sentence"),
    relatedInputItems: z.array(z.object({
      timestamp: z.string().describe("timestamp of item"),
      text: z.string().describe("subtitle content of item")
    })).describe("Related input items, 1 translated sentence corresponds to 1 or more input items"),
  })).describe("The splitted translated sentences, 1 translated sentence corresponds to 1 or more input items"),
})

const subtitles = `5
00:00:20,645 --> 00:00:22,772
[David Attenborough] Just 50 years ago,

6
00:00:23,440 --> 00:00:26,276
we finally ventured to the moon.

7
00:00:40,331 --> 00:00:45,837
For the very first time, we looked back at our own planet.

8
00:00:53,344 --> 00:00:58,683
Since then, the human population has more than doubled.

9
00:01:04,230 --> 00:01:08,651
This series will celebrate the natural wonders that remain

10
00:01:09,569 --> 00:01:12,280
and reveal what we must preserve

11
00:01:12,655 --> 00:01:16,785
to ensure people and nature thrive.`

// const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
  template:
    `You are a program responsible for translating subtitles.
    Your task is to translate the subtitles into 简体中文,
    maintain a conversational tone, avoid lengthy sentences,
    and ignore fillers like \"so\", \"you know\", and \"um\", etc. 
    The input is a srt file and consists of many items. Each item consists of 3 lines, the first line is the index number, the second line is the timestamp, and the third line is the subtitle content. Items are separated by empty lines.
    Using the following steps:
    Step 1: Translate the whole input array into 简体中文, ignore the index and timestamp, only translate the text.
    Step 2: Split the translated result into short sentences based on punctuation (e.g., periods, exclamation marks, question marks, etc.)
    Step 3: Find out the input items that correspond to each translated sentence.

    {input}`,
  inputVariables: ["input"],
  // partialVariables: { format_instructions: formatInstructions },
});

// const model = new OpenAI({ temperature: 0, openAIApiKey, verbose: true });

const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey, verbose: true });

const chain = createStructuredOutputChainFromZod(zodSchema, {
  prompt,
  llm,
  outputKey: "person",
});

// const input = await prompt.format({
//   input: subtitles,
// });
const response = await chain.call({input: subtitles});

// console.log(input);

console.log(response);

// console.log(await parser.parse(response));