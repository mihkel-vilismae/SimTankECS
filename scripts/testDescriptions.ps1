param(
  [string]$TestsDir = "tests"  # tests live at repoRoot/tests
)

# --- Helpers ---------------------------------------------------------------

function Get-RepoRoot {
  # $PSScriptRoot is where this script lives (./scripts)
  return (Split-Path -Parent $PSScriptRoot)
}

function Get-TestsPath {
  param([string]$testsDir)
  $repoRoot = Get-RepoRoot
  return (Join-Path $repoRoot $testsDir)
}

function Get-LogsFilePath {
  $repoRoot = Get-RepoRoot
  $logsDir  = Join-Path $repoRoot "logs"
  if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
  }
  return (Join-Path $logsDir "tests_summary.txt")
}

# Fallback relative-path for older PowerShell/.NET (no Path.GetRelativePath)
function Get-RelativePath {
  param([string]$basePath, [string]$fullPath)
  try {
    $baseUri = [System.Uri]((Resolve-Path -Path $basePath).Path)
    $fileUri = [System.Uri]((Resolve-Path -Path $fullPath).Path)
    $relUri  = $baseUri.MakeRelativeUri($fileUri)
    $relPath = [System.Uri]::UnescapeDataString($relUri.ToString())
    # Convert forward slashes to backslashes for Windows
    return ($relPath -replace '/', '\')
  } catch {
    # Fallback to filename if anything goes wrong
    return (Split-Path -Path $fullPath -Leaf)
  }
}

function Get-FileList {
  param([string]$basePath)
  $patterns = @("*.test.js","*.spec.js","*.test.ts","*.spec.ts")
  $files = @()
  foreach ($p in $patterns) {
    $files += Get-ChildItem -Path $basePath -Recurse -File -Filter $p -ErrorAction SilentlyContinue
  }
  return $files | Sort-Object FullName -Unique
}

# Remove /* ... */ block comments and // line comments
function Strip-Comments {
  param([string]$code)
  $noBlock = [System.Text.RegularExpressions.Regex]::Replace($code,"/\*[\s\S]*?\*/","")
  $noLine  = [System.Text.RegularExpressions.Regex]::Replace($noBlock,"(?m)^[\t ]*//.*$","")
  return $noLine
}

function Parse-TestFile {
  param([string]$content)
  $text = Strip-Comments $content

  # Handles "describe"/"suite" and "it"/"test" (and *.each(...))
  $describeRegex = [regex]'(?ms)(?<kw>\bdescribe\b|\bsuite\b)\s*\(\s*(?<q>["''`])(?<title>.*?)\k<q>\s*,'
  $itRegex       = [regex]'(?ms)(?<kw>\bit\b|\btest\b)\s*(?:\.each\s*\([^)]*\))?\s*\(\s*(?<q>["''`])(?<title>.*?)\k<q>\s*,'

  $describes = New-Object System.Collections.Generic.List[object]

  $dm = $describeRegex.Matches($text)
  foreach ($m in $dm) {
    $openIdx = $m.Index
    $pos = $text.IndexOf("(", $openIdx)
    if ($pos -lt 0) { continue }

    $depth = 0; $i = $pos; $endIdx = -1
    while ($i -lt $text.Length) {
      $ch = $text[$i]
      if ($ch -eq '(') { $depth++ }
      elseif ($ch -eq ')') {
        $depth--
        if ($depth -eq 0) { $endIdx = $i; break }
      }
      $i++
    }
    if ($endIdx -lt 0) { $endIdx = $text.Length - 1 }

    $describes.Add([PSCustomObject]@{
      Kind  = "describe"
      Title = $m.Groups['title'].Value.Trim()
      Start = $openIdx
      End   = $endIdx
    }) | Out-Null
  }

  $tests = New-Object System.Collections.Generic.List[object]
  $tm = $itRegex.Matches($text)
  foreach ($m in $tm) {
    $tests.Add([PSCustomObject]@{
      Kind  = "it"
      Title = $m.Groups['title'].Value.Trim()
      Pos   = $m.Index
    }) | Out-Null
  }

  return [PSCustomObject]@{ Describes=$describes; Tests=$tests }
}

function Get-DescribePath {
  param([object[]]$describes,[int]$pos)
  $containers = $describes | Where-Object { $_.Start -le $pos -and $pos -le $_.End }
  if (-not $containers -or $containers.Count -eq 0) { return @() }
  $ordered = $containers | Sort-Object @{Expression="Start";Ascending=$true}, @{Expression="End";Ascending=$false}
  return ($ordered | ForEach-Object { $_.Title } | Where-Object { $_ -and $_.Trim().Length -gt 0 })
}

function Format-Summary {
  param([string]$fileRelPath,[object]$parsed)
  $groups=@{}
  foreach ($t in $parsed.Tests) {
    $pathArr=Get-DescribePath -describes $parsed.Describes -pos $t.Pos
    $pathStr=if ($pathArr.Count -gt 0){($pathArr -join " > ")}else{"(top-level)"}
    if (-not $groups.ContainsKey($pathStr)) { $groups[$pathStr]=New-Object System.Collections.Generic.List[object] }
    $groups[$pathStr].Add($t)|Out-Null
  }

  $lines=New-Object System.Collections.Generic.List[string]
  $lines.Add("${fileRelPath}:")|Out-Null
  $orderedKeys=@()
  if ($groups.ContainsKey("(top-level)")) { $orderedKeys+="(top-level)" }
  $orderedKeys+=($groups.Keys|Where-Object {$_ -ne "(top-level)"}|Sort-Object)
  foreach ($k in $orderedKeys) {
    $lines.Add("  describe: `"$k`"")|Out-Null
    foreach ($t in $groups[$k]) {
      $lines.Add("    -> `"$($t.Title)`"")|Out-Null
    }
    $lines.Add("")|Out-Null
  }
  return ($lines -join "`n")
}

# --- Main ------------------------------------------------------------------

$testsPath = Get-TestsPath -testsDir $TestsDir
$outPath   = Get-LogsFilePath
$files     = Get-FileList -basePath $testsPath

if (-not $files -or $files.Count -eq 0) {
  Write-Host ("No test files found under '{0}'." -f $testsPath) -ForegroundColor Yellow
  while ($true) {
    $choice=Read-Host "PRESS [S] to save empty summary to $outPath, [Q] to exit"
    switch ($choice.ToUpper()) {
      'S' { ""|Out-File -FilePath $outPath -Encoding UTF8; Write-Host "Saved empty summary to: $outPath" -ForegroundColor Green; break }
      'Q' { exit 0 }  # <-- EXIT the script immediately
      default { Write-Host "Please press S or Q." -ForegroundColor Yellow }
    }
  }
  exit 0
}

$allOutput=New-Object System.Collections.Generic.List[string]
$repoRoot = Get-RepoRoot
foreach ($f in $files) {
  $content=Get-Content -Raw -Path $f.FullName
  $parsed=Parse-TestFile -content $content
  if ($parsed.Tests.Count -gt 0) {
    $relFromRoot = Get-RelativePath -basePath $repoRoot -fullPath $f.FullName
    $allOutput.Add((Format-Summary -fileRelPath $relFromRoot -parsed $parsed))|Out-Null
  }
}

$final=($allOutput -join "`n").TrimEnd()

if ([string]::IsNullOrWhiteSpace($final)) {
  Write-Host "No describes/tests found (after comment stripping)." -ForegroundColor Yellow
  $final=""
} else {
  Write-Host "================= TEST SUMMARY =================" -ForegroundColor Cyan
  Write-Output $final
  Write-Host "================================================" -ForegroundColor Cyan
}

while ($true) {
  $choice=Read-Host "PRESS [S] to save to $outPath  |  [Q] to exit"
  switch ($choice.ToUpper()) {
    'S' { $final|Out-File -FilePath $outPath -Encoding UTF8; Write-Host "Saved summary to: $outPath" -ForegroundColor Green; break }
    'Q' { exit 0 }  # <-- EXIT the script immediately
    default { Write-Host "Please press S or Q." -ForegroundColor Yellow }
  }
}
