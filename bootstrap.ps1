<#
.SYNOPSIS
Bootstrap script for IntelliStore AI infrastructure and application setup.
#>

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "    IntelliStore AI - Automated Setup Wizard      " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check prerequisites
Write-Host "Checking prerequisites..."
if (Test-Path "C:\Program Files\Docker\Docker\resources\bin") {
    if ($env:Path -notlike "*C:\Program Files\Docker\Docker\resources\bin*") {
        $env:Path = "C:\Program Files\Docker\Docker\resources\bin;$env:Path"
    }
}
$deps = @("docker")
foreach ($dep in $deps) {
    if (-not (Get-Command $dep -ErrorAction SilentlyContinue)) {
        Write-Error "Error: $dep is required but not installed. Aborting."
        exit 1
    }
}
Write-Host "Prerequisites OK." -ForegroundColor Green
Write-Host ""

# 2. Generate secure secrets
Write-Host "Checking for .env.local..."
if (-not (Test-Path ".env.local")) {
    Write-Host "Generating .env.local with secure random secrets..." -ForegroundColor Yellow
    
    function Get-RandomBase64 ($length=32) {
        $bytes = New-Object Byte[] $length
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        $rng.GetBytes($bytes)
        return [Convert]::ToBase64String($bytes)
    }

    $pgPass = Get-RandomBase64 24
    $minioPass = Get-RandomBase64 32
    $jwtSecret = Get-RandomBase64 64
    $encKey = Get-RandomBase64 32

    $envTemplate = Get-Content ".env.example" -Raw
    $envTemplate = $envTemplate -replace "POSTGRES_PASSWORD=CHANGEME_GENERATED_BY_BOOTSTRAP", "POSTGRES_PASSWORD=$pgPass"
    $envTemplate = $envTemplate -replace "MINIO_ROOT_PASSWORD=CHANGEME_GENERATED_BY_BOOTSTRAP", "MINIO_ROOT_PASSWORD=$minioPass"
    $envTemplate = $envTemplate -replace "JWT_SECRET=CHANGEME_GENERATED_BY_BOOTSTRAP", "JWT_SECRET=$jwtSecret"
    $envTemplate = $envTemplate -replace "FILE_ENCRYPTION_KEY=CHANGEME_GENERATED_BY_BOOTSTRAP", "FILE_ENCRYPTION_KEY=$encKey"
    
    Set-Content -Path ".env.local" -Value $envTemplate
    Write-Host ".env.local generated successfully." -ForegroundColor Green
} else {
    Write-Host ".env.local already exists. Skipping secret generation." -ForegroundColor Green
}
Write-Host ""

# 3. Start Infrastructure
Write-Host "Starting infrastructure services..."
docker compose --env-file .env.local up -d

Write-Host ""
Write-Host "Waiting for all containers to become healthy..."

$containers = @("intellistore-db", "intellistore-minio", "intellistore-redis", "intellistore-qdrant", "intellistore-clamav", "intellistore-mailpit", "intellistore-backend", "intellistore-frontend", "intellistore-ai-service")
$maxRetries = 30
$delaySeconds = 5

foreach ($container in $containers) {
    $isHealthy = $false
    for ($i = 1; $i -le $maxRetries; $i++) {
        $status = docker inspect --format="{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}" $container 2>$null
        
        if ($status -eq "healthy" -or $status -eq "running") {
            Write-Host "[$container] is healthy." -ForegroundColor Green
            $isHealthy = $true
            break
        }
        
        Write-Host "Waiting for [$container]... (Attempt $i/$maxRetries) Status: $status"
        Start-Sleep -Seconds $delaySeconds
    }
    
    if (-not $isHealthy) {
        Write-Error "Container [$container] failed to become healthy. Aborting setup."
        exit 1
    }
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host " Infrastructure Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
