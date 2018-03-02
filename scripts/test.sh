set -e
# Run linter
find . -type f -name "*.js" -not -path "*node_modules*" \
  | xargs eslint
