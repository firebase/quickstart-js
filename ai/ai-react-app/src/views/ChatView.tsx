import React, { useState, useEffect, useRef, useCallback } from "react";
import { handleFunctionExecution } from "../services/firebaseAIService";
import {
  getGenerativeModel,
  Content,
  Part,
  UsageMetadata,
  FunctionResponsePart,
  ChatSession,
  GenerateContentCandidate,
  ModelParams,
  FunctionCall,
  AIError,
  AI,
  GroundingMetadata,
} from "firebase/ai";
import PromptInput from "../components/Common/PromptInput";
import ChatMessage from "../components/Specific/ChatMessage";
import FileUploader from "../components/Common/FileUploader";
import { fileToGenerativePart } from "../utils/fileUtils";
import styles from "./ChatView.module.css";
import { AppMode } from "../App";

interface ChatViewProps {
  aiInstance: AI;
  onUsageMetadataChange: (metadata: UsageMetadata | null) => void;
  currentParams: ModelParams;
  activeMode: AppMode;
}

const modelParamsChanged = (
  newParams: ModelParams,
  oldParams: ModelParams | null,
): boolean => {
  if (!oldParams) return true; // No old params means change

  // Compare critical fields that define a session's core behavior
  if (newParams.model !== oldParams.model) return true;
  if (
    JSON.stringify(newParams.systemInstruction) !==
    JSON.stringify(oldParams.systemInstruction)
  )
    return true;
  if (JSON.stringify(newParams.tools) !== JSON.stringify(oldParams.tools))
    return true;
  if (
    JSON.stringify(newParams.toolConfig) !==
    JSON.stringify(oldParams.toolConfig)
  )
    return true;
  if (
    JSON.stringify(newParams.generationConfig) !==
    JSON.stringify(oldParams.generationConfig)
  )
    return true;
  if (
    JSON.stringify(newParams.safetySettings) !==
    JSON.stringify(oldParams.safetySettings)
  )
    return true;

  return false; // If none of the above changed, params are not significantly different
};

