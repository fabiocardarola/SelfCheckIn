# RICHIESTA 014 — documenti ospiti su backend

## Salvataggio e ripresa

Il flusso carica i record della prenotazione con `POST /hhapi/sci_guests` e salva
l'ospite corrente con `POST /hhapi/sci_guest_save` quando si preme Avanti o
“Ho finito, salva i dati”. Entrambi richiedono il Bearer token di `sci_login`.
La prenotazione viene determinata esclusivamente dal token.

Body del salvataggio: `{ "index": 0, "guest": { ... } }`.
`index` è la posizione a partire da zero; `guest` contiene `pk` (zero per un nuovo
ospite), `surname`, `name`, `gender`, `birthDate` (YYYY-MM-DD), `nationalityCode`,
`issuingCountryCode`, `birthPlaceCode`, `documentTypeCode`, `documentNumber`.
I codici geografici trasmessi sono quelli della Polizia di Stato.
La risposta al salvataggio restituisce `pk`; la lettura restituisce `guests`
ordinati per `pk`.

Il primo record contiene i dati del documento; i successivi hanno tipo e numero
documento vuoti. Il backend blocca la creazione di posizioni saltate, verifica
il numero ospiti, i campi richiesti e l'età rispetto alla data di arrivo.
Ogni operazione usa una transazione e un lock sulla prenotazione. Gli aggiornamenti
mantengono il `pk`; il ritentativo dell'inserimento della stessa posizione aggiorna
il record esistente senza creare duplicati. Non vengono cancellati record.

La riapertura carica sempre il server, anche senza sessionStorage e su un altro
dispositivo. Le bozze incomplete non ancora confermate con Avanti/Salva rimangono
solo nella sessione del browser. I record server prevalgono sulle bozze locali.
Un errore di caricamento blocca l'inserimento per evitare di confondere il guasto
con una prenotazione priva di documenti. Un errore di salvataggio mantiene i campi
sullo schermo e non completa il passaggio. Messaggi disponibili nelle dieci lingue.

## Compatibilità legacy

Migrazione idempotente `hhapi/docs/sql/014_complaints_psnat.sql`, applicata al MySQL
locale: aggiunge `complaints.psnat` e `complaints.psiss`, entrambi VARCHAR(500)
NOT NULL DEFAULT ''. Prima di distribuire altrove, applicare la migrazione.

- `psnat`: codice PS della nazionalità; `nationality`/`nationalityDescription`:
  `cod_nazioni.cod`/`des`, cercati tramite `pscod`.
- `psiss`: codice PS del paese di rilascio; `issuingCountry`/
  `issuingCountryDescription`: stesso meccanismo di conversione.
- Il form esistente non chiede un paese di rilascio separato: per nuovi dati usa
  la nazionalità. Un diverso paese di rilascio già presente nel legacy viene
  recuperato e conservato quando si modificano gli altri dati dell'ospite.
- In lettura, i campi PS vuoti vengono ricavati dai rispettivi codici legacy e
  salvati sul record. Una corrispondenza mancante o ambigua genera un errore,
  senza inventare codici.
- `placeofbirth` contiene direttamente il codice PS, richiesto per nazionalità italiana.

Insert/update impostano `lastupdate=NOW()`, `fkuser=0`, `status=2`, `isValid=1`.
Gli altri campi non richiesti restano ai default in insert e invariati in update.

## Verifiche e distribuzione

Build Angular, 23 test frontend, build WAR Ant/JDK 25.
Test MySQL `hhapi/test/product/hhapi/SciGuestsTest.java`: usa esclusivamente tabelle
temporanee per verificare inserimento, update, ordine PK, ritentativi, isolamento
prenotazioni, conversioni, recupero persistente psnat/psiss, validazione e rollback.
La password del test si passa tramite `SCI_TEST_DB_PASSWORD`, senza inserirla nel codice.

Artefatti: `SelfCheckIn/dist/self-check-in/browser` e `hhapi/dist/hhapi.war`.
Nessuna pubblicazione sul server pubblico eseguita.

## Correzione compatibilità tipo documento legacy

I record importati possono contenere codici documento legacy (per esempio `P` o
`V`) assenti dall'elenco PS. L'aggiornamento ora permette di conservare il codice
già presente sullo stesso record. Nuovi record e cambi del tipo documento restano
vincolati all'elenco PS; nessuna conversione arbitraria dei documenti esistenti.
Test MySQL aggiunti per aggiornamento legacy e rifiuto dei medesimi codici su nuovi record.
