$ErrorActionPreference = "Stop"

if ($args.Count -eq 2) {
    $key = $args[0]
    $val = $args[1]
    [System.Environment]::SetEnvironmentVariable($key,$val,[System.EnvironmentVariableTarget]::User)
} else {
    Write-Error "Not enough args"
    exit(1)
}