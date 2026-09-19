# RICHIESTA 010 — prenotazione reale e sessione ospite

## Avvio locale

1. Backend hhapi su `http://localhost:9090/hhapi/`.
2. `npm start` in SelfCheckIn. Il proxy Angular inoltra `/hhapi/**` alla porta 9090.
3. Aprire `http://localhost:4200/?id=0&key=HMEP2N3KZ8`.

`key` contiene il PNR; `id` non viene usato per identificare la prenotazione.
Senza key o con un codice sconosciuto appare esattamente `BAD BOOKING CODE !`.
Un errore di rete/server mostra invece un messaggio temporaneo con pulsante Riprova.

Il frontend usa nome, date, numero ospiti, lingua, indirizzo e coordinate reali.
La lingua restituita è preselezionata ed è modificabile; lingue non supportate ricadono sull'italiano.
Le bozze dei documenti rimangono in sessionStorage, separate per fkbooking e PNR:
la loro registrazione sul backend sarà implementata nella prossima richiesta.
I preventivi NCC e le altre configurazioni di trasporto restano dimostrativi; indirizzo e coordinate
provengono invece dall'appartamento della prenotazione. In assenza di coordinate valide,
i collegamenti che richiedono coordinate sono disabilitati.

## Backend e database

Sorgenti: `hhapi/src/java/product/hhapi/Stub_sci*.java`, `Method_sci*.java`, `SciAccess.java`.
Gli stub mantengono DirectMapping/MethodGeneric del framework esistente. La selezione del database
avviene sul server con la configurazione hhapi già presente; nessuna API key amministrativa
né credenziale MySQL viene inviata al browser.

La migrazione `hhapi/docs/sql/010_sci_guest_access.sql` è idempotente ed è stata applicata al MySQL locale.
Per altri ambienti applicarla prima di distribuire il WAR aggiornato.
La tabella contiene PNR, fkbooking, hash SHA-256 del token, created_at, last_request_at e expires_at.
Il token casuale da 256 bit viene restituito al login, conservato solo in memoria dal frontend e
scade dopo 24 ore. Ogni apertura/richiesta di nuovo login crea una sessione indipendente.
Ricaricare il link consente un nuovo login. Il token in chiaro non viene memorizzato nel database.

### POST /hhapi/sci_login

Body: `{ "pnr": "HMEP2N3KZ8" }`.
Risposta: `{ "success": true, "booking": { ... }, "token": "...", "expires_in": 86400 }`.
`booking` contiene i campi della query richiesta, più address, city, cap, lat e lng.
Il log code=3 usa MAX(activated) per evitare prenotazioni duplicate a causa di più righe di log.
PNR inesistente, ambiguo o non attivo: HTTP 404, errorcode BAD_BOOKING_CODE.
Errore database: HTTP 503. Nessun token viene emesso per un PNR non valido.

### POST /hhapi/sci_booking

Body: `{}`. Header: `Authorization: Bearer <token>`.
Restituisce la prenotazione legata al token e aggiorna last_request_at.
Token mancante, falso, scaduto o collegato a prenotazione non più attiva: HTTP 401.
Il fkbooking eventualmente passato dal browser non modifica la prenotazione autorizzata.

Per i prossimi metodi ospite: estendere `Method_sci_authenticated` e `Stub_sci`;
implementare `execForBooking(input, bookingId)` usando esclusivamente l'identità già verificata.
Nel frontend usare `BookingService.request('sci_nome', body)` per includere il token.
I token ospite non sono inseriti nella tabella o cache degli utenti amministrativi.

## Pubblicazione

Il frontend usa URL relativi `/hhapi/...`. Sul dominio HTTPS pubblico configurare il reverse proxy
per instradare `/hhapi/` al backend e preservare l'header Authorization. Il browser del turista
non deve chiamare localhost:9090 né un endpoint HTTP da una pagina HTTPS.
La pubblicazione sul dominio pubblico non è stata eseguita.

## Verifiche

- `npm run build`
- `npm test -- --watch=false`
- Build WAR con Ant di NetBeans e JDK 25 (sorgenti Java 24).
- `python3 test/sci_integration.py HMEP2N3KZ8` dalla directory hhapi.
- Verifica browser del login reale, della lingua inglese preselezionata e dei dati reali nella scheda ospiti.
