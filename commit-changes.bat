@echo off
echo ========================================
echo 🔄 COMMITTING CHANGES TO GIT REPOSITORIES
echo ========================================

echo.
echo 📂 FRONTEND PROJECT - https://github.com/CataUAM/FrontSismos.git
echo ========================================
cd frontend
echo 🔍 Checking frontend status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo ➕ Adding frontend changes...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo 💾 Committing frontend changes...
"C:\Program Files\Git\bin\git.exe" commit -m "feat: Replace polygon chart with line chart in seismic activity dashboard

- Replaced radar/polygon chart with temporal line chart visualization
- Added multi-sensor line tracking with color-coded sensors
- Implemented time-based X-axis (0-20 seconds) and acceleration Y-axis (0-0.03g)
- Enhanced chart with grid lines, axis labels, and legend
- Added getSensorColor method for consistent sensor identification
- Improved station filter functionality with real-time chart updates
- Fixed MatProgressSpinnerModule import for loading states
- Enhanced dashboard with better sensor count display and status indicators"

echo.
echo 🚀 Pushing frontend changes...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo 📂 BACKEND PROJECT - https://github.com/CataUAM/BackSismos.git
echo ========================================
cd ..\backend
echo 🔍 Checking backend status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo ➕ Adding backend changes...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo 💾 Committing backend changes...
"C:\Program Files\Git\bin\git.exe" commit -m "feat: Enhanced user-station association and role-based filtering

- Updated EstacionService with user-station filtering methods
- Enhanced authentication response to include assigned stations
- Added comprehensive DTOs for user management and station assignments
- Implemented UserEstacion entity for user-station relationships
- Created UserController with CRUD operations and role-based access
- Added repository layer for user-station associations
- Updated JwtResponse to include assignedStations field
- Improved role-based access control for station data"

echo.
echo 🚀 Pushing backend changes...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ✅ ALL CHANGES COMMITTED AND PUSHED SUCCESSFULLY!
echo Frontend: https://github.com/CataUAM/FrontSismos.git
echo Backend: https://github.com/CataUAM/BackSismos.git
echo ========================================
pause
