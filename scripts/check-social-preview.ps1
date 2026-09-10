param()

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$enImage = 'https://proai-expert.com/assets/social/proai-home-og-en-r1-1.png'
$ruImage = 'https://proai-expert.com/assets/social/proai-home-og-ru-r1-1.png'
$enAlt = 'ProAI Expert — From first impression to result — one system.'
$ruAlt = 'ProAI Expert — От первого впечатления до результата — одна система.'
$errors = New-Object System.Collections.Generic.List[string]

function Get-MetaContent([string]$html, [string]$attributeName, [string]$attributeValue) {
    $pattern = '<meta\b(?=[^>]*\b' + [regex]::Escape($attributeName) + '\s*=\s*["'']' + [regex]::Escape($attributeValue) + '["''])[^>]*\bcontent\s*=\s*["'']([^"'']*)["''][^>]*>'
    $match = [regex]::Match($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return $match.Groups[1].Value }

    $pattern = '<meta\b(?=[^>]*\bcontent\s*=\s*["'']([^"'']*)["''])[^>]*\b' + [regex]::Escape($attributeName) + '\s*=\s*["'']' + [regex]::Escape($attributeValue) + '["''][^>]*>'
    $match = [regex]::Match($html, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($match.Success) { return $match.Groups[1].Value }
    return ''
}

$files = Get-ChildItem -Path $root -Recurse -Filter *.html | Where-Object {
    $_.FullName -notmatch '\\.git\\' -and
    $_.FullName -notmatch '\\docs\\' -and
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\vendor\\'
}

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    if ($content -notmatch '</head>') { continue }

    $isRu = $file.FullName -match '\\ru\\' -or $content -match '<html\b[^>]*\blang\s*=\s*["'']ru(?:-[^"'']*)?["'']'
    $expectedImage = if ($isRu) { $ruImage } else { $enImage }
    $expectedAlt = if ($isRu) { $ruAlt } else { $enAlt }

    $ogImage = Get-MetaContent $content 'property' 'og:image'
    $twitterImage = Get-MetaContent $content 'name' 'twitter:image'
    $ogAlt = Get-MetaContent $content 'property' 'og:image:alt'

    if ($ogImage -ne $expectedImage) {
        $errors.Add("$($file.FullName): og:image mismatch -> $ogImage")
    }
    if ($twitterImage -ne $expectedImage) {
        $errors.Add("$($file.FullName): twitter:image mismatch -> $twitterImage")
    }
    if ($ogAlt -ne $expectedAlt) {
        $errors.Add("$($file.FullName): og:image:alt mismatch -> $ogAlt")
    }
    if ($content -match 'screenshots/proai-home-(?:en|ru)-desktop\.png') {
        $errors.Add("$($file.FullName): legacy homepage screenshot still used in social metadata")
    }
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output 'Social preview metadata check passed.'
