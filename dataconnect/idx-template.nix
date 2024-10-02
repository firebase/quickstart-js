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
    cp ${./app/src/lib/firebase.idx.tsx} "$out/app/src/lib/firebase.tsx"
    cp ${./app/vite.config.idx.ts} "$out/app/vite.config.ts"
    cp ${./.vscode/settings.json} "$out"/.vscode/settings.json
    chmod -R u+w "$out"
  '';
}