@echo off
chcp 65001 >nul
echo ============================================
echo   DBA5 班相册 - COS 批量上传工具
echo ============================================
echo.

set PYTHON="C:\Users\xlpeng\.workbuddy\binaries\python\envs\default\Scripts\python.exe"
set SCRIPT="C:\Users\xlpeng\WorkBuddy\2026-07-15-21-15-34\app\scripts\upload_to_cos.py"

if not exist "C:\Users\xlpeng\WorkBuddy\2026-07-15-21-15-34\photos" (
    echo [错误] 照片目录不存在！
    echo 请先将百度网盘的照片下载到:
    echo   C:\Users\xlpeng\WorkBuddy\2026-07-15-21-15-34\photos\
    echo.
    pause
    exit /b 1
)

echo 照片目录: C:\Users\xlpeng\WorkBuddy\2026-07-15-21-15-34\photos\
echo.
echo 正在扫描并上传照片...
echo.

%PYTHON% %SCRIPT%

echo.
echo ============================================
echo 上传完成！请回到 WorkBuddy 告知我，我会重新构建网站。
echo ============================================
pause
