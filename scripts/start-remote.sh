#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/frontend.tar" ] || [ -f "$SCRIPT_DIR/frontend.tar.gz" ]; then
  ROOT_DIR="$SCRIPT_DIR"
elif [ -f "$SCRIPT_DIR/dist-deploy/frontend.tar" ] || [ -f "$SCRIPT_DIR/dist-deploy/frontend.tar.gz" ]; then
  ROOT_DIR="$SCRIPT_DIR/dist-deploy"
else
  ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
fi
cd "$ROOT_DIR"

if [ -f frontend.tar.gz ]; then
  gunzip -f frontend.tar.gz
fi
if [ -f backend.tar.gz ]; then
  gunzip -f backend.tar.gz
fi

docker load -i frontend.tar
docker load -i backend.tar
docker compose up -d
docker compose ps
