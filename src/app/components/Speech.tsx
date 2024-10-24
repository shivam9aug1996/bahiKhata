"use client";
import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";

// const openai = new OpenAI({
//   organization: "org-S27SRLyQh9S2glMpigT74iHD",
//   key: "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",
// });
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});
export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const speakingTimeoutRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if (
      (typeof window !== "undefined" && "SpeechRecognition" in window) ||
      "webkitSpeechRecognition" in window
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      newRecognition.lang = "en-IN"; // Set the language
      newRecognition.continuous = false; // Keep listening for longer speech
      newRecognition.interimResults = true; // Get interim results while speaking

      newRecognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // Clear previous timeout and set a new one
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }

        // Set a timeout to stop recognition after 2 seconds of silence
        speakingTimeoutRef.current = setTimeout(() => {
          newRecognition.stop();
          //setIsListening(false);
        }, 2000);
      };

      newRecognition.onend = () => {
        console.log("ended.....");
        setIsListening(false);
        // Automatically stop listening when recognition ends
        // setIsListening(false);
      };
      newRecognition.end = () => {
        console.log("finally ended.....");
        //setIsListening(false);
      };
      newRecognition.onspeechend = () => {
        console.log("finally1 ended.....");
        // setIsListening(false);
      };
      // newRecognition.onsoundend = () => {
      //   console.log("finally2 ended.....");
      // };
      // newRecognition.onaudioend = () => {
      //   console.log("finally3 ended.....");
      // };
      newRecognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
      };

      setRecognition(newRecognition);
    } else {
      console.error("Speech Recognition API is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    //
    if (!isListening) {
      if (transcript) {
        extractInfoFromTranscript(transcript);
      }
      setTimeout(() => {
        setIsDisabled(false);
      }, 2000);
      console.log("hiuytrtyuio", transcript);
    }
  }, [isListening]);

  const handleStartListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      setIsDisabled(true);
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
      //setIsListening(false);
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    }
  };

  const extractInfoFromTranscript = async (transcript) => {
    try {
      const messages = [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts information from Hindi sentences. Automatically map 'khareeda' and similar words to 'liya' when referring to operations like buying or taking something. Automatically map 'jama','jma','payment' and similar words to 'diya' when referring to operations like giving something. date format must be YYYY-MM-DD",
        },
        {
          role: "user",
          content: `
          Extract the following details from this sentence: 
          - name (like Vinod driver),
          - amount (like 500),
          - operation (like "liya" or "diya"),
          - and date (if any).
          The sentence can be in Hindi.
    
          Example:
          "Vinod driver ne 500 rupye ka saman liya"
          {"name": "Vinod driver", "amount": "500", "operation": "liya", "date": "N/A"}
  
          Sentence: "${transcript}"
        `,
        },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 100,
      });
      console.log("uytrdfghjk", response);

      // Parse the GPT-3 response
      console.log("jhgfghjk", response?.choices[0]?.message?.content);
      const result = JSON.parse(response?.choices[0]?.message?.content);

      console.log("jhgfghjk", result);
      // setExtractedData(result);
    } catch (error) {
      console.error("Error extracting information: ", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Speech to Text (Hindi)</h1>
      <p>
        {isListening ? "Listening..." : "Click the button to start speaking"}
      </p>

      <button
        disabled={isDisabled}
        style={{ opacity: isDisabled ? 0.5 : 1 }}
        onClick={isListening ? handleStopListening : handleStartListening}
      >
        {isListening ? "Stop Listening" : "Start Listening"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h2>Recognized Text:</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>
          {transcript || "Your speech will appear here."}
        </p>
      </div>
    </div>
  );
}
