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

    # Create a temporary directory
    tmpdir=$(mktemp -d) 
    cp -a ${./app}/* "$tmpdir"/app/ 

    # Rename the files within the temporary directory
    mv "$tmpdir"/app/src/lib/firebase.tsx "$tmpdir"/app/src/lib/firebase.reg.tsx
    mv "$tmpdir"/app/vite.config.ts "$tmpdir"/app/vite.config.reg.ts

    cp ${.idx/dev.nix} "$out"/.idx/dev.nix
    cp -a "$tmpdir"/app/* "$out"/app/  # Copy from the temporary directory
    cp -a ${./dataconnect}/* "$out"/dataconnect/

    # Use the new file names (from the temporary directory)
    cp "$tmpdir"/app/src/lib/firebase.reg.tsx "$out"/app/src/lib/firebase.tsx  
    cp "$tmpdir"/app/vite.config.reg.ts "$out"/app/vite.config.ts 

    cp ${./.vscode/settings.json} "$out"/.vscode/settings.json
    cp ${./firebase.json} "$out"/firebase.json
    cp ${./README.md} "$out"/README.md
    cp ${./.gitignore} "$out"/.gitignore
    chmod -R u+w "$out" 

    # Clean up the temporary directory
    rm -rf "$tmpdir"
  '';
}