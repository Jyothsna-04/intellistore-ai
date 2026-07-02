#!/usr/bin/env bash
# bootstrap.sh - IntelliStore AI Startup Script
set -e

echo "=================================================="
echo "    IntelliStore AI - Automated Setup Wizard      "
echo "=================================================="
echo ""

# 1. Check dependencies
echo "Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo >&2 "Error: docker is required but not installed. Aborting."; exit 1; }
echo "Prerequisites OK."
echo ""

# 2. Generate secure secrets
echo "Checking for .env.local..."
if [ ! -f .env.local ]; then
    echo -e "\033[1;33mGenerating .env.local with secure random secrets...\033[0m"
    
    # Generate random base64 strings (stripping non-alphanumeric chars for safety)
    PG_PASS=$(head -c 24 /dev/urandom | base64 | tr -d '+/=' | head -c 24)
    MINIO_PASS=$(head -c 32 /dev/urandom | base64 | tr -d '+/=' | head -c 32)
    JWT_SEC=$(head -c 64 /dev/urandom | base64 | tr -d '+/=' | head -c 64)
    ENC_KEY=$(head -c 32 /dev/urandom | base64 | tr -d '+/=' | head -c 32)

    sed -e "s/POSTGRES_PASSWORD=CHANGEME_GENERATED_BY_BOOTSTRAP/POSTGRES_PASSWORD=$PG_PASS/g" \
        -e "s/MINIO_ROOT_PASSWORD=CHANGEME_GENERATED_BY_BOOTSTRAP/MINIO_ROOT_PASSWORD=$MINIO_PASS/g" \
        -e "s/JWT_SECRET=CHANGEME_GENERATED_BY_BOOTSTRAP/JWT_SECRET=$JWT_SEC/g" \
        -e "s/FILE_ENCRYPTION_KEY=CHANGEME_GENERATED_BY_BOOTSTRAP/FILE_ENCRYPTION_KEY=$ENC_KEY/g" \
        .env.example > .env.local
        
    echo -e "\033[1;32m.env.local generated successfully.\033[0m"
else
    echo -e "\033[1;32m.env.local already exists. Skipping secret generation.\033[0m"
fi
echo ""

# 3. Start Infrastructure
echo "Starting infrastructure services..."
docker compose --env-file .env.local up -d

echo ""
echo "Waiting for all containers to become healthy..."

CONTAINERS=("intellistore-db" "intellistore-minio" "intellistore-redis" "intellistore-qdrant" "intellistore-clamav" "intellistore-mailpit" "intellistore-backend" "intellistore-frontend" "intellistore-ai-service")
MAX_RETRIES=30
DELAY=5

for container in "${CONTAINERS[@]}"; do
    is_healthy=false
    for ((i=1; i<=MAX_RETRIES; i++)); do
        # Inspect health status, fallback to regular status if no healthcheck defined
        STATUS=$(docker inspect --format="{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" "$container" 2>/dev/null || echo "missing")
        
        if [ "$STATUS" = "healthy" ] || [ "$STATUS" = "running" ]; then
            echo -e "\033[1;32m[$container] is $STATUS.\033[0m"
            is_healthy=true
            break
        fi
        
        echo "Waiting for [$container]... (Attempt $i/$MAX_RETRIES) Status: $STATUS"
        sleep $DELAY
    done
    
    if [ "$is_healthy" = false ]; then
        echo -e "\033[1;31mError: Container [$container] failed to become healthy. Aborting setup.\033[0m"
        exit 1
    fi
done

echo ""
echo "=================================================="
echo -e "\033[1;32m Infrastructure Setup Complete!\033[0m"
echo "=================================================="
echo ""
