/*
  idx-template \
  --output-dir /home/user/quickstart-js/dataconnect \
  -a '{}' \
  --workspace-name 'dataconnect' \
  /home/user/quickstart-js/template-test \
  --failure-report

*/

{pkgs, ... }: {
  packages = [];
  bootstrap = ''
    mkdir "$out" 
    mkdir "$out"/.idx
    mkdir "$out"/app
    mkdir "$out"/dataconnect
    mkdir "$out"/.vscode

    cp ${.idx/dev.nix} "$out"/.idx/dev.nix
    cp -a ${./app}/* "$out"/app/
    cp -a ${./dataconnect}/* "$out"/dataconnect/

    cp ${./.vscode/settings.json} "$out"/.vscode/settings.json
    cp ${./firebase.json} "$out"/firebase.json
    cp ${./README.md} "$out"/README.md
    cp ${./.gitignore} "$out"/.gitignore
    chmod -R u+w "$out" 
    mv "$out"/app/src/lib/firebase.idx.tsx "$out"/app/src/lib/firebase.tsx  
    mv "$out"/app/vite.config.idx.ts "$out"/app/vite.config.ts 
  '';
}