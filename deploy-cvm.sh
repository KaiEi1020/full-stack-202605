#!/usr/bin/env bash
set -euo pipefail

command=${1:-}
shift || true

case "$command" in
  pack)
    pnpm deploy:cvm:pack
    ;;
  transfer)
    pnpm deploy:cvm:transfer -- "$@"
    ;;
  all)
    pnpm deploy:cvm:pack
    pnpm deploy:cvm:transfer -- "$@"
    ;;
  *)
    echo "Usage: bash ./deploy-cvm.sh {pack|transfer|all} [args...]" >&2
    exit 1
    ;;
esac
