# Aggiornamento cod_comuni — RICHIESTA 020

Eseguito il 19 settembre 2026 sul database locale `gcv@localhost:3306`.

Il CSV `docs/tabelle_codici/comuni.csv` è stato applicato come riferimento vincolante, inclusi tutti i codici storici. Le descrizioni sono conservate esattamente come nel CSV, in maiuscolo, con gli stessi apostrofi e spazi.

## Esito verificato

- Record prima: **7.980**.
- Inserimenti: **3.314** (155 senza fine validità e 3.159 storici).
- Descrizioni corrette: **12**.
- Record dopo: **11.294**, tutti corrispondenti al CSV.
- Nessun codice mancante, aggiuntivo o duplicato.
- Nessuna differenza di descrizione o provincia.
- Tutte le chiavi primarie e tutti i codici preesistenti conservati.
- Nessuna cancellazione e nessuna modifica ai dati degli ospiti.
- `lastupdate` aggiornato per i record inseriti o corretti, conservato per gli altri 7.968 record.

L’aggiornamento è stato eseguito in transazione con blocco dei record, verifica dello snapshot iniziale e controlli sul risultato prima del commit. Una successiva rilettura ha confermato la corrispondenza esatta di `cod`, `des` e `pr` con il CSV.

La struttura della tabella rimane invariata: `DataFineVal` non ha un campo corrispondente in `cod_comuni`. I 3.396 codici storici sono tutti presenti; le relative date di fine validità restano nel CSV originale, conservato anche nella cartella di questo intervento.

## File dell’intervento

- [Backup SQL dei record iniziali](backup.sql): INSERT da ripristinare esclusivamente in una tabella vuota con la struttura originale.
- [Struttura iniziale](schema_before.txt).
- [Snapshot iniziale](before.json).
- [SQL applicato](apply.sql): operazione singola con verifica dello stato iniziale, non da rieseguire sulla tabella già aggiornata.
- [Piano delle modifiche](plan.json).
- [CSV di riferimento utilizzato](comuni_source.csv).
- [Tabella finale CSV](after.csv) e [JSON](after.json).
- [Risultati della verifica](verification.json).
