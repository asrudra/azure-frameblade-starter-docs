@echo off
setlocal ENABLEDELAYEDEXPANSION
SET home=%~dp0
for /f %%A in ('dir /S /B "%home%..\coverage\*.html"') do (
    call juice "%%A" "%%A"
)