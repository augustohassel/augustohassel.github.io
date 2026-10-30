FROM mcr.microsoft.com/devcontainers/javascript-node:22-bookworm

# Install additional utility packages if needed
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git curl \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/augustohassel.github.io

