#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_IMAGE="resume-frontend:latest"
BACKEND_IMAGE="resume-backend:latest"
ARCHIVE_DIR="$ROOT_DIR/dist-deploy"
REMOTE_USER=""
REMOTE_HOST=""
REMOTE_PORT="22"
REMOTE_DIR=""
INCLUDE_DATA="0"
INCLUDE_STORAGE="0"
COMPRESS="1"
COMMAND=""

usage() {
  cat <<'EOF'
Usage:
  ./deploy-cvm.sh <pack|transfer|all> [options]

Options:
  --host <host>                CVM host or IP
  --user <user>                CVM SSH username
  --dir <dir>                  Target app directory on CVM
  --port <port>                CVM SSH port (default: 22)
  --frontend-image <tag>       Frontend image tag (default: resume-frontend:latest)
  --backend-image <tag>        Backend image tag (default: resume-backend:latest)
  --archive-dir <dir>          Output directory for exported images (default: ./dist-deploy)
  --include-data               Transfer ./data if it exists
  --include-storage            Transfer ./storage if it exists
  --no-compress                Keep plain tar instead of gzip
EOF
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  }
}

parse_args() {
  COMMAND="${1:-}"
  shift || true

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --host)
        REMOTE_HOST="$2"
        shift 2
        ;;
      --user)
        REMOTE_USER="$2"
        shift 2
        ;;
      --dir)
        REMOTE_DIR="$2"
        shift 2
        ;;
      --port)
        REMOTE_PORT="$2"
        shift 2
        ;;
      --frontend-image)
        FRONTEND_IMAGE="$2"
        shift 2
        ;;
      --backend-image)
        BACKEND_IMAGE="$2"
        shift 2
        ;;
      --archive-dir)
        ARCHIVE_DIR="$2"
        shift 2
        ;;
      --include-data)
        INCLUDE_DATA="1"
        shift
        ;;
      --include-storage)
        INCLUDE_STORAGE="1"
        shift
        ;;
      --no-compress)
        COMPRESS="0"
        shift
        ;;
      *)
        printf 'Unknown option: %s\n' "$1" >&2
        usage
        exit 1
        ;;
    esac
  done
}

archive_name() {
  local image="$1"
  local name="${image%%:*}"
  printf '%s.tar' "$name"
}

build_images() {
  require_command docker
  mkdir -p "$ARCHIVE_DIR"
  docker build -f "$ROOT_DIR/frontend/Dockerfile" -t "$FRONTEND_IMAGE" "$ROOT_DIR"
  docker build -f "$ROOT_DIR/backend/Dockerfile" -t "$BACKEND_IMAGE" "$ROOT_DIR"
}

export_images() {
  local frontend_tar backend_tar
  frontend_tar="$ARCHIVE_DIR/$(archive_name "$FRONTEND_IMAGE")"
  backend_tar="$ARCHIVE_DIR/$(archive_name "$BACKEND_IMAGE")"

  docker save -o "$frontend_tar" "$FRONTEND_IMAGE"
  docker save -o "$backend_tar" "$BACKEND_IMAGE"

  if [[ "$COMPRESS" == "1" ]]; then
    require_command gzip
    gzip -f "$frontend_tar"
    gzip -f "$backend_tar"
  fi
}

pack() {
  build_images
  export_images
}

transfer() {
  require_command ssh
  require_command scp

  local frontend_file backend_file
  frontend_file="$ARCHIVE_DIR/$(archive_name "$FRONTEND_IMAGE")"
  backend_file="$ARCHIVE_DIR/$(archive_name "$BACKEND_IMAGE")"

  if [[ "$COMPRESS" == "1" ]]; then
    frontend_file+=".gz"
    backend_file+=".gz"
  fi

  [[ -f "$frontend_file" ]] || { printf 'Missing archive: %s\n' "$frontend_file" >&2; exit 1; }
  [[ -f "$backend_file" ]] || { printf 'Missing archive: %s\n' "$backend_file" >&2; exit 1; }
  [[ -f "$ROOT_DIR/docker-compose.yml" ]] || { printf 'Missing docker-compose.yml\n' >&2; exit 1; }
  [[ -f "$ROOT_DIR/.env" ]] || { printf 'Missing .env\n' >&2; exit 1; }

  ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" "mkdir -p '$REMOTE_DIR' '$REMOTE_DIR/data' '$REMOTE_DIR/storage'"
  scp -P "$REMOTE_PORT" "$frontend_file" "$backend_file" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
  scp -P "$REMOTE_PORT" "$ROOT_DIR/docker-compose.yml" "$ROOT_DIR/.env" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

  if [[ "$INCLUDE_DATA" == "1" && -d "$ROOT_DIR/data" ]]; then
    scp -P "$REMOTE_PORT" -r "$ROOT_DIR/data/." "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/data/"
  fi

  if [[ "$INCLUDE_STORAGE" == "1" && -d "$ROOT_DIR/storage" ]]; then
    scp -P "$REMOTE_PORT" -r "$ROOT_DIR/storage/." "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/storage/"
  fi
}

parse_args "$@"

if [[ -z "$COMMAND" ]]; then
  usage
  exit 1
fi

if [[ "$COMMAND" != "pack" && "$COMMAND" != "transfer" && "$COMMAND" != "all" ]]; then
  usage
  exit 1
fi

if [[ "$COMMAND" == "transfer" || "$COMMAND" == "all" ]]; then
  if [[ -z "$REMOTE_HOST" || -z "$REMOTE_USER" || -z "$REMOTE_DIR" ]]; then
    printf '--host, --user, and --dir are required for transfer/all.\n' >&2
    exit 1
  fi
fi

case "$COMMAND" in
  pack)
    pack
    ;;
  transfer)
    transfer
    ;;
  all)
    pack
    transfer
    ;;
esac
