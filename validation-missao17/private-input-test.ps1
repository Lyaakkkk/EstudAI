$ErrorActionPreference='Stop'
$global:fakeReadCount=0
function global:Read-Host {
 param($Prompt,[switch]$AsSecureString)
 $global:fakeReadCount++
 if($global:fakeReadCount -eq 1){return ConvertTo-SecureString 'https://fake.upstash.io' -AsPlainText -Force}
 return ConvertTo-SecureString 'Aa_FAKE-123+/==.xyz' -AsPlainText -Force
}
function global:node {
 if($env:UPSTASH_REDIS_REST_URL -cne 'https://fake.upstash.io'){throw 'URL conversion failed'}
 if($env:UPSTASH_REDIS_REST_TOKEN -cne 'Aa_FAKE-123+/==.xyz'){throw 'Token conversion failed'}
 if($env:AI_ENABLED -cne 'false'){throw 'Pause guard failed'}
 Write-Output 'Private input conversion and child environment: PASS (fictional values only).'
 $global:LASTEXITCODE=0
}
$env:UPSTASH_REDIS_REST_TOKEN='FAKE_PREVIOUS'
& (Join-Path $PSScriptRoot '../scripts/diagnose-upstash.ps1')
if($env:UPSTASH_REDIS_REST_TOKEN -cne 'FAKE_PREVIOUS'){throw 'Environment restoration failed'}
Write-Output 'Environment restoration: PASS.'
