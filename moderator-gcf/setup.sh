#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "This will set the App DB URL and App ID in all the right places."
    echo ""
    echo "Usage: setup.sh <DATABASE_URL>"
    echo "e.g: setup.sh https://hearth-moderator-752c4.firebaseio-staging.com/"
else
    dburl=$1
    dburl="${dburl//\//\\/}" # Regex escape slashes
    dburl="${dburl//\./\\.}" # Regex escape dots

    appid=$(echo $1 | sed 's/https:\/\/\([^\.]*\)\..*/\1/g')

    if [ "$(uname)" == "Darwin" ]; then
        sed -i "" 's/<DATABASE_URL>/'$dburl'/g' functions/config.json
        sed -i "" 's/<DATABASE_URL>/'$dburl'/g' scripts/main.js
        sed -i "" 's/<APP_ID>/'$appid'/g' firebase.json
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        sed -i 's/<DATABASE_URL>/'$dburl'/g' functions/config.json
        sed -i 's/<DATABASE_URL>/'$dburl'/g' scripts/main.js
        sed -i 's/<APP_ID>/'$appid'/g' firebase.json
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
        echo "Windows not supported"
    fi
fi

