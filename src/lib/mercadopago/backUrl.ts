// Mercado Pago exige HTTPS para back_url desde 03/2025 - rechaza cualquier
// URL http:// (incluido localhost) con "Invalid value for back url".
// En desarrollo no tenemos una URL https real todavia (llega recien con el
// deploy de la Fase 8, o con un tunel tipo ngrok), asi que devolvemos un
// placeholder https solo para que la llamada a la API no falle. Nadie
// termina de verdad en esa URL durante pruebas locales - el "back_url" real
// solo importa cuando alguien completa el checkout en un navegador.
export function urlDeVueltaMercadoPago(ruta: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const esLocal = base.startsWith("http://localhost");
  const urlBase = esLocal ? "https://teclasjade.com" : base;
  return `${urlBase}${ruta}`;
}
