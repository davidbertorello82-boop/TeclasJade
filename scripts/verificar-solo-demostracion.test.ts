// Pruebas de la guarda de solo demostración (ADN-UI-1). El descubrimiento es
// DINÁMICO (todo src/, sin lista fija); los negativos usan raíces sintéticas
// en el directorio temporal del sistema. Este archivo vive en scripts/ (fuera
// del área escaneada) y por eso puede nombrar los tokens prohibidos.
// Uso: tsx scripts/verificar-solo-demostracion.test.ts

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { verificarSoloDemostracion } from "./verificar-solo-demostracion";

let total = 0;
let fallos = 0;
function caso(nombre: string, condicion: boolean, detalle = "") {
  total++;
  if (condicion) {
    console.log(`PASA   ${nombre}`);
  } else {
    fallos++;
    console.log(`FALLA  ${nombre}${detalle ? ` — ${detalle}` : ""}`);
  }
}

const temporales: string[] = [];
function raizCon(nombreArchivo: string, contenido: string): string {
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), "solo-demo-"));
  temporales.push(raiz);
  fs.writeFileSync(path.join(raiz, nombreArchivo), contenido);
  return raiz;
}
function limpiar() {
  for (const t of temporales) fs.rmSync(t, { recursive: true, force: true });
}

try {
  {
    const r = verificarSoloDemostracion();
    caso("S1: todo src/ productivo está limpio (descubrimiento dinámico > 0)", r.ok && r.modulos > 0, `modulos=${r.modulos} ${r.errores.join(" | ")}`);
  }
  const familias: Array<[string, string]> = [
    ["getUserMedia", "navigator.mediaDevices.getUserMedia({ audio: true });"],
    ["MediaRecorder", "const g = new MediaRecorder(stream);"],
    ["requestMIDIAccess", "navigator.requestMIDIAccess();"],
    ["SpeechRecognition", "const r = new SpeechRecognition();"],
    ["getDisplayMedia", "navigator.mediaDevices.getDisplayMedia();"],
    ["createMediaStreamSource", "ctx.createMediaStreamSource(stream);"],
    ["scoring", "const scoring = compararConReferencia(alumno);"],
  ];
  for (const [token, linea] of familias) {
    const raiz = raizCon("mod.ts", `export function f() {\n  ${linea}\n}\n`);
    const r = verificarSoloDemostracion(raiz);
    caso(`S: token "${token}" detectado → build bloqueado`, !r.ok && r.errores.length > 0, r.errores.join(" | "));
  }
  {
    const raiz = raizCon("mod.test.ts", "navigator.mediaDevices.getUserMedia({ audio: true });\n");
    fs.writeFileSync(path.join(raiz, "limpio.ts"), "export const x = 1;\n");
    const r = verificarSoloDemostracion(raiz);
    caso("S9: los *.test.ts quedan excluidos del escaneo", r.ok && r.modulos === 1, r.errores.join(" | "));
  }
  {
    const raiz = raizCon("mod.ts", "export const a = 1;\nexport const b = 2;\nnavigator.requestMIDIAccess();\n");
    const r = verificarSoloDemostracion(raiz);
    caso("S10: el reporte incluye archivo:línea exactos", !r.ok && r.errores.some((e) => /mod\.ts:3/.test(e)), r.errores.join(" | "));
  }
} finally {
  limpiar();
}

console.log("");
console.log(`Casos: ${total} — fallos: ${fallos}`);
process.exit(fallos === 0 ? 0 : 1);
