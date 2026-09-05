@echo off
setlocal EnableDelayedExpansion

if /i "%1" NEQ "--ja-aberto" (
    cmd /k ""%~f0" --ja-aberto"
    exit /b
)

echo.
echo  ============================================
echo   ANTI GOVERNO - Configurar sistema de keys
echo  ============================================
echo.
echo  Siga os passos abaixo para criar o banco de dados GRATIS:
echo.
echo  PASSO 1 - Acesse: https://console.firebase.google.com
echo  PASSO 2 - Clique em "Criar um projeto"
echo  PASSO 3 - Nome do projeto: anti-governo
echo  PASSO 4 - Desative o Google Analytics e clique em "Criar projeto"
echo  PASSO 5 - No menu lateral clique em "Firestore Database"
echo  PASSO 6 - Clique em "Criar banco de dados"
echo  PASSO 7 - Selecione "Iniciar no modo de teste" e clique em "Avancar"
echo  PASSO 8 - Escolha a regiao "us-east1" e clique em "Ativar"
echo  PASSO 9 - Clique na engrenagem (Configuracoes do projeto)
echo  PASSO 10 - Em "Seus apps" clique no icone ^<^/^> (Web)
echo  PASSO 11 - Coloque o nome "anti-governo" e clique em "Registrar app"
echo  PASSO 12 - Copie os dados que aparecerem
echo.
echo  ============================================
echo.

set /p API_KEY=  Cole o apiKey (ex: AIzaSyXXXXXX): 
if "!API_KEY!"=="" ( echo [ERRO] apiKey nao informado. & goto :fim )

set /p PROJECT_ID=  Cole o projectId (ex: anti-governo-12345): 
if "!PROJECT_ID!"=="" ( echo [ERRO] projectId nao informado. & goto :fim )

set /p APP_ID=  Cole o appId (ex: 1:123456:web:abcdef): 
if "!APP_ID!"=="" ( echo [ERRO] appId nao informado. & goto :fim )

echo.
echo  Agora defina uma senha para o painel admin:
set /p SENHA_ADMIN=  Senha do painel admin: 
if "!SENHA_ADMIN!"=="" ( echo [ERRO] Senha nao informada. & goto :fim )

echo.
echo [INFO] Gerando arquivos...

node "%~dp0configurar-firebase.js" "!API_KEY!" "!PROJECT_ID!" "!APP_ID!" "!SENHA_ADMIN!" > "%TEMP%\firebase_result.txt" 2>&1
set /p RESULT=<"%TEMP%\firebase_result.txt"

if "!RESULT!"=="OK" (
    echo [OK] Arquivos gerados com sucesso!
) else (
    echo [ERRO] !RESULT!
    goto :fim
)

echo.
echo [INFO] Enviando para o GitHub...
cd /d "%~dp0"
git add -A
git commit -m "feat: sistema de keys com Firebase" >nul 2>&1
git push
if errorlevel 1 (
    echo [ERRO] Falha ao enviar. Rode o publicar.bat primeiro.
    goto :fim
)

echo.
echo  ============================================
echo   Tudo pronto!
echo  ============================================
echo.
echo  Site principal  : https://vaguinhoraquel2019-art.github.io/black/
echo  Painel admin    : https://vaguinhoraquel2019-art.github.io/black/admin/
echo.
echo  No painel admin voce cria as keys de 1, 3, 5, 7 e 15 dias.
echo  A pessoa acessa o site e digita a key para entrar.
echo.

:fim
echo.
echo  Pressione qualquer tecla para fechar...
pause >nul
endlocal