const ChatView: React.FC<ChatViewProps> = ({
  onUsageMetadataChange,
  currentParams,
  aiInstance,
  activeMode,
}) => {
  const [chatHistory, setChatHistory] = useState<Content[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponseParsedJson, setLastResponseParsedJson] = useState<
    object | null
  >(null);
  const [lastGroundingMetadata, setLastGroundingMetadata] =
    useState<GroundingMetadata | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const sessionParamsRef = useRef<ModelParams | null>(null);

  const initializeChatSession = useCallback(
    (params: ModelParams) => {
      try {
        console.log(
          "[ChatView] Initializing new chat session with params:",
          params,
        );
        const model = getGenerativeModel(aiInstance, params);
        const newSession = model.startChat({
          history: [],
          safetySettings: params.safetySettings,
          generationConfig: params.generationConfig,
          tools: params.tools,
          toolConfig: params.toolConfig,
          systemInstruction: params.systemInstruction,
        });
        chatSessionRef.current = newSession;
        // Store a deep copy of the params used for this session
        sessionParamsRef.current = JSON.parse(JSON.stringify(params));
        setChatHistory([]);
        setError(null);
        onUsageMetadataChange(null);
        setLastGroundingMetadata(null);
        console.log("[ChatView] New chat session initialized successfully.");
      } catch (initError: unknown) {
        console.error("[ChatView] Error initializing chat session:", initError);
        setError(`Failed to initialize chat session`);
        chatSessionRef.current = null;
        sessionParamsRef.current = null;
      }
    },
    [onUsageMetadataChange, aiInstance],
  );

  useEffect(() => {
    if (aiInstance) {
      initializeChatSession(currentParams);
    }
  }, [aiInstance, initializeChatSession, currentParams]);

  // Effect to scroll chat history
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const suggestions = [
    "Explain the difference between `let`, `const`, and `var` in JavaScript.",
    "Write a short story about a friendly robot.",
    "Describe this image.",
    "What's the weather in London in Celsius?",
  ];
  const handleSuggestion = (suggestion: string) => {
    setCurrentInput(suggestion);
  };

  const processChatTurn = useCallback(
    async (
      partsToSend: Part[],
      session: ChatSession,
      expectStructuredOutput: boolean,
    ) => {
      console.log(
        "[ChatView] Processing chat turn. Expect JSON:",
        expectStructuredOutput,
        "Parts:",
        partsToSend,
      );
      setChatHistory((prev) => [...prev, { role: "model", parts: [] }]); // Add model placeholder
      let accumulatedParts: Part[] = [];
      let finalModelCandidate: GenerateContentCandidate | undefined;

      try {
        const streamResult = await session.sendMessageStream(partsToSend);
        for await (const chunk of streamResult.stream) {
          if (chunk.candidates?.[0]?.content?.parts) {
            accumulatedParts = [
              ...accumulatedParts,
              ...chunk.candidates[0].content.parts,
            ];
            setChatHistory((prev) => {
              const newHistory = [...prev];
              if (
                newHistory.length > 0 &&
                newHistory[newHistory.length - 1].role === "model"
              ) {
                newHistory[newHistory.length - 1].parts = accumulatedParts;
              }
              return newHistory;
            });
            if (chunk.usageMetadata) onUsageMetadataChange(chunk.usageMetadata);
          }
        }

        const finalResponse = await streamResult.response;
        const finalResponseText = finalResponse.text
          ? finalResponse.text()
          : "";
        finalModelCandidate = finalResponse.candidates?.[0];
        console.log(`[ChatView] Final candidate:`, finalModelCandidate);
        console.log(
          `[ChatView] Grounding Metadata: ${finalModelCandidate?.groundingMetadata}`,
        );

        if (finalModelCandidate?.groundingMetadata) {
          console.log("DEDB lastGroundingMetadata: ", JSON.stringify(finalModelCandidate?.groundingMetadata));
        } else {
          console.log("DEDB no grounding metadata");
        }

        setLastGroundingMetadata(
          finalModelCandidate?.groundingMetadata || null,
        );

        if (!finalModelCandidate) {
          console.warn("[ChatView] No candidate in final response.");
          setError("Model did not return a valid response.");
          setChatHistory((prev) => prev.slice(0, -1)); // Remove model placeholder
          setIsLoading(false);
          return;
        }

        // Update history definitively
        setChatHistory((prev) => {
          const newHistory = [...prev];
          if (
            newHistory.length > 0 &&
            newHistory[newHistory.length - 1].role === "model"
          ) {
            newHistory[newHistory.length - 1].parts =
              finalModelCandidate?.content?.parts ?? [];
          }
          return newHistory;
        });

        const functionCalls = finalModelCandidate.content?.parts
          .filter((part) => !!part.functionCall)
          .map((part) => part.functionCall as FunctionCall);

        if (functionCalls && functionCalls.length > 0) {
          console.log("[ChatView] Function call(s) requested:", functionCalls);
          setLastResponseParsedJson(null); // Clear JSON display

          const functionResponses: FunctionResponsePart[] = [];
          for (const call of functionCalls) {
            if (!call) continue;
            try {
              const apiResult = await handleFunctionExecution(call);
              functionResponses.push({
                functionResponse: { name: call.name, response: apiResult },
              });
            } catch (execError: unknown) {
              console.error(
                `[ChatView] Error executing function ${call.name}:`,
                execError,
              );
              functionResponses.push({
                functionResponse: {
                  name: call.name,
                  response: { error: `Execution failed` },
                },
              });
              setError(`Error executing function ${call.name}.`);
            }
          }

          setChatHistory((prev) => [
            ...prev,
            { role: "function", parts: functionResponses },
          ]);
          console.log(
            "[ChatView] Sending function responses back:",
            functionResponses,
          );

          // Add model placeholder for the NEXT response
          setChatHistory((prev) => [...prev, { role: "model", parts: [] }]);
          accumulatedParts = [];

          // Send function responses and process the stream
          const funcResponseResult =
            await session.sendMessageStream(functionResponses);
          for await (const chunk of funcResponseResult.stream) {
            if (chunk.candidates?.[0]?.content?.parts) {
              accumulatedParts = [
                ...accumulatedParts,
                ...chunk.candidates[0].content.parts,
              ];
              setChatHistory((prev) => {
                const newHistory = [...prev];
                if (
                  newHistory.length > 0 &&
                  newHistory[newHistory.length - 1].role === "model"
                ) {
                  newHistory[newHistory.length - 1].parts = accumulatedParts;
                }
                return newHistory;
              });
              if (chunk.usageMetadata)
                onUsageMetadataChange(chunk.usageMetadata);
            }
          }

          const finalFuncResponse = await funcResponseResult.response;
          const finalFuncResponseText = finalFuncResponse.text
            ? finalFuncResponse.text()
            : "";
          const finalFuncCandidate = finalFuncResponse.candidates?.[0];

          setChatHistory((prev) => {
            const newHistory = [...prev];
            if (
              newHistory.length > 0 &&
              newHistory[newHistory.length - 1].role === "model"
            ) {
              newHistory[newHistory.length - 1].parts =
                finalFuncCandidate?.content?.parts ?? [];
            }
            return newHistory;
          });

          // Check for structured output in the final response after function calls
          if (expectStructuredOutput && finalFuncResponseText) {
            try {
              const parsedJson = JSON.parse(finalFuncResponseText);
              setLastResponseParsedJson(parsedJson);
            } catch (parseError) {
              console.error(
                "[ChatView] Failed to parse JSON after function call:",
                parseError,
              );
              setError(
                "Received non-JSON response when JSON was expected after function call.",
              );
              setLastResponseParsedJson({
                error: "Failed to parse final response as JSON",
                rawText: finalFuncResponseText,
              });
            }
          } else {
            setLastResponseParsedJson(null);
          }
        } else {
          if (expectStructuredOutput && finalResponseText) {
            try {
              const parsedJson = JSON.parse(finalResponseText);
              setLastResponseParsedJson(parsedJson);
            } catch (parseError) {
              console.error(
                "[ChatView] Failed to parse JSON response:",
                parseError,
              );
              setError("Received non-JSON response when JSON was expected.");
              setLastResponseParsedJson({
                error: "Failed to parse response as JSON",
                rawText: finalResponseText,
              });
            }
          } else {
            setLastResponseParsedJson(null);
          }
        }
      } catch (err: unknown) {
        console.error("[ChatView] Error during chat turn processing:", err);
        // Check if it's an AIError and potentially handle specific codes
        if (err instanceof AIError) {
          setError(`AI Error (${err.code}): ${err.message}`);
        } else {
          setError(`Error`);
        }
        // Attempt to remove model placeholder if it was the last thing added on error
        setChatHistory((prev) => {
          if (
            prev.length > 0 &&
            prev[prev.length - 1].role === "model" &&
            prev[prev.length - 1].parts.length === 0
          ) {
            return prev.slice(0, -1);
          }
          return prev;
        });
        onUsageMetadataChange(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onUsageMetadataChange],
  );

  const handleChatSubmit = useCallback(async () => {
    if (isLoading || (!currentInput.trim() && !selectedFile)) {
      return;
    }

    setLastGroundingMetadata(null);
    setIsLoading(true);
    setError(null);
    setLastResponseParsedJson(null);
    onUsageMetadataChange(null);

    const userMessageParts: Part[] = [];
    if (currentInput.trim())
      userMessageParts.push({ text: currentInput.trim() });
    if (selectedFile) {
      try {
        userMessageParts.push(await fileToGenerativePart(selectedFile));
      } catch (imgErr: unknown) {
        if (imgErr instanceof Error) {
          setError(`Failed to process file: ${imgErr.message}`);
        } else {
          setError(`Failed to process file`);
        }
        setIsLoading(false);
        setSelectedFile(null);
        return;
      }
    }
    if (userMessageParts.length === 0) {
      setIsLoading(false);
      return;
    }

    const needsNewSession = modelParamsChanged(
      currentParams,
      sessionParamsRef.current,
    );
    let sessionToUse: ChatSession;

    const currentHistoryForSession = [...chatHistory];

    if (needsNewSession) {
      try {
        console.log(
          "[ChatView] Significant parameters changed or no session exists. Initializing new session *with existing history*.",
        );
        const model = getGenerativeModel(aiInstance, currentParams);
        sessionToUse = model.startChat({
          history: currentHistoryForSession,
          safetySettings: currentParams.safetySettings,
          generationConfig: currentParams.generationConfig,
          tools: currentParams.tools,
          toolConfig: currentParams.toolConfig,
          systemInstruction: currentParams.systemInstruction,
        });
        chatSessionRef.current = sessionToUse;
        sessionParamsRef.current = JSON.parse(JSON.stringify(currentParams));
        console.log("[ChatView] New session started with preserved history.");
      } catch (sessionError: unknown) {
        console.error(
          "[ChatView] Error creating new chat session:",
          sessionError,
        );
        setError(`Failed to start new chat session`);
        setIsLoading(false);
        return;
      }
    } else {
      console.log("[ChatView] Reusing existing chat session.");
      if (!chatSessionRef.current) {
        console.error(
          "[ChatView] Session ref is null unexpectedly. Attempting recovery.",
        );
        try {
          const model = getGenerativeModel(aiInstance, currentParams);
          sessionToUse = model.startChat({ history: currentHistoryForSession });
          chatSessionRef.current = sessionToUse;
          sessionParamsRef.current = JSON.parse(JSON.stringify(currentParams));
        } catch (err: unknown) {
          console.error("[ChatView] Error recovering chat session:", err);
          setError(`Failed to recover chat session`);
          setIsLoading(false);
          return;
        }
      } else {
        sessionToUse = chatSessionRef.current;
      }
    }

    const userMessage: Content = { role: "user", parts: userMessageParts };
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setSelectedFile(null);

    const expectStructuredOutput =
      currentParams.generationConfig?.responseMimeType === "application/json";
    await processChatTurn(
      userMessageParts,
      sessionToUse,
      expectStructuredOutput,
    );
  }, [
    isLoading,
    currentInput,
    selectedFile,
    currentParams,
    chatHistory,
    aiInstance,
    processChatTurn,
    onUsageMetadataChange,
  ]);

  const currentLatLng = currentParams.toolConfig?.retrievalConfig?.latLng;
  const isGroundingWithGoogleMapsActive = !!currentParams.tools?.some(
    (tool) => "googleMaps" in tool,
  );
  const isLatLngInvalid =
    isGroundingWithGoogleMapsActive &&
    ((currentLatLng?.latitude !== undefined &&
      currentLatLng?.longitude === undefined) ||
      (currentLatLng?.latitude === undefined &&
        currentLatLng?.longitude !== undefined));

  return (
    <div className={styles.chatViewContainer}>
      {/* Chat History Area */}
      <div className={styles.chatHistory} ref={chatContainerRef}>
        {chatHistory.length === 0 && !isLoading && (
          <div className={styles.emptyChat}>
            {`Start chatting with ${currentParams.model}!`}
          </div>
        )}
        {chatHistory.map((message, index) => {
          const isLastModelMessage =
            message.role === "model" && index === chatHistory.length - 1;
          return (
            <ChatMessage
              key={`${message.role}-${index}-${message.parts[0]?.text?.slice(0, 10) ?? "part"}`}
              message={message}
              // Pass groundingMetadata only to the last model message that's fully loaded
              groundingMetadata={
                isLastModelMessage && !isLoading ? lastGroundingMetadata : null
              }
            />
          );
        })}
        {isLoading && (
          <div className={styles.loadingBubble}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
        {error && <div className={styles.errorMessage}>{error}</div>}
        {lastResponseParsedJson && !isLoading && (
          <details className={styles.jsonDetails}>
            <summary className={styles.jsonSummary}>
              View Last Response JSON
            </summary>
            <pre>{JSON.stringify(lastResponseParsedJson, null, 2)}</pre>
          </details>
        )}
      </div>

      {/* Input Area Wrapper */}
      <div className={styles.inputAreaContainer}>
        <div className={styles.fileUploaderContainer}>
          <FileUploader
            onFileSelect={setSelectedFile}
            accept="image/*,video/*"
            label="Attach File"
            disabled={isLoading}
          />
        </div>
        <PromptInput
          prompt={currentInput}
          onPromptChange={setCurrentInput}
          onSubmit={handleChatSubmit}
          isLoading={isLoading}
          placeholder="Enter your message or attach a file..."
          suggestions={suggestions}
          onSuggestionClick={handleSuggestion}
          activeMode={activeMode}
          aiInstance={aiInstance}
          currentParams={currentParams}
          selectedFile={selectedFile}
          disabled={isLatLngInvalid}
        />
      </div>
    </div>
  );
};

export default ChatView;
