#!/bin/bash

TARGET="./ai/ai-react-app/src/services/firebaseAIService.ts"

sed -i '' 's/gemini-2\.0-flash-lite/gemini-3.1-flash-lite/g' $TARGET
sed -i '' 's/gemini-2\.0-flash-exp/gemini-3.1-flash-lite/g' $TARGET
sed -i '' 's/gemini-2\.0-flash/gemini-3.1-flash-lite/g' $TARGET




echo ""
echo "Done! Please run 'git diff' to review the changes."
