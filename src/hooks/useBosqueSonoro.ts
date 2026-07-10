"use client";

import { useEffect, useRef, useState } from "react";
import { BosqueSonoro } from "@/lib/audio/bosqueSonoro";

export function useBosqueSonoro() {
  const instancia = useRef<BosqueSonoro | null>(null);
  const [despierto, setDespierto] = useState(false);
  const [silenciado, setSilenciado] = useState(false);

  useEffect(() => {
    instancia.current = new BosqueSonoro();
    return () => {
      instancia.current?.detener();
    };
  }, []);

  function despertarBosque() {
    if (despierto) return;
    instancia.current?.despertar();
    setDespierto(true);
  }

  function alternarMute() {
    setSilenciado((valorPrevio) => {
      const nuevoValor = !valorPrevio;
      instancia.current?.alternarMute(nuevoValor);
      return nuevoValor;
    });
  }

  return { despierto, silenciado, despertarBosque, alternarMute };
}
