# RICHIESTA 022 — ripresa del self check-in

Lo stato è persistente per `fkbooking`, indipendente da token, browser e dispositivo.
Il login restituisce anche `progress`: lingua scelta, ultimo consenso privacy,
step completati e relative date/ore. Se la privacy è già accettata si apre subito
la mappa; altrimenti si apre la privacy se esiste una lingua salvata, oppure la
scelta della lingua per un primo accesso.

Il cambio lingua rimane disponibile e non richiede un nuovo consenso se quello
precedente è ancora positivo. Il logo torna alla scelta lingua senza azzerare gli
step; il vecchio pulsante di riavvio della demo è stato rimosso dalla mappa finale.

## Persistenza e compatibilità

La migrazione `hhapi/docs/sql/022_sci_progress.sql` crea `sci_progress`, con una riga
per prenotazione: lingua e data della scelta, privacy e data della decisione,
`step1_at`…`step4_at`, `created_at` e `updated_at`. È già applicata al MySQL locale;
va applicata negli altri ambienti prima del backend e del frontend aggiornati.

Al primo recupero dello stato vengono importati:

- l'ultimo log privacy con `code=100`, ordinato per `activated DESC, pk DESC`:
  un rifiuto successivo prevale su un consenso precedente;
- il primo documento già presente in `complaints`, solo se `isValid=1` e completo
  dei principali campi obbligatori. La data importata è `lastupdate` (in assenza,
  l'ora del recupero), non una ricostruzione della data effettiva di completamento.

Gli step 2–4 delle vecchie sessioni non sono ricostruibili: prima erano mantenuti
solo in memoria. Da questa versione si salvano quando il turista li conferma.
Portone e chiavi conservano gli attuali contenuti dimostrativi.

## API

- `sci_login` include `progress` nella risposta. Un errore nel recupero dello stato
  blocca l'avvio con possibilità di riprovare, evitando di mostrare un falso primo accesso.
- `POST sci_progress`, Bearer token obbligatorio:
  - `{}` legge lo stato;
  - `{ "language": "it" }` salva una lingua supportata;
  - `{ "step": 1 }` completa uno step da 1 a 4.
- `sci_privacy` registra ogni decisione nel log esistente e aggiorna lo stato
  privacy nella stessa transazione. Un rifiuto conserva la cronologia degli step,
  ma impedisce di proseguire fino a una nuova accettazione.

La prenotazione viene identificata esclusivamente dal token. Il backend verifica
consenso, ordine degli step e presenza del documento del primo ospite per lo step 1.
Il completamento parziale degli ospiti rimane ammesso dal flusso esistente.
I ritentativi non modificano la data del primo completamento dello step.
I lock sulla prenotazione serializzano le scritture concorrenti.

Il frontend attende la conferma REST prima di avanzare; in caso di errore mantiene
la schermata e propone un ritentativo. I messaggi sono tradotti nelle dieci lingue.

## Verifiche

- Build Angular e WAR Java completate.
- 30 test frontend superati, inclusi ripresa, lingua, privacy rifiutata,
  mancato salvataggio, doppio clic e ritentativo.
- `SciProgressTest`, `SciPrivacyTest`, `SciGuestsTest`: superati con tabelle
  temporanee MySQL, senza alterare dati o consensi delle prenotazioni reali.
  Verificati anche isolamento, importazione legacy, timestamp stabili e rollback
  atomico di log privacy e stato.
- Verifica HTTP sul backend locale: login con stato, lettura autenticata,
  rifiuto di token mancanti e step non validi.
- La prenotazione di esempio recupera il consenso già esistente e lo step 1.

Nessuna pubblicazione sul server pubblico effettuata.
