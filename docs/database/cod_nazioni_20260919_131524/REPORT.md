# Allineamento cod_nazioni — 19 settembre 2026

Database aggiornato: `gcv` su `localhost:3306`. Nessuna modifica al frontend, al backend o ai documenti degli ospiti.

## Riferimento e convenzioni

`docs/tabelle_codici/stati.csv` è il riferimento vincolante per `pscod` e `des`. Le descrizioni sono quelle del CSV, con prima lettera maiuscola e il resto minuscolo; non sono sostituite con le denominazioni internazionali. Per esempio SWAZILAND rimane “Swaziland”. Il CSV non contiene `cod` e `cod2`: questi sono completati con le corrispondenze internazionali, preservando tutti i codici legacy esistenti e le rispettive chiavi primarie.

Come richiesto dall’utente, vengono completate le voci senza `DataFineVal`; le quattro voci storiche sono documentate sotto, senza inventare codici o introdurre alias ambigui.

## Esito verificato dopo il commit

- 215 record prima, 234 dopo: 19 inserimenti e 123 record aggiornati.
- Tutti i 232 codici del CSV senza fine validità sono presenti.
- Tutte le descrizioni associate a codici del CSV corrispondono al CSV, salvo la normalizzazione maiuscole/minuscole richiesta.
- `cod`, `pscod`, `des` e `lastupdate` sono compilati; `cod2` è compilato per tutte le nazioni, con l’unica eccezione motivata di Apolide.
- `lastupdate` aggiornato per i record modificati o inseriti; conservato per i record invariati.
- Operazione applicata in transazione, con controlli sullo stato iniziale e sui record risultanti prima del commit.
- Tutti i `pk` e `cod` preesistenti sono stati conservati. Nessuna cancellazione.

## Associazioni corrette

| cod | pscod precedente | pscod corretto |
|---|---|---|
| VGB | 100000764 | 100000812 |
| GUF | 100000612 | 100000761 |
| SVK | 100000210 | 100000255 |
| MKD | 100000253 | 100000997 |

Le correzioni di SVK e MKD spostano i rispettivi record sulle voci attuali del CSV; non vengono duplicati i codici legacy per rappresentare gli storici.

## Eccezioni e compatibilità

- **Apolide**: `cod=XXA`, codice ICAO; `cod2` vuoto perché non è una nazione con codice ISO a due lettere. Non è stato inventato un codice a due lettere.
- **Kosovo**: `cod=XKX`, `cod2=XK`, convenzione adottata dall’UE, non assegnazione ISO ufficiale.
- **Germania**: conservati sia `DEU` sia l’alias legacy `D`, entrambi con `pscod=100000216`; completato `cod2=DE` per `D`. La duplicazione preesistente continua a causare `AMBIGUOUS_NATIONALITY` nella funzione `SciGuests.country` quando la ricerca avviene per codice di polizia. La sua risoluzione richiede la gestione dell’alias nel backend: eliminare o rinominare `D` nella sola tabella comprometterebbe la lettura dei documenti legacy che lo utilizzano. Questo intervento non è stato incluso nella modifica dei dati.
- **Gibilterra**: conservato il record legacy `GIB/GI`, `pscod=110000004`, anche se non presente nel CSV; descrizione “Gibilterra”. Non viene sostituito con il codice di un’altra nazione.

## Voci storiche non inserite

| pscod | Descrizione del CSV | DataFineVal |
|---|---|---|
| 100000740 | BOPHUTHATSWANA | 01/05/1994 00:00:00 |
| 100000210 | CECOSLOVACCHIA | 01/01/1993 00:00:00 |
| 100000253 | MACEDONIA | 13/02/2019 00:00:00 |
| 100000533 | S. VINCENT E GRENADINE | 22/11/2001 00:00:00 |

Per la vecchia Macedonia e Saint Vincent un secondo record con lo stesso `cod` introdurrebbe ambiguità nella conversione dal codice legacy al codice di polizia. Bophuthatswana richiede una convenzione specifica per i campi non forniti dal CSV. Cecoslovacchia resta nel gruppo storico escluso dall’intervento, secondo la scelta dell’utente. Il CSV non viene modificato: i luoghi di nascita storici rimangono disponibili al frontend attraverso il CSV.

## Fonti per i campi non presenti nel CSV

- [UNSD M49, corrispondenze ISO alpha-2/alpha-3](https://unstats.un.org/unsd/methodology/m49/overview/).
- [Unione europea, convenzione XKX/XK per Kosovo](https://op.europa.eu/da/web/eu-vocabularies/countries-and-territories).
- [ICAO, codice XXA per apolidi](https://www.icao.int/Meetings/FALP/Documents/FALP13-2024/FALP13-WP12_en.pdf).
- [W3C, corrispondenza TW/TWN](https://www.w3.org/community/reports/dpvcg/CG-FINAL-loc-20240801/).

## File conservati

- `backup.sql` e `before.json`: copia integrale dei 215 record iniziali. `backup.sql` contiene INSERT da usare solo con una tabella vuota della stessa struttura, non è uno script da eseguire sulla tabella popolata.
- `apply.sql`: SQL effettivamente applicato, con controlli dello stato iniziale; intenzionalmente non riapplicabile dopo l’aggiornamento.
- `plan.json`: dettaglio delle modifiche.
- `after.json` e `after.csv`: contenuto completo dopo l’aggiornamento.
- `verification.json`: risultati del confronto finale.
