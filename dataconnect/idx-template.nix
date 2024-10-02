{pkgs, ... }: {
  packages = [];
  bootstrap = ''
    cp -a --parents . "$out"/
    chmod -R u+w "$out" 
  '';
}