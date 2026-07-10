"use client";

import { useBosqueSonoro } from "@/hooks/useBosqueSonoro";
import { Hero } from "@/components/home/Hero";
import { Bio } from "@/components/home/Bio";
import { DescripcionPlataforma } from "@/components/home/DescripcionPlataforma";
import { ClaroDeLosTroncos } from "@/components/home/ClaroDeLosTroncos";
import { CierreComercial } from "@/components/home/CierreComercial";
import { Contacto } from "@/components/home/Contacto";
import { BotonMuteFlotante } from "@/components/home/BotonMuteFlotante";

export default function Home() {
  const { despierto, silenciado, despertarBosque, alternarMute } =
    useBosqueSonoro();

  return (
    <div className="flex-1 bg-lino">
      <Hero despierto={despierto} onDespertar={despertarBosque} />
      <Bio />
      <DescripcionPlataforma />
      <ClaroDeLosTroncos />
      <CierreComercial />
      <Contacto />
      <BotonMuteFlotante silenciado={silenciado} onAlternar={alternarMute} />
    </div>
  );
}
