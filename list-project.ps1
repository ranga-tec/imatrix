param(
    [Parameter(Mandatory=$false)]
    [string]$Root = (Get-Location),

    [Parameter(Mandatory=$false)]
    [string]$Output = 'project-structure.txt',

    [Parameter(Mandatory=$false)]
    [string[]]$Exclude = @('.git', 'node_modules', '.cache', 'cache', 'data', '.data', 'tmp', 'temp')
)

function Get-RelativePath {
    param(
        [string]$FullPath,
        [string]$RootPath
    )

    $relative = $FullPath.Substring($RootPath.Length)
    if ($relative.StartsWith('\') -or $relative.StartsWith('/')) {
        $relative = $relative.Substring(1)
    }

    if ([string]::IsNullOrWhiteSpace($relative)) {
        return '.'
    }

    return $relative
}

function Test-IsExcluded {
    param(
        [string]$RelativePath,
        [System.Collections.Generic.HashSet[string]]$Excluded
    )

    if ([string]::IsNullOrWhiteSpace($RelativePath) -or $RelativePath -eq '.') {
        return $false
    }

    $segments = $RelativePath -split '[\\/]'
    foreach ($segment in $segments) {
        if ($Excluded.Contains($segment)) {
            return $true
        }
    }

    return $false
}

$resolvedRoot = Resolve-Path -LiteralPath $Root
$rootPath = $resolvedRoot.Path

$excludedSet = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::OrdinalIgnoreCase)
foreach ($value in $Exclude) {
    if (-not [string]::IsNullOrWhiteSpace($value)) {
        $excludedSet.Add($value.ToString()) | Out-Null
    }
}

$results = New-Object System.Collections.Generic.List[string]
$results.Add('.') | Out-Null

$stack = New-Object System.Collections.Stack
$stack.Push((Get-Item -LiteralPath $rootPath))

while ($stack.Count -gt 0) {
    $currentDir = $stack.Pop()
    $children = Get-ChildItem -LiteralPath $currentDir.FullName -Force -ErrorAction SilentlyContinue

    foreach ($child in $children) {
        $relative = Get-RelativePath -FullPath $child.FullName -RootPath $rootPath
        if (Test-IsExcluded -RelativePath $relative -Excluded $excludedSet) {
            continue
        }

        $results.Add($relative) | Out-Null

        if ($child.PSIsContainer) {
            $stack.Push($child)
        }
    }
}

$sorted = $results | Sort-Object -Unique
$sorted | Set-Content -LiteralPath $Output -Encoding ASCII
