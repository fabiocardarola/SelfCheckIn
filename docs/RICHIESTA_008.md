# Richiesta 008 — FreeNow e percorso a piedi

## FreeNow

Il vecchio pulsante tentava `freenow://m.freenow.com/integrate/trip`: uno schema personalizzato può essere rifiutato dal browser quando non esiste un gestore compatibile. Il timeout JavaScript non impediva la comparsa dell’errore. Inoltre il fallback puntava a `https://freenow.com/`, diverso dal dominio ufficiale `https://www.free-now.com/`; nella verifica HTTP il primo è andato in timeout. Non è stato possibile riprodurre l’errore su un telefono fisico.

Il pulsante ora è un normale link HTTPS a `https://m.free-now.com/JGMc`, pubblicato nella [pagina ufficiale italiana](https://www.free-now.com/it/). Il fornitore gestisce la destinazione del link in base al dispositivo; nella verifica web rimanda alla [pagina di download](https://www.free-now.com/ride/download-app/). Il link secondario apre il dominio ufficiale corretto. Rimosso il servizio RideLauncher con timer e i relativi test obsoleti.

Non sono stati trovati parametri ufficialmente documentati per precompilare la corsa tramite questo link. I testi nelle dieci lingue invitano quindi a copiare l’indirizzo già disponibile in alto, inserirlo come destinazione in FreeNow e confermare il punto di partenza. Il link può proporre il download dell’app: non si garantisce l’apertura nativa su ogni dispositivo.

## A piedi

Il link Google Maps conserva la destinazione configurata e `travelmode=walking`, ma omette `origin`. Secondo la [documentazione Google](https://developers.google.com/maps/documentation/urls/get-started#directions), Maps usa la posizione del dispositivo se disponibile e altrimenti permette di inserire la partenza. La geolocalizzazione e i permessi sono gestiti da Maps. I mezzi pubblici mantengono FCO come partenza.

Aggiornati descrizione del percorso e sottotitolo della schermata nelle dieci lingue.

## Verifiche

- `npm test -- --watch=false`: 11 test superati in 3 file; controllati link HTTPS FreeNow renderizzati, assenza di origine fissa per il percorso pedonale, destinazione, partenza FCO dei mezzi pubblici e opzioni disabilitate.
- `npm run build`: riuscita.
- Apertura delle app native e uso del GPS da verificare su dispositivi Android/iPhone fisici.

Questo aggiornamento sostituisce le indicazioni sui collegamenti FreeNow e sul percorso pedonale contenute nella Richiesta 007.
