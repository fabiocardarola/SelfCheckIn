# Stato di residenza degli ospiti

## Comportamento

Il form di tutti gli ospiti include “Stato di residenza”, con ricerca sullo stesso elenco `stati.csv` usato per la nazionalità e testi nelle dieci lingue dell'app.

Il valore segue inizialmente la nazionalità. Una selezione esplicita della residenza interrompe questa sincronizzazione, anche se l'ospite sceglie lo stesso Stato: successive modifiche della nazionalità non sovrascrivono la scelta. Una residenza già salvata viene sempre conservata. Per gli accompagnatori senza residenza viene proposta la propria nazionalità, non la residenza del capogruppo.

Il messaggio sotto il campo invita a correggere lo Stato se diverso. Il campo è richiesto nel form. La proposta di residenza per i vecchi record vuoti è solo nel frontend: viene scritta nel database quando l'ospite salva, non durante la lettura.

## Database e API

Una sola nuova colonna, contenente il codice Polizia di Stato a nove cifre dello Stato di residenza:

```sql
ALTER TABLE complaints
  ADD COLUMN psres VARCHAR(9) NOT NULL DEFAULT '';
```

La descrizione viene ricavata da `stati.csv`; non si aggiungono colonne descrittive né conversioni in codici legacy a tre lettere. Nazionalità e residenza restano indipendenti. I record esistenti mantengono `psres = ''`; nessun backfill dalla nazionalità.

Script idempotente per MySQL 8: [026_complaints_psres.sql](database/026_complaints_psres.sql). Una copia identica si trova in `hhapi/docs/sql/026_complaints_psres.sql`.

`sci_guests` restituisce `residenceCountryCode`; `sci_guest_save` lo salva in `psres` per titolare e accompagnatori, validando formato e presenza in `cod_nazioni.pscod`. Il client non determina la prenotazione: rimane quella del token autenticato.

Per richieste di client precedenti che omettono il campo, il backend conserva la residenza già salvata; per nuovi record lascia vuoto. Un campo esplicitamente fornito deve contenere un codice valido. La modifica non cambia l'ordine dei record o i loro PK.

## Distribuzione

1. Selezionare il database di produzione corretto ed eseguire lo script SQL prima di aggiornare il backend.
2. Distribuire il nuovo `hhapi.war`.
3. Distribuire il frontend Angular compilato per `/self/`.

La migrazione è stata applicata al MySQL locale, non alla produzione. Il default verificato è stringa vuota e la colonna è `NOT NULL`.

## Verifiche

- 38 test Angular superati, compresi precompilazione, scelta manuale, ripresa della bozza, invio del campo all'API e accompagnatori.
- Test Java/MySQL su tabelle temporanee superati: insert, update, rilettura, residenza distinta dalla cittadinanza, compatibilità con campo omesso e rollback per valori invalidi.
- Build Angular `/self/` e WAR Java completate. La build Angular segnala il consueto avviso CommonJS per `qrcode`.

## Ambito

Questa modifica raccoglie lo Stato di residenza. Non aggiunge il comune di residenza italiano e non modifica l'esportatore ROSS1000 del gestionale: questi passaggi restano da completare per usare il nuovo dato nel flusso statistico. Non implementa il processo di cancellazione né il popup privacy.
