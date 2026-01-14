# PowerShell script to update remaining HTML files with components.js

$files = @("contact.html", "services.html", "team.html", "gallary.html", "index-2.html")
$root = "c:\Users\VeerITians\Desktop\online_projects\sonurli-gaon"

foreach ($file in $files) {
    $path = Join-Path $root $file
    Write-Host "Processing: $file"
    
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding UTF8
        
        # Replace old CDN link with proper CDN
        $content = $content -replace '\.\./\.\./cdnjs\.cloudflare\.com/', 'https://cdnjs.cloudflare.com/'
        
        # Replace विहिरगाव with सोनुर्ली
        $content = $content -replace 'विहिरगाव', 'सोनुर्ली'
        $content = $content -replace 'Vihirgaon', 'Sonurli'        
        # Remove old header/footer loading scripts
        $content = $content -replace '(?s)<script>[\s\r\n]*//\s*footer\.html.*?</script>[\s\r\n]*<script>[\s\r\n]*//\s*JavaScript.*?header\.html.*?</script>', ''
        
        # Add components.js if not already present
        if ($content -notmatch 'components\.js') {
            $content = $content -replace '(<script src="js/custom\.js"></script>)', '$1`r`n<script src="js/components.js"></script>'
        }
        
        # Save the file
        $content | Set-Content $path -Encoding UTF8 -NoNewline
        Write-Host "  ✓ Updated: $file"
    }
    else {
        Write-Host "  ✗ File not found: $file"
    }
}

Write-Host "`nAll files processed!"
