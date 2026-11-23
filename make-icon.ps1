Add-Type -AssemblyName System.Drawing

$srcPng = 'C:\Users\USER\OneDrive\Desktop\Autotyper\public\icon.png'
$dstIco = 'C:\Users\USER\OneDrive\Desktop\Autotyper\public\icon.ico'

# Sizes to embed in the ICO (standard Windows icon sizes)
$sizes = @(16, 32, 48, 64, 128, 256)

# Render each size as a PNG byte array
$pngChunks = @()
foreach ($size in $sizes) {
    $src = [System.Drawing.Image]::FromFile($srcPng)
    $bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, 0, 0, $size, $size)
    $g.Dispose()
    $src.Dispose()

    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $pngChunks += ,($ms.ToArray())
    $ms.Dispose()
}

# Build ICO binary
# ICO header: 6 bytes  (reserved=0, type=1, count=N)
# ICO directory: 16 bytes per image
# Then image data blobs

$count = $sizes.Count
$headerSize = 6
$dirSize = 16 * $count
$dataOffset = $headerSize + $dirSize

$ms = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($ms)

# ICO header
$bw.Write([uint16]0)       # reserved
$bw.Write([uint16]1)       # type: 1 = ICO
$bw.Write([uint16]$count)  # number of images

# Directory entries — calculate offsets
$offset = $dataOffset
for ($i = 0; $i -lt $count; $i++) {
    $sz = $sizes[$i]
    $w  = if ($sz -ge 256) { 0 } else { [byte]$sz }   # 0 means 256
    $h  = if ($sz -ge 256) { 0 } else { [byte]$sz }
    $bw.Write([byte]$w)           # width
    $bw.Write([byte]$h)           # height
    $bw.Write([byte]0)            # color count (0 = more than 256)
    $bw.Write([byte]0)            # reserved
    $bw.Write([uint16]1)          # color planes
    $bw.Write([uint16]32)         # bits per pixel
    $bw.Write([uint32]($pngChunks[$i].Length))  # size of image data
    $bw.Write([uint32]$offset)    # offset to image data
    $offset += $pngChunks[$i].Length
}

# Image data blobs
foreach ($chunk in $pngChunks) {
    $bw.Write($chunk)
}

$bw.Flush()
[System.IO.File]::WriteAllBytes($dstIco, $ms.ToArray())
$ms.Dispose()

Write-Host "Created ICO: $dstIco ($($sizes -join ', ')px)"
