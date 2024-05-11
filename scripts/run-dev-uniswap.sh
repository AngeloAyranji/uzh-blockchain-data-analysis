#!/bin/bash

set -e

source scripts/util/prepare-env.sh

# Add dev prefix
export PROJECT_NAME="$PROJECT_NAME-uniswap-dev"
export DATA_DIR="$DATA_DIR-dev"

source scripts/util/compose-cleanup.sh

echo "Building and starting containers..."
docker compose \
    -p $PROJECT_NAME \
    -f docker-compose.base.yml \
    -f docker-compose.yml \
    --profile uniswap up --build -d

echo "Attaching logs to uniswap..."
docker compose \
    -p $PROJECT_NAME \
    logs -f uniswap &