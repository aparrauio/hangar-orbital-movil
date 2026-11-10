const fs = require("fs");
const path = require("path");

const EXTENSIONES = new Set([".ts", ".tsx", ".js", ".json"]);
const RAIZ_PROYECTO =
  process.env.CLAUDE_PROJECT_DIR || path.resolve(__dirname, "..", "..");

async function leerEntrada() {
  let texto = "";
  process.stdin.setEncoding("utf8");
  for await (const fragmento of process.stdin) {
    texto += fragmento;
  }
  return texto;
}

async function main() {
  const entrada = JSON.parse(await leerEntrada());
  const archivo = entrada.tool_input.file_path;

  if (!EXTENSIONES.has(path.extname(archivo).toLowerCase())) {
    return;
  }

  const prettier = require(
    require.resolve("prettier", { paths: [RAIZ_PROYECTO] }),
  );
  const original = fs.readFileSync(archivo, "utf8");
  const configuracion = await prettier.resolveConfig(archivo);
  const formateado = await prettier.format(original, {
    ...configuracion,
    filepath: archivo,
  });

  if (formateado !== original) {
    fs.writeFileSync(archivo, formateado);
  }
}

main()
  .catch(() => {})
  .finally(() => {
    process.exitCode = 0;
  });
