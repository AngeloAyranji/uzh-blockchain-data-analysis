#!/bin/bash

set -e

source scripts/util/prepare-env.sh
source scripts/util/prepare-db-data-dir.sh
source scripts/util/compose-cleanup.sh

echo "Building and starting containers..."
docker compose up