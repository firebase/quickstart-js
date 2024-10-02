{pkgs, ... }: {
  packages = [];
  bootstrap = ''
    mkdir "$out"
    mkdir "$out"/.idx
    mkdir "$out"/app
    mkdir "$out"/dataconnect
    mkdir "$out"/.vscode

    mv ${./app/src/lib/firebase.idx.tsx} ${./app/src/lib/firebase.tsx}
    mv ${./app/vite.config.idx.ts} ${./app/vite.config.ts}

    cp ${.idx/dev.nix} "$out"/.idx/dev.nix
    cp -a ${./app}/* "$out"/app/
    cp -a ${./dataconnect}/* "$out"/dataconnect/
    cp ${./.vscode/settings.json} "$out"/.vscode/settings.json
    chmod -R u+w "$out"
  '';
}