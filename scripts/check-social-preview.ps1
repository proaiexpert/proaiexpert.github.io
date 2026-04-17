param()

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$enImage = 'https://proai-expert.com/screenshots/proai-home-en-desktop.png'
$ruImage = 'https://proai-expert.com/screenshots/proai-home-ru-desktop.png'
$enAlt = 'ProAI Expert homepage preview'
$errors = New-Object System.Collections.Generic.List[string]

$files = Get-ChildItem -Path $root -Recurse -Filter *.html | Where-Object {
    $_.FullName -notmatch '\\.git\\'
}

foreach ($file in $files) {
    $content = Get-Content -LiteralPath $file.FullName -Raw
    if ($content -notmatch 'property="og:image"' -and $content -notmatch 'name="twitter:image"' -and $content -notmatch 'property="og:image:alt"') {
        continue
    }

    $isRu = $file.FullName -match '\\ru\\'
    $expectedImage = if ($isRu) { $ruImage } else { $enImage }
    $ogImage = [regex]::Match($content, '<meta\s+content="([^"]*)"\s+property="og:image"\s*/?>').Groups[1].Value
    $twitterImage = [regex]::Match($content, '<meta\s+content="([^"]*)"\s+name="twitter:image"\s*/?>').Groups[1].Value
    $ogAlt = [regex]::Match($content, '<meta\s+content="([^"]*)"\s+property="og:image:alt"\s*/?>').Groups[1].Value

    if ($ogImage -ne $expectedImage) {
        $errors.Add("$($file.FullName): og:image mismatch -> $ogImage")
    }
    if ($twitterImage -ne $expectedImage) {
        $errors.Add("$($file.FullName): twitter:image mismatch -> $twitterImage")
    }
    if (-not $isRu -and $ogAlt -ne $enAlt) {
        $errors.Add("$($file.FullName): og:image:alt mismatch -> $ogAlt")
    }
    if ($isRu -and ([string]::IsNullOrWhiteSpace($ogAlt) -or $ogAlt -notmatch 'ProAI Expert')) {
        $errors.Add("$($file.FullName): ru og:image:alt missing or malformed -> $ogAlt")
    }
    if ($ogImage -match 'case-financial-desktop\.webp' -or $twitterImage -match 'case-financial-desktop\.webp') {
        $errors.Add("$($file.FullName): legacy client preview still used in social meta")
    }
}

if ($errors.Count -gt 0) {
    $errors | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output 'Social preview metadata check passed.'
