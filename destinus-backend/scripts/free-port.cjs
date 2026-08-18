// Libera a porta 3333 antes de subir o servidor, caso tenha ficado algum
// processo "preso" de uma execução anterior (ex: fechou a janela do
// PowerShell no X e o node.exe continuou rodando em segundo plano).
//
// No Windows, fechar a janela do terminal (PowerShell/cmd) nem sempre mata
// TODOS os processos filhos — "npm run dev" no Windows na real roda uma
// cadeia de processos (PowerShell -> npm -> node -> tsx), e o Windows
// Console Host às vezes não repassa o sinal de fechamento até o processo
// mais interno. Isso é uma limitação do terminal, não do código do app —
// então, em vez de depender só do botão X, este script garante que a
// porta esteja livre TODA vez que você iniciar o servidor de novo.
const { execSync } = require("node:child_process");

const PORT = 3333;

function freePortWindows() {
  try {
    const out = execSync(`netstat -ano | findstr :${PORT}`, { encoding: "utf-8" });
    const pids = new Set();
    out.split("\n").forEach((line) => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
    });
    pids.forEach((pid) => {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`⚠️  Encerrei um processo antigo (PID ${pid}) que ainda estava usando a porta ${PORT}.`);
      } catch {
        // já não existe mais / sem permissão — ignora
      }
    });
  } catch {
    // findstr não encontrou nada = porta já está livre, tudo certo
  }
}

function freePortUnix() {
  try {
    const out = execSync(`lsof -ti tcp:${PORT}`, { encoding: "utf-8" }).trim();
    if (!out) return;
    out.split("\n").forEach((pid) => {
      if (!pid) return;
      try {
        execSync(`kill -9 ${pid}`, { stdio: "ignore" });
        console.log(`⚠️  Encerrei um processo antigo (PID ${pid}) que ainda estava usando a porta ${PORT}.`);
      } catch {
        // ignora
      }
    });
  } catch {
    // lsof não encontrou nada = porta já está livre
  }
}

if (process.platform === "win32") {
  freePortWindows();
} else {
  freePortUnix();
}
