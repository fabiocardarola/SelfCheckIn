# RICHIESTA 025 — card HHAdmin nel percorso turista

Implementazione in SelfCheckIn e nel backend `ProgettiJakarta/hhapi`.

- Step 3: categoria AB001; step 4: categoria AB002.
- Card generiche e dell’appartamento ordinate insieme secondo gli override HHAdmin.
- Sei tipi: testo, foto, YouTube, Wi-Fi con QR locale, azione F001 e codice porta.
- Traduzioni correnti della lingua scelta, fallback italiano; copy UI nelle dieci lingue.
- Caricamento, aggiornamento, errore/riprova, elenco vuoto e navigazione esistente.
- Codice porta mascherato nel SQL se mancano documenti o task Quality Check 104.
- Nessun completamento automatico: rimane il pulsante esplicito che salva `sci_progress`.

## Backend e configurazione

Nuovi POST autenticati `/sci_posts` e `/sci_post_action`, con stub guest, Bearer token e `Cache-Control: no-store`. GET risponde 405. Categoria, card, host, stanza, privacy e step precedente sono verificati sul server. Il payload non determina l’identità della prenotazione.

Le tabelle HHAdmin necessarie sono già presenti nel database locale: non è stata applicata alcuna migrazione. In produzione devono essere presenti le strutture degli script HHAdmin `database/sci_posts.sql` e `database/sci_posts_request003.sql`.

Impostare nell’ambiente del processo Java hhapi:

| Variabile | Utilizzo |
| --- | --- |
| `HHAPI_POST_ASSET_DIRECTORY` | Cartella persistente delle immagini JPEG/PNG. Default `/opt/hhadmin`, dove sono già salvate le foto. Può indicare un volume o una cartella autonoma del server hhapi. |
| `HHAPI_MQTT_BROKER` | URI del broker, necessaria per dispositivi MQTT. |
| `HHAPI_MQTT_USERNAME` | Utente MQTT, necessario per dispositivi MQTT. |
| `HHAPI_MQTT_PASSWORD` | Password MQTT, necessaria per dispositivi MQTT. |

Nessuna credenziale MQTT è incorporata nel nuovo codice. SelfCheckIn non richiede l’URL pubblico né l’applicazione HHAdmin in esecuzione. La servlet locale hhapi `/sci_post_assets/<UUID>.jpg|png` distribuisce direttamente i file. I percorsi storici del database `/sci-post-assets/...` sono convertiti nel percorso della nuova servlet e Angular li risolve rispetto alla propria `API_BASE_URL`. Sono ammessi solo nomi UUID JPEG/PNG, senza percorsi arbitrari o symlink; cache immutabile e header `nosniff`. Gli URL HTTPS esterni configurati nelle card rimangono utilizzabili.

Le foto sono dati persistenti, al pari del database condiviso. Sulla stessa macchina la cartella esistente funziona senza copie e senza HHAdmin avviato; hhapi necessita soltanto del permesso di lettura. Su macchine separate montare lo stesso volume oppure replicare i file nella cartella indicata da `HHAPI_POST_ASSET_DIRECTORY`, mantenendo i nomi UUID. Non viene effettuato un download da HHAdmin e non è necessario distribuirne il WAR. L’editor rimane nel backoffice, come previsto dalla richiesta; tutta la lettura e l’esecuzione turista sono implementate in hhapi.

F001 supporta MQTT, Home Assistant e Particle. Usa il fuso Europe/Rome e gli estremi inclusivi arrivo −1 / partenza +1 giorno. Il WAR include già la dipendenza Paho esistente. Il timeout client del solo comando è 65 secondi; configurare il reverse proxy con un timeout maggiore (almeno 75 secondi). Nessun retry automatico; un timeout mostra esito incerto e invita a controllare il portone.

Distribuire il WAR hhapi e la build Angular insieme. Il progetto Java mantiene il target Java 24 esistente: usare un runtime compatibile. Nessuna pubblicazione in produzione è stata eseguita da questa richiesta.

## Verifiche

- `npm test -- --watch=false`: suite Angular e test nuovi del renderer, concorrenza delle risposte, reset dei codici, doppio invio, timeout, URL YouTube, QR e lingue.
- `npm run build`: build produzione Angular. La libreria locale `qrcode` è CommonJS e genera un avviso di ottimizzazione, senza errori di build.
- Build Ant `dist` di hhapi; verifica classi endpoint e dipendenza MQTT nel WAR.
- `test/product/hhapi/SciPostsTest.java`: preflight schema reale in sola lettura e fixture su tabelle temporanee per isolamento host/stanza, ordine, traduzioni, privacy/percorso, quattro combinazioni documenti/QC, zeri iniziali, codice assente, azioni disabilitate/estranee e risultati del comando con trasporto finto.
- Prova browser mobile a 390 e 320 pixel con API simulate: sei tipi di card, QR, errore foto, nessun overflow orizzontale, popup e focus, aggiornamento del codice mascherato.
- `SciPostAssetTest`: lettura di una foto da cartella locale, mapping URL, file assente, traversal e symlink rifiutati.
- GET/POST senza token sui due endpoint locali: 405/401 e `no-store`.

Per eseguire il test Java dalla radice hhapi, dopo la build e con `SCI_TEST_DB_PASSWORD` e `CATALINA_HOME` (cartella Tomcat) già configurate nell’ambiente:

```sh
mkdir -p build/test/classes
javac -cp "build/web/WEB-INF/classes:build/web/WEB-INF/lib/*:$CATALINA_HOME/lib/servlet-api.jar" -d build/test/classes test/product/hhapi/SciPostsTest.java test/product/hhapi/SciPostAssetTest.java
java -cp "build/web/WEB-INF/classes:build/web/WEB-INF/lib/*:build/test/classes:$CATALINA_HOME/lib/servlet-api.jar" product.hhapi.SciPostsTest
java -cp "build/web/WEB-INF/classes:build/web/WEB-INF/lib/*:build/test/classes:$CATALINA_HOME/lib/servlet-api.jar" product.hhapi.SciPostAssetTest
```

Il test usa MySQL locale, database `gcv`, utente `root`; tutte le scritture sono su tabelle temporanee della connessione. Nessun portone reale viene azionato. I test con trasporto finto non certificano connettività MQTT/HTTP di produzione né apertura fisica.
