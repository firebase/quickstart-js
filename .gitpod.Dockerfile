FROM gitpod/workspace-full

USER root

# Install Firebase
RUN npm install --global npm firebase firebase-tools
