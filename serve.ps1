param([int]$Port = 3458)
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving finn-formato at http://localhost:$Port/"
$mime = @{ '.html'=  'text/html; charset=utf-8'; '.css'='text/css'; '.js'='application/javascript'; '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.ico'='image/x-icon'; '.json'='application/json' }
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $p = $ctx.Request.Url.LocalPath
    if ($p -eq '/') { $p = '/index.html' }
    $file = Join-Path $root ($p.TrimStart('/').Replace('/', '\'))
    if (Test-Path $file -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $ctx.Response.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $ctx.Response.OutputStream.Write($body, 0, $body.Length)
    }
    $ctx.Response.OutputStream.Close()
}
