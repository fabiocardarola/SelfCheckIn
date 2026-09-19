# Richiesta 007 — Raggiungi l’appartamento

> Per il comportamento aggiornato di FreeNow e del percorso pedonale vedere [Richiesta 008](RICHIESTA_008.md).

La seconda tappa ora mostra prima l’indirizzo, selezionabile e copiabile, poi sei opzioni di trasporto. Tutti i messaggi sono disponibili nelle dieci lingue dell’app. La registrazione resta necessaria per accedere alla tappa. Il ritorno alla mappa non la completa; «Sono arrivato · continua» la completa e sblocca il portone. Aprire un servizio esterno non completa la tappa e non prenota una corsa.

## Configurazione della simulazione

`src/app/arrival/arrival-config.ts` contiene l’indirizzo, le coordinate, la partenza FCO, il numero di ospiti (4, condiviso con la registrazione), il telefono taxi, le tariffe demo e i flag `enabled` per appartamento. `ArrivalComponent` accetta `config` e `guestCount` come input per il futuro collegamento al backend.

- Taxi: 55 € e +39 06 3570 come richiesto; collegamento telefonico `tel:`. Il prezzo è quello della simulazione, non una tariffa verificata in tempo reale.
- NCC: esempio di 70 € complessivi fino a 4 persone e 95 € fino a 8. Il preventivo seleziona il veicolo più piccolo sufficiente per il gruppo; per gruppi non coperti compare «Preventivo su richiesta». Nessun operatore è collegato e nessuna prenotazione viene inviata.
- Uber: universal link `https://m.uber.com/ul/` secondo la guida fornita, con due pulsanti: da FCO (pickup precompilato) e dalla posizione attuale (pickup omesso, gestito da Uber). Entrambi trasmettono coordinate, nickname e indirizzo della destinazione.
- FreeNow: schema `freenow://m.freenow.com/integrate/trip` e parametri `dropoff_lat`, `dropoff_lng`, `dropoff_name` dalla guida fornita. La partenza è gestita tramite GPS nell’app, non fissata a FCO. Dopo 1,5 secondi, se la pagina resta visibile, viene aperto `https://freenow.com/`. Il timer viene annullato su `visibilitychange` verso hidden, `pagehide`, distruzione del componente o nuovo tentativo. È sempre disponibile anche un collegamento manuale al sito: il timer è un ripiego euristico, non un rilevatore certo dell’installazione dell’app.
- Mezzi pubblici e percorso pedonale: URL Google Maps distinti, da FCO alle coordinate dell’appartamento. Percorsi, orari e disponibilità sono determinati dal navigatore. Il percorso a piedi da FCO è segnalato come molto lungo.
- Impostando `enabled.<opzione>` a `false`, la card mostra lo stato non disponibile, senza link e con il pulsante disabilitato.

Le coordinate di simulazione sono quelle della guida fornita dall’utente: appartamento 41.9004, 12.4682; FCO 41.7999, 12.2462. Sono condivise fra tutti i collegamenti per mantenerne coerente la destinazione. La pagina non richiede la geolocalizzazione del turista: Uber e FreeNow gestiscono la posizione attuale e i relativi permessi nelle rispettive app.

La modifica richiesta riguarda Uber e FreeNow; le altre sezioni di esempio della guida (layout HTML autonomo, Apple Maps, gestionale NCC) non sono state adottate.

## Fonti consultate

- Guida fornita dall’utente: `/Users/fabiocardarola/Downloads/guida_implementazione_checkin.md` (schemi Uber/FreeNow e coordinate correnti).
- Le fonti web sotto documentano la prima versione; le coordinate Turismo Roma sono state sostituite dai valori della guida per questa simulazione.

- [Turismo Roma: Vicolo del Curato 12 e coordinate](https://www.turismoroma.it/en/hospitality/casa-e-appartamento-vacanze-curato-collection-suite-apartment-1)
- [Uber: Ride Request Deep Links](https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction)
- [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started)
- [FreeNow: pagina ufficiale app](https://www.free-now.com/ride/download-app/)
- [FreeNow: prenotazione delle corse](https://support.free-now.com/hc/en-gb/articles/360020681173-Booking-Managing-Your-Trip-request)

## Verifica

- `npm run build`: riuscita.
- `npm test -- --watch=false`: 14 test superati, inclusi parametri dei link, preventivi per capienza, opzioni disabilitate, dieci lingue, copia indirizzo e relativo fallback, avanzamento e ritorno alla mappa.
- Verifica visiva della versione iniziale (prima dell’aggiornamento dei deep link): browser locale: percorso dalla registrazione di un ospite fittizio alla seconda tappa e successivo sblocco della terza.
- Versione iniziale: controllo visivo a 390 × 844 e 320 × 568; nessuno scorrimento orizzontale a 320 px.
- Aggiornamento deep link: test dei due link Uber renderizzati, dei parametri FreeNow, del pulsante e dei casi di timeout, ritorno dall’app, navigazione, distruzione e tentativi ripetuti.
- Apertura effettiva delle app native Uber/FreeNow non verificata su dispositivi Android/iPhone fisici.
