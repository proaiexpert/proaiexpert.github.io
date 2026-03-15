$ErrorActionPreference = "Stop"

function Get-Head {
  param(
    [string]$Lang,
    [string]$Title,
    [string]$Description,
    [string]$Canonical,
    [string]$AltEn,
    [string]$AltRu,
    [string]$Type = "website",
    [string]$Schema = ""
  )

  $xDefault = if ($Canonical -eq "https://proaiexpert.github.io/") {
    '<link rel="alternate" hreflang="x-default" href="https://proaiexpert.github.io/" />'
  } else {
    ""
  }

  @"
<!DOCTYPE html>
<html lang="$Lang">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>$Title</title>
  <meta name="description" content="$Description" />
  <link rel="canonical" href="$Canonical" />
  <link rel="alternate" hreflang="en" href="$AltEn" />
  <link rel="alternate" hreflang="ru" href="$AltRu" />
  $xDefault
  <meta property="og:site_name" content="ProAI Expert" />
  <meta property="og:type" content="$Type" />
  <meta property="og:title" content="$Title" />
  <meta property="og:description" content="$Description" />
  <meta property="og:url" content="$Canonical" />
  <meta property="og:image" content="https://proaiexpert.github.io/assets/logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="$Title" />
  <meta name="twitter:description" content="$Description" />
  <meta name="twitter:image" content="https://proaiexpert.github.io/assets/logo.png" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png" />
  <link rel="icon" href="/favicon-16.png" sizes="16x16" type="image/png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
  <meta name="theme-color" content="#11213C" />
  <link rel="stylesheet" href="/assets/css/site.css" />
  $Schema
</head>
<body class="page-shell">
"@
}

function Get-Labels {
  param([string]$Lang)

  if ($Lang -eq "ru") {
    return @{
      home = "Home"
      solutions = "Solutions"
      cases = "Cases"
      process = "Process"
      insights = "Insights"
      contact = "Contact"
      cta = "Request"
      tagline = "Systems studio"
      copy = "&copy; 2026 ProAI Expert."
    }
  }

  return @{
    home = "Home"
    solutions = "Solutions"
    cases = "Case Studies"
    process = "Process"
    insights = "Insights"
    contact = "Contact"
    cta = "Request an assessment"
    tagline = "Systems studio for AI and website infrastructure"
    copy = "&copy; 2026 ProAI Expert. All rights reserved."
  }
}

function Get-Paths {
  param([string]$Lang)

  $root = if ($Lang -eq "ru") { "/ru/" } else { "/" }

  return @{
    root = $root
    home = $root
    solutions = if ($Lang -eq "ru") { "/ru/solutions/" } else { "/solutions/" }
    cases = if ($Lang -eq "ru") { "/ru/case-studies/" } else { "/case-studies/" }
    process = if ($Lang -eq "ru") { "/ru/process/" } else { "/process/" }
    insights = if ($Lang -eq "ru") { "/ru/insights/" } else { "/insights/" }
    contact = if ($Lang -eq "ru") { "/ru/contact/" } else { "/contact/" }
    privacy = if ($Lang -eq "ru") { "/ru/privacy-policy.html" } else { "/privacy-policy.html" }
    terms = if ($Lang -eq "ru") { "/ru/terms-and-conditions.html" } else { "/terms-and-conditions.html" }
  }
}

function Get-Header {
  param(
    [string]$Lang,
    [string]$Active,
    [string]$EnHref,
    [string]$RuHref
  )

  $labels = Get-Labels -Lang $Lang
  $paths = Get-Paths -Lang $Lang
  $items = @("home", "solutions", "cases", "process", "insights", "contact") | ForEach-Object {
    $className = if ($_ -eq $Active) { "nav-link is-active" } else { "nav-link" }
    '<a class="{0}" href="{1}">{2}</a>' -f $className, $paths[$_], $labels[$_]
  }
  $enClass = if ($Lang -eq "en") { "lang-pill is-active" } else { "lang-pill" }
  $ruClass = if ($Lang -eq "ru") { "lang-pill is-active" } else { "lang-pill" }

  @"
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="$($paths.root)" aria-label="ProAI Expert">
      <img class="brand-logo" src="/assets/logo.png" alt="ProAI Expert" />
    </a>
    <nav class="nav" aria-label="Primary">
      $($items -join "`n      ")
    </nav>
    <div class="header-actions">
      <div class="lang-switch" aria-label="Language switch">
        <a class="$enClass" href="$EnHref">EN</a>
        <a class="$ruClass" href="$RuHref">RU</a>
      </div>
      <a class="button" href="$($paths.contact)">$($labels.cta)</a>
    </div>
  </div>
</header>
"@
}

function Get-Footer {
  param([string]$Lang)

  $labels = Get-Labels -Lang $Lang
  $paths = Get-Paths -Lang $Lang

  @"
<footer class="footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <img src="/assets/logo-white.png" alt="ProAI Expert" />
      <div>
        <div><strong>ProAI Expert</strong></div>
        <div class="footer-note">$($labels.tagline)</div>
      </div>
    </div>
    <div class="footer-right">
      <div class="footer-legal">
        <a href="$($paths.privacy)">Privacy Policy</a>
        <a href="$($paths.terms)">Terms &amp; Conditions</a>
      </div>
      <div class="footer-copy">$($labels.copy)</div>
    </div>
  </div>
</footer>
</body>
</html>
"@
}

function Write-Page {
  param(
    [string]$Path,
    [string]$Lang,
    [string]$Title,
    [string]$Description,
    [string]$Canonical,
    [string]$AltEn,
    [string]$AltRu,
    [string]$Active,
    [string]$Body,
    [string]$Type = "website",
    [string]$Schema = ""
  )

  $content = (
    Get-Head -Lang $Lang -Title $Title -Description $Description -Canonical $Canonical -AltEn $AltEn -AltRu $AltRu -Type $Type -Schema $Schema
  ) + (
    Get-Header -Lang $Lang -Active $Active -EnHref $AltEn -RuHref $AltRu
  ) + $Body + (
    Get-Footer -Lang $Lang
  )

  Set-Content -Path $Path -Value $content -Encoding utf8
}

function Write-Redirect {
  param(
    [string]$Path,
    [string]$Target,
    [string]$Title = "Redirecting"
  )

  $content = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0; url=$Target" />
  <link rel="canonical" href="$Target" />
  <meta name="robots" content="noindex,follow" />
  <title>$Title</title>
</head>
<body>
  <p>Redirecting to <a href="$Target">$Target</a>...</p>
</body>
</html>
"@

  Set-Content -Path $Path -Value $content -Encoding utf8
}
