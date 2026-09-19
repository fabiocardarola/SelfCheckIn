# RICHIESTA 013 — registrazione delle scelte privacy

Ogni pressione su Sì/No chiama `POST /hhapi/sci_privacy` con body
`{"accepted":true}` oppure `{"accepted":false}` e il token Bearer di `sci_login`.
Il metodo segue il meccanismo `Stub_sci` / `Method_sci_authenticated`.
Tutti i metodi REST del self check-in devono mantenere il prefisso `sci_`.

Il backend ricava `fkbooking` esclusivamente dal token e inserisce una nuova riga
in `tti_automatic_log`: `code=100`, `activated=NOW()`, `error=Y` oppure `N`.
`pk` è generato da MySQL. Ogni nuova scelta, anche uguale alla precedente o dopo
un ripensamento, aggiunge una riga senza sovrascrivere lo storico.
Il campo `accepted` deve essere un booleano JSON: valori mancanti o non booleani
restituiscono HTTP 400. Il controllo token preesistente restituisce 401 per sessioni
non valide; gli errori SQL restituiscono 503. Non occorrono migrazioni.

Il frontend attende il successo prima di aprire la mappa o la schermata di rifiuto.
Durante il salvataggio blocca doppi clic e navigazione; in caso di errore rimane
sulla privacy con un messaggio tradotto e permette di riprovare. Un token scaduto
segue la gestione della sessione esistente, richiedendo un nuovo login.
Non vengono effettuati ritentativi automatici. Se la risposta si perde dopo
l'inserimento, una nuova scelta esplicita può aggiungere un'altra riga al log.

Verifiche: build Angular, 20 test frontend e build WAR con Ant/JDK 25.
Il test backend `hhapi/test/product/hhapi/SciPrivacyTest.java` verifica il metodo
con JDBC simulato: Y/N, scelte ripetute, isolamento della prenotazione, valori
non validi ed errore SQL, senza scrivere consensi di prova su prenotazioni reali.
Compilarlo con `javac -d <cartella-test> -cp <classpath-backend>` e avviarlo come
`product.hhapi.SciPrivacyTest` aggiungendo la cartella al classpath. Il classpath
comprende `build/web/WEB-INF/classes`, `build/web/WEB-INF/lib/*` e le librerie Tomcat.

Distribuzione: pubblicare il WAR aggiornato `hhapi/dist/hhapi.war` e il frontend
`SelfCheckIn/dist/self-check-in/browser`. Nessuna pubblicazione eseguita.
