param([switch]$InitializePaused, [switch]$TestQuotas)
$ErrorActionPreference = 'Stop'
$names = @('UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','AI_ENABLED')
$saved = @{}
foreach ($name in $names) { $saved[$name] = [Environment]::GetEnvironmentVariable($name,'Process') }
try {
  foreach ($name in $names[0..1]) {
    $privateValue = Read-Host $name -AsSecureString
    $plainValue = [System.Net.NetworkCredential]::new('', $privateValue).Password
    [Environment]::SetEnvironmentVariable($name,$plainValue,'Process')
    $plainValue = $null
    $privateValue = $null
  }
  $env:AI_ENABLED = 'false'
  $arguments = @((Join-Path $PSScriptRoot 'diagnose-upstash.mjs'))
  if ($InitializePaused) { $arguments += '--init-paused' }
  if ($TestQuotas) { $arguments += '--test-quotas' }
  & node @arguments
  $diagnosticExit = $LASTEXITCODE
} finally {
  foreach ($name in $names) { [Environment]::SetEnvironmentVariable($name,$saved[$name],'Process') }
}
exit $diagnosticExit
