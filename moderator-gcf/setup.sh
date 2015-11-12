#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo ""
    echo "This will set the App DB URL and App ID in all the right places."
    echo "This only works once as it needs templates inside the files it modifies. To run it again restore all the .bak files."
    find . -name '*.bak' | sed "s/^\.\//    /"
    echo ""
    echo "Usage: setup.sh <DATABASE_URL>"
    echo "e.g: setup.sh https://hearth-moderator-752c4.firebaseio-staging.com/"
    echo ""
else
    dburl=$1
    dburl="${dburl//\//\\/}" # Regex escape slashes
    dburl="${dburl//\./\\.}" # Regex escape dots

    appid=$(echo $1 | sed 's/https:\/\/\([^\.]*\)\..*/\1/g')

    if [ "$(uname)" == "Darwin" ]; then
        sed -i ".bak" 's/<DATABASE_URL>/'$dburl'/g' functions/config.json
        sed -i ".bak" 's/<DATABASE_URL>/'$dburl'/g' scripts/main.js
        sed -i ".bak" 's/<APP_ID>/'$appid'/g' firebase.json
    elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        sed -i".bak" 's/<DATABASE_URL>/'$dburl'/g' functions/config.json
        sed -i".bak" 's/<DATABASE_URL>/'$dburl'/g' scripts/main.js
        sed -i".bak" 's/<APP_ID>/'$appid'/g' firebase.json
    elif [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ]; then
        echo "Windows not supported"
    else
        echo "Your platform is not supported"
    fi
fi

