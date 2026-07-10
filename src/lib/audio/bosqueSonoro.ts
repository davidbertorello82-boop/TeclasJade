// Placeholder de audio ambiente: no tenemos ningun archivo de sonido real
// todavia, asi que en vez de bajar uno de licencia dudosa de internet, lo
// sintetizamos en vivo con Web Audio API (ruido filtrado + un tono suave).
// Reemplazar por audio grabado/licenciado cuando este disponible.
export class BosqueSonoro {
  private contexto: AudioContext | null = null;
  private nodoGanancia: GainNode | null = null;
  private fuentes: AudioScheduledSourceNode[] = [];

  estaSonando(): boolean {
    return this.contexto !== null && this.contexto.state === "running";
  }

  /** Debe llamarse desde un gesto explicito del usuario (click). */
  despertar() {
    if (this.contexto) return;

    const contexto = new AudioContext();
    const ganancia = contexto.createGain();
    ganancia.gain.value = 0.18;
    ganancia.connect(contexto.destination);

    // "Viento entre las hojas": ruido blanco pasado por un filtro pasa-bajos
    // que se mece lentamente (LFO) para que no suene como estatica plana.
    const duracionBuffer = 4;
    const buffer = contexto.createBuffer(
      1,
      contexto.sampleRate * duracionBuffer,
      contexto.sampleRate,
    );
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < datos.length; i++) {
      datos[i] = Math.random() * 2 - 1;
    }

    const fuenteRuido = contexto.createBufferSource();
    fuenteRuido.buffer = buffer;
    fuenteRuido.loop = true;

    const filtroViento = contexto.createBiquadFilter();
    filtroViento.type = "lowpass";
    filtroViento.frequency.value = 500;

    const lfo = contexto.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGanancia = contexto.createGain();
    lfoGanancia.gain.value = 250;
    lfo.connect(lfoGanancia);
    lfoGanancia.connect(filtroViento.frequency);

    fuenteRuido.connect(filtroViento);
    filtroViento.connect(ganancia);

    // Un tono grave muy suave, como un fondo de "bosque despierto".
    const drone = contexto.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 110;
    const droneGanancia = contexto.createGain();
    droneGanancia.gain.value = 0.05;
    drone.connect(droneGanancia);
    droneGanancia.connect(ganancia);

    fuenteRuido.start();
    lfo.start();
    drone.start();

    this.contexto = contexto;
    this.nodoGanancia = ganancia;
    this.fuentes = [fuenteRuido, lfo, drone];
  }

  alternarMute(silenciado: boolean) {
    if (!this.nodoGanancia || !this.contexto) return;
    this.nodoGanancia.gain.setTargetAtTime(
      silenciado ? 0 : 0.18,
      this.contexto.currentTime,
      0.05,
    );
  }

  detener() {
    this.fuentes.forEach((fuente) => {
      try {
        fuente.stop();
      } catch {
        // ya estaba detenida
      }
    });
    this.fuentes = [];
    this.contexto?.close();
    this.contexto = null;
    this.nodoGanancia = null;
  }
}
