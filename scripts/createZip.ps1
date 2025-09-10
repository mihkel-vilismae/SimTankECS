<# 
    SimTank packer
    - Prompts for a short summary
    - Converts it to camelCase
    - Creates a time-stamped zip of project files
#>

function Convert-ToCamelCase {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
        [string]$InputString
    )
    process {
        if ([string]::IsNullOrWhiteSpace($InputString)) { return "" }

        # Split on non-alphanumeric boundaries and drop empties
        $words = @($InputString -split '[^A-Za-z0-9]+' | Where-Object { $_ -ne "" })  # keep as array

        if ($words.Count -eq 0) { return "" }

        # First word lowercased; remaining words Capitalized
        $first = $words[0].ToLowerInvariant()
        $rest = @()
        if ($words.Count -gt 1) {
            $rest = $words[1..($words.Count - 1)] | ForEach-Object {
                if ($_.Length -gt 1) {
                    $_.Substring(0,1).ToUpperInvariant() + $_.Substring(1).ToLowerInvariant()
                } else {
                    $_.ToUpperInvariant()
                }
            }
        }

        return $first + ($rest -join '')
    }
}

# Returns the repository root when this script lives in ./scripts
function Get-RepoRoot {
    [CmdletBinding()]
    param()
    $scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
    return (Split-Path -Parent $scriptDir)
}

# Ask the user for a string
$userInput = Read-Host "provide one word summary and press ENTER"

# Convert input into camelCase (e.g., 'added projectiles' -> 'addedProjectiles')
$user_input_string = if ([string]::IsNullOrWhiteSpace($userInput)) { "" } else { Convert-ToCamelCase $userInput }   # ← change 1

# Get current datetime in dd-MM-yyyy_HH-mm format
$timestamp = Get-Date -Format "dd-MM-yyyy_HH-mm"

# Build zip filename (absolute) in root/logs and cd to repo root for resolution
$zipName = Join-Path (Join-Path (Get-RepoRoot) 'logs') "SimTank_${user_input_string}_${timestamp}.zip"; Set-Location (Get-RepoRoot)  # ← change 2

# Files/folders to include
$itemsToZip = @(
    "docs_instructions",
    "src",
    "tests",
    "scripts",
    ".gitignore",
    "index.html",
    "package.json",
    "README.md",
    "vitest.config.js"
)

# Resolve existing items (skip missing, warn)
$resolvedItems = @()
foreach ($item in $itemsToZip) {
    if (Test-Path -LiteralPath $item) {
        $resolvedItems += (Resolve-Path -LiteralPath $item)
    } else {
        Write-Warning "Skipping missing item: $item"
    }
}

if ($resolvedItems.Count -eq 0) {
    Write-Error "No files or folders to zip. Aborting."
    exit 1
}

# Create the zip
try {
    Compress-Archive -Path $resolvedItems -DestinationPath $zipName -Force
    Write-Host "Created archive: $(Join-Path (Get-Location) $zipName)"
} catch {
    Write-Error "Failed to create archive: $($_.Exception.Message)"
    exit 1
}
