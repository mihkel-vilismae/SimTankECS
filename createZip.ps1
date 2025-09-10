# Ask the user for a string
$userInput = Read-Host "provide one word summary and press ENTER"

# Convert input into camelCase (e.g., "added projectiles" -> "addedProjectiles")
# 1. Split into words
$words = $userInput -split '\s+'
# 2. Lowercase the first word, capitalize the first letter of the rest
$camelCase = ($words[0].ToLower()) + ($words[1..($words.Count - 1)] | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower() }) -join ''
$user_input_string = $camelCase

# Get current datetime in yyyyMMdd_HHmmss format
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Build zip filename
$zipName = "SimTank_${user_input_string}_${timestamp}.zip"

# Files/folders to include
$itemsToZip = @(
    "docs_instructions",
    "src",
    "tests",
    ".gitignore",
    "index.html",
    "package.json",
    "README.md",
    "vitest.config.js"
)

# Ensure the Compress-Archive cmdlet works by expanding relative paths
$resolvedItems = $itemsToZip | ForEach-Object { Resolve-Path $_ }

# Create the zip in current directory
Compress-Archive -Path $resolvedItems -DestinationPath $zipName -Force

Write-Host "Created archive: $zipName"
