# Script to add PayPal env vars to Vercel preview
# Usage: .\.vercel-add-env.ps1

$clientId = "BAA2bOFTntlMzJ-CLVxsqubJSd7cxqHqWqS_NORTP27fmFX1yY1K3MOSrTH6B90SCHyLzf5LRmgPVtWsPA"
$secret = "EBgOXN_lsuHCfp8AGC19ItrynkxnGSjK3_RPhnroi22ZHSeWUG0VGjpig93AEE9_TAqDY-mWHeo-NoD8"

function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment = "preview"
    )
    
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo.FileName = "vercel"
    $process.StartInfo.Arguments = "env add $Name $Environment"
    $process.StartInfo.UseShellExecute = $false
    $process.StartInfo.RedirectStandardInput = $true
    $process.StartInfo.RedirectStandardOutput = $true
    $process.StartInfo.RedirectStandardError = $true
    $process.StartInfo.CreateNoWindow = $true
    
    $process.Start() | Out-Null
    
    # Send value followed by Enter, then empty string (for git branch) + Enter
    $process.StandardInput.WriteLine($Value)
    $process.StandardInput.WriteLine("")
    $process.StandardInput.Close()
    
    $output = $process.StandardOutput.ReadToEnd()
    $error = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    
    Write-Host "=== $Name ==="
    if ($output) { Write-Host $output }
    if ($error) { Write-Host $error }
    Write-Host "Exit code: $($process.ExitCode)"
}

Add-VercelEnv -Name "PAYPAL_CLIENT_ID" -Value $clientId
Add-VercelEnv -Name "PAYPAL_CLIENT_SECRET" -Value $secret
Add-VercelEnv -Name "NEXT_PUBLIC_PAYPAL_CLIENT_ID" -Value $clientId
