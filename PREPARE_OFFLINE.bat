@echo off
setlocal
cd /d "%~dp0"
echo ====================================================
echo WorkMate Tools V1.7 - Prepare Offline SheetJS 0.20.3
echo ====================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='Stop';" ^
  "$url='https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';" ^
  "$out=Join-Path (Get-Location) 'vendor\xlsx.full.min.js';" ^
  "$tmp=$out+'.tmp';" ^
  "Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile $tmp;" ^
  "$hash=(Get-FileHash -Algorithm MD5 $tmp).Hash.ToLowerInvariant();" ^
  "if($hash -ne '6b3130af1ceadf07caa0ec08af7addff'){Remove-Item $tmp -Force; throw ('Checksum mismatch: '+$hash)};" ^
  "$len=(Get-Item $tmp).Length; if($len -lt 500000 -or $len -gt 2000000){Remove-Item $tmp -Force; throw ('Unexpected size: '+$len)};" ^
  "Move-Item -Force $tmp $out; Write-Host ('OK - SheetJS 0.20.3: '+$len+' bytes')"
if errorlevel 1 (
  echo.
  echo PREPARE FAILED. Check the network connection and try again.
  pause
  exit /b 1
)
echo.
echo PREPARE SUCCESS. WorkMate Tools can now use Excel tools offline.
pause
