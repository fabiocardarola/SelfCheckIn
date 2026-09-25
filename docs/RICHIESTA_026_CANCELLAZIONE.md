# Schema di rimozione dei dati degli ospiti

Data: 25 settembre 2026 · Versione: 0.2

Proposta operativa per HelloHost, da implementare nel backend e nei processi di trasmissione. Nessuna cancellazione o modifica al database viene eseguita con questo documento. Sostituisce la precedente proposta generale di sette giorni dal check-out.

## 1. Eventi che autorizzano la rimozione

**PS_OK:** ricevuta positiva di Alloggiati Web acquisita, verificata e archiviata, riconciliata con l'invio e con gli ospiti effettivamente accettati. Aprire o leggere un file non basta. La nota del Garante richiama la cancellazione dei dati trasmessi dopo la generazione della ricevuta e la conservazione della ricevuta per cinque anni. Non attendere l'invio statistico per eliminare i campi esclusivamente destinati alla pubblica sicurezza. [Garante](https://www.gpdp.it/home/docweb/-/docweb-display/docweb/10244289).

**STAT_OK:** esito positivo di acquisizione/elaborazione ROSS1000, riferito agli ospiti, ai movimenti e alla versione dei dati effettivamente trasmessi. Un file generato, una richiesta HTTP riuscita o la semplice spedizione non bastano. Distinguere arrivi, partenze e rettifiche: l'accettazione di un arrivo non chiude il movimento di partenza ancora dovuto. Il meccanismo concreto di lettura dell'esito va verificato nell'integrazione in uso.

Per ogni campo, rimuovere il valore appena tutte le finalità effettivamente applicabili a quel campo risultano concluse. Lo schema presume che i dati della scheda ospite servano solo a questi due adempimenti; eventuali necessità diverse devono essere individuate separatamente, non assunte come eccezioni generiche.

## 2. Matrice dei campi della scheda ospite

I nomi della tabella `complaints` derivano dalla documentazione del progetto; tipi, vincoli e utilizzi nel backend vanno verificati prima di eseguire aggiornamenti.

| Campi | Finalità dello schema | Evento di rimozione | Sostituzione proposta |
|---|---|---|---|
| `holderSurname`, `holderName` | Pubblica sicurezza; non necessari all'importazione statistica standard | PS_OK | `***` |
| `doctype`, `docnumber` | Pubblica sicurezza | PS_OK | `***`, se compatibile con vincoli e lettori |
| `issuingCountry`, `issuingCountryDescription` | Pubblica sicurezza | PS_OK | Codice vuoto; descrizione `***` |
| `dateOfBirth` | Pubblica sicurezza e statistica | PS_OK e STAT_OK | `NULL`, mai una data inventata |
| `sex` | Pubblica sicurezza e statistica | PS_OK e STAT_OK | Stringa vuota o `NULL` se consentito |
| `nationality`, `nationalityDescription`, `psnat` | Cittadinanza: pubblica sicurezza e statistica | PS_OK e STAT_OK | Codici vuoti; descrizione `***` |
| `placeofbirth` e altri eventuali valori di nascita | Pubblica sicurezza; statistica se richiesti dal tracciato effettivamente usato | PS_OK, oppure entrambi se necessari anche a ROSS1000 | Codice vuoto |
| `psres` (Stato di residenza) ed eventuali futuri campi di residenza | Statistica | STAT_OK | Codici vuoti; descrizioni `***` |
| Dati del soggiorno e identificativi tecnici di movimento | Trasmissioni, partenze e riconciliazione | Dopo completamento dei movimenti cui servono, secondo policy dedicata | Eliminare collegamenti non più necessari; non alterare automaticamente la prenotazione |

La cittadinanza è distinta dalla residenza. Il tracciato XML standard richiede sesso, data di nascita, cittadinanza e Stato di residenza; il comune di residenza è obbligatorio per chi risiede in Italia. Il TXT prevede anche lo Stato di nascita obbligatorio. La matrice va pertanto applicata al tracciato realmente utilizzato. [XML ROSS1000](https://www.ross1000.it/source/tracciato-xml.pdf), [TXT ROSS1000](https://www.ross1000.it/source/tracciato-txt.pdf).

**Aggiornamento:** il form ora raccoglie lo Stato di residenza in `psres`, con proposta dalla nazionalità modificabile dall’ospite. Rimangono da adeguare l’esportatore e la raccolta del comune per residenti in Italia. Verificare il file o il payload effettivamente prodotto: non considerare i due dati equivalenti e non inventare la residenza per superare una validazione. Se ROSS1000 accetta un file con dati semanticamente errati, il solo esito tecnico non risolve l'anomalia.

## 3. Cosa significa sostituire con asterischi

La proposta usa `***` come valore costante per i testi: deve sovrascrivere l'intero valore originale nel database. Non mantenere iniziali, ultime cifre o lunghezza originale. Una maschera grafica, la cifratura reversibile o il mantenimento del valore originale in una colonna nascosta non realizzano questa rimozione.

Per date, codici e campi vincolati usare `NULL` o stringa vuota secondo lo schema. Gli asterischi possono essere mostrati nell'interfaccia anche quando il database contiene `NULL`. Prima dell'intervento verificare che un codice vuoto non venga ricostruito dal legacy o interpretato come un paese predefinito.

Non chiamare l'intera riga “anonima”: `fkbooking`, PNR, identificativi, date del soggiorno e altri archivi possono ancora collegarla alla persona. Lo schema elimina specifici valori, non certifica l'anonimizzazione dell'intero sistema. Anche i metadati residui necessitano di una finalità e di una durata definite.

## 4. Sequenza del processo automatico

1. Registrare per ospite e versione dei dati gli invii alle due destinazioni, senza duplicare dati personali nei log.
2. Acquisire e riconciliare PS_OK. Archiviare la ricevuta in modo durevole prima della rimozione. Sostituire subito nome, cognome ed estremi del documento nella scheda destinata alla pubblica sicurezza.
3. Conservare soltanto il sottoinsieme ancora necessario alla statistica. Dopo la rimozione dei nomi, l'esportatore statistico deve funzionare con identificativi tecnici e dati residui, senza ricostruire i nomi dalla prenotazione.
4. Acquisire STAT_OK per i movimenti dovuti. Rimuovere i dati esclusivamente statistici; per quelli condivisi verificare anche PS_OK. Se la statistica termina prima della pubblica sicurezza, conservarli solo fino a PS_OK.
5. Aggiornare in transazione i valori e lo stato di rimozione. Rendere l'operazione ripetibile senza effetti aggiuntivi. Registrare data/ora, categorie rimosse e riferimenti agli esiti, mai i valori precedenti.
6. Escludere le schede trattate da reinvii e aggiornamenti ordinari. Un rientro dell'ospite deve mostrare “Dati già trasmessi e rimossi”, senza segnalare documenti mancanti o richiedere una nuova compilazione automatica. Eventuali rettifiche successive richiedono un percorso esplicito.

Stati proposti: PS in attesa/accettato/errore; statistica in attesa/parziale/completa/errore; rimozione PS eseguita; rimozione campi condivisi eseguita. Le conferme devono riferirsi alla versione trasmessa: una vecchia ricevuta non può autorizzare la rimozione di una modifica non ancora inviata.

Invii parziali: agire soltanto sugli ospiti riconciliati come accettati. Se l'esito non consente di identificarli con certezza, richiedere verifica operativa. In caso di errore o esito mancante, conservare temporaneamente i soli dati necessari al recupero, effettuare tentativi controllati e generare un avviso all'operatore. Definire prima del rilascio tempi di intervento e gestione dei casi mai completati, cancellati o no-show: non lasciarli in conservazione indefinita e non inventare ricevute positive.

## 5. Copie, ricevute e altri archivi

La sostituzione su `complaints` deve accompagnarsi alla ricerca e rimozione delle copie in `jsondata`, `error`, file indicati da `fsname` o `generated`, esportazioni, cartelle di invio, log, cache, repliche e archivi del gestionale. Questi campi vanno ispezionati: non si presume che tutti contengano dati personali. Conservare i messaggi tecnici utili senza nominativi o payload originali.

Per Acronis occorre definire durata e scadenza effettiva dei backup, eventuali copie immutabili e procedimento di ripristino. Fino alla scadenza, le copie residue devono essere protette e non riutilizzate per l'operatività ordinaria. Dopo un ripristino, riapplicare le rimozioni già dovute prima di riaprire il servizio. Un aggiornamento SQL non cancella retroattivamente i vecchi backup: la policy pubblicata deve descrivere correttamente anche questo ciclo.

Le ricevute Alloggiati Web restano in archivio separato per cinque anni. La conferma ROSS1000 e il registro delle rimozioni devono essere minimizzati e avere un termine proprio, ancora da definire; non estendere automaticamente a essi la regola delle ricevute di pubblica sicurezza.

I dati contrattuali della prenotazione, fiscali, di accesso, di avanzamento e di presa visione privacy sono fuori dalla matrice della scheda ospite. Vanno censiti con finalità e scadenze proprie: non cancellarli indiscriminatamente né mantenerli senza limiti. Non applicare questi aggiornamenti agli archivi di Polizia di Stato o Regione.

## 6. Stato della proposta

La regola funzionale è definita. Prima di dichiararla operativa restano: verifica dell'esportatore ROSS1000 e della residenza, lettura e riconciliazione degli esiti, compatibilità dei campi offuscati con backend/frontend/daemon, gestione delle copie e definizione delle durate residue. Solo dopo implementazione e verifica end-to-end l'informativa potrà descrivere il processo come effettivamente attivo.
