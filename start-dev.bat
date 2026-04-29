@echo off
REM Script chay dong thoi Backend va Frontend
REM Batch Script cho Windows

echo ==================================
echo   ART GALLERY - Development Mode
echo ==================================
echo.

REM Kiem tra thu muc
if not exist "DoAn3_BackEnd" (
    echo ERROR: Khong tim thay thu muc DoAn3_BackEnd!
    echo Vui long chay script tu thu muc goc cua du an.
    pause
    exit /b 1
)

if not exist "art-gallery-react" (
    echo ERROR: Khong tim thay thu muc art-gallery-react!
    echo Vui long chay script tu thu muc goc cua du an.
    pause
    exit /b 1
)

echo [1/2] Dang khoi dong Backend (ASP.NET Core)...
echo       URL: http://localhost:5273
echo.

REM Chay Backend trong cua so moi
start "BACKEND - ASP.NET Core" cmd /k "cd DoAn3_BackEnd\DoAn2_BackEnd && color 0A && echo BACKEND SERVER && dotnet run"

REM Doi 8 giay de backend khoi dong
timeout /t 8 /nobreak > nul

echo [2/2] Dang khoi dong Frontend (React)...
echo       URL: http://localhost:3000
echo.

REM Chay Frontend trong cua so moi
start "FRONTEND - React" cmd /k "cd art-gallery-react && color 0B && echo FRONTEND SERVER && npm start"

echo.
echo ==================================
echo   Servers dang chay!
echo ==================================
echo.
echo Backend:  http://localhost:5273
echo Frontend: http://localhost:3000
echo.
echo Dong cac cua so terminal de dung servers.
echo.
pause
