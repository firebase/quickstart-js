set -e
# Run linter
find . -type f -name "*.js" -not -path "*node_modules*" -not -path "*dataconnect-sdk/*" -not -path "*ai/ai-react-app/*" \
  | xargs eslint
