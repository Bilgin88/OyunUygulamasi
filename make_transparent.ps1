Add-Type -AssemblyName System.Drawing
$dir = "c:\Repositories\React\OyunUygulamasi\public\images"
$files = Get-ChildItem -Path $dir -Filter "*.png"
foreach ($file in $files) {
    try {
        $path = $file.FullName
        $tempPath = "$path.tmp.png"
        $bitmap = New-Object System.Drawing.Bitmap($path)
        
        # We need a slightly more robust way to make transparent if the edges are anti-aliased,
        # but MakeTransparent() is the best built-in tool.
        $bitmap.MakeTransparent([System.Drawing.Color]::White)
        
        $bitmap.Save($tempPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
        
        Remove-Item -Path $path -Force
        Move-Item -Path $tempPath -Destination $path -Force
        Write-Host "Processed $path"
    } catch {
        Write-Host "Failed to process $file: $_"
    }
}
