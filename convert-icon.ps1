Add-Type -AssemblyName System.Drawing
$src = 'C:\Users\USER\.gemini\antigravity\brain\11dd2587-e62d-479c-9ea0-f4ac5794a1c1\.user_uploaded\media_1795455143889_3f7f1698.jpg'
$dst = 'C:\Users\USER\OneDrive\Desktop\Autotyper\public\icon.png'
$img = [System.Drawing.Image]::FromFile($src)
$img.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
$w = $img.Width
$h = $img.Height
$img.Dispose()
Write-Host "Saved PNG: $dst ($w x $h)"

# Also copy to src/assets/
$dst2 = 'C:\Users\USER\OneDrive\Desktop\Autotyper\src\assets\icon.png'
$img2 = [System.Drawing.Image]::FromFile($dst)
$img2.Save($dst2, [System.Drawing.Imaging.ImageFormat]::Png)
$img2.Dispose()
Write-Host "Copied to: $dst2"
