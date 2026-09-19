@echo off
setlocal EnableDelayedExpansion

REM ── Reabrir em terminal persistente ao dar duplo clique ──────────────────────
if /i "%1" NEQ "--ja-aberto" (
    cmd /k ""%~f0" --ja-aberto"
    exit /b
)

echo.
echo  ============================================
echo   Black - Enviar alteracoes para o GitHub
echo  ============================================
echo.

REM ════════════════════════════════════════════
REM  1. VERIFICA GIT
REM ════════════════════════════════════════════
where git >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Git nao encontrado.
    echo  Instale em: https://git-scm.com/download/win
    goto :fim
)

REM ════════════════════════════════════════════
REM  2. VERIFICA SE JA TEM REPOSITORIO GIT
REM ════════════════════════════════════════════
if not exist "%~dp0.git\" (
    echo [ERRO] Repositorio Git nao encontrado.
    echo  Execute primeiro o arquivo publicar.bat para configurar o repositorio.
    goto :fim
)

REM ════════════════════════════════════════════
REM  3. VERIFICA SE HA ALTERACOES
REM ════════════════════════════════════════════
cd /d "%~dp0"

git status --porcelain > "%TEMP%\bk_status.txt" 2>&1
set /p STATUS_LINHA=<"%TEMP%\bk_status.txt"

if "!STATUS_LINHA!"=="" (
    echo [OK] Nenhuma alteracao encontrada. O site ja esta atualizado.
    goto :fim
)

REM Mostra o que vai ser enviado
echo [INFO] Alteracoes encontradas:
echo.
git status --short
echo.

REM ════════════════════════════════════════════
REM  4. MENSAGEM DO COMMIT
REM ════════════════════════════════════════════
set /p MSG_COMMIT=  Descricao das alteracoes (Enter para usar mensagem automatica): 

if "!MSG_COMMIT!"=="" (
    for /f "tokens=2-4 delims=/ " %%a in ('date /t') do set DATA_HOJE=%%c-%%b-%%a
    for /f "tokens=1 delims= " %%a in ('time /t') do set HORA_AGORA=%%a
    set MSG_COMMIT=atualizacao !DATA_HOJE! !HORA_AGORA!
)

echo.

REM ════════════════════════════════════════════
REM  5. COMMIT E PUSH
REM ════════════════════════════════════════════
echo [INFO] Adicionando arquivos...
git add .

echo [INFO] Criando commit: "!MSG_COMMIT!"
git commit -m "!MSG_COMMIT!" >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Falha ao criar commit.
    goto :fim
)
echo [OK] Commit criado.

echo.
echo [INFO] Enviando para o GitHub...
git push
if errorlevel 1 (
    echo [ERRO] Falha ao enviar. Verifique sua conexao e se o repositorio esta configurado.
    echo  Dica: rode o publicar.bat novamente para reconfigurar.
    goto :fim
)

echo [OK] Alteracoes enviadas com sucesso!

REM ════════════════════════════════════════════
REM  6. RESULTADO FINAL
REM ════════════════════════════════════════════
echo.
echo  ============================================
echo   Site atualizado!
echo  ============================================
echo.

echo  O GitHub Pages vai atualizar em cerca de 1 minuto.
echo  Acesse github.com para acompanhar o deploy.

:fim
echo.
echo  Pressione qualquer tecla para fechar...
pause >nul
endlocal
