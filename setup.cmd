@echo off

REM Set PM (Package Manager) to npm or yarn:
set PM=yarn

REM Set path the Ext JS framework(s):
set D=%EXTJS_HOME%
if not "%1"=="" set D=%1

if "%D%"=="" (
    echo:Specify path to Ext JS framework or set EXTJS_HOME
    echo:This folder can either be an extracted version of
    echo:Ext JS or a folder with many extracted versions.
    echo:
    echo:Example:
    echo:
    echo:   setup C:\Downloads\Sencha
    exit /B 1
)

echo:====================================================
echo:Installing Ext JS and preparing app

sencha workspace install -f %D%
echo:====================================================
echo:Installing Node packages

pushd app
call %PM% install
popd

call %PM% install

echo:====================================================
echo:Perform initial development build

sencha --cwd app app build --dev
