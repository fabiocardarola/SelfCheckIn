# RICHIESTA 026 — Popup e presa visione

## Comportamento implementato

- Informativa completa in dieci lingue, versione `2026-09-25.1`, con titolare, contatti, dati/fonti, basi giuridiche, destinatari, conservazione, diritti e assenza di profilazione.
- Collegamento sempre disponibile nell'intestazione, anche sul form e quando si riprende dalla mappa; pulsante di lettura anche nella schermata prima della registrazione.
- Modale nativa accessibile con titolo, focus iniziale, contenimento della tastiera, sfondo non interagibile, chiusura con pulsante o Escape, ripristino del focus e testo scorrevole. Nessuno scorrimento obbligatorio né timer di lettura.
- “Ho letto, continua” registra la presa visione. “Esci dal check-in” interrompe il percorso e permette di tornare. Non si parla di consenso o revoca ai trattamenti necessari.
- Aprire o chiudere il popup non registra una presa visione. La prosecuzione richiede un'azione esplicita, ma non richiede l'apertura del popup: l'informativa è disponibile dal collegamento accanto alla spiegazione sintetica.
- Gli ospiti con presa visione della versione corrente riprendono dalla mappa. I vecchi log Y/N non vengono trasformati in conferma del nuovo testo: la nuova schermata viene riproposta senza cancellare i progressi.
- Errori di salvataggio mantengono la schermata e permettono il ritentativo; i doppi clic durante il salvataggio sono bloccati.

## Verifica giuridica e scelta del flusso

L'obbligo è fornire un'informativa accessibile prima della raccolta, non imporre al turista una lettura dimostrabile o un consenso ai trattamenti necessari per contratto e legge. Il pulsante di presa visione è una scelta organizzativa del servizio; non è presentato come un obbligo di consenso imposto dal GDPR. Lo scorrimento non è una prova di lettura e non viene usato per sbloccare il pulsante.

Fonti: [Garante — doveri e informativa](https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/8981258), [Garante — basi giuridiche](https://garanteprivacy.it/web/guest/home/principi-fondamentali-del-trattamento), [EDPB — trasparenza](https://www.edpb.europa.eu/documents/guideline/transparency_en).

## Backend e registrazione

`sci_privacy` riceve:

```json
{
  "acknowledged": true,
  "noticeVersion": "2026-09-25.1",
  "language": "it"
}
```

`false` identifica l'uscita. Il backend verifica tipo booleano, versione esatta e lingua tra le dieci supportate. La prenotazione deriva esclusivamente dal token.

La nuova tabella `sci_privacy_events` registra `fkbooking`, versione, lingua, azione (`acknowledged`/`exited`) e timestamp server con microsecondi. Stato di avanzamento, log legacy e nuovo evento sono salvati nella stessa transazione, sotto lock della prenotazione. Rimangono i log `tti_automatic_log`, codice 100, Y/N per compatibilità; i nuovi eventi esprimono esplicitamente la presa visione o l'uscita, non il consenso. I nomi legacy `privacyAccepted` e `privacy_accepted` restano nel contratto API/database.

Login e progressi restituiscono anche `privacyNoticeVersion`. Le API `sci_guests` e `sci_guest_save` verificano sul server la presa visione della versione corrente: una chiamata diretta non bypassa il passaggio.

## Distribuzione

1. Eseguire [026_sci_privacy_events.sql](database/026_sci_privacy_events.sql) nel database di destinazione prima del backend. La creazione è idempotente e non modifica i log precedenti. Copia identica in `hhapi/docs/sql/026_sci_privacy_events.sql`.
2. Distribuire `hhapi/dist/hhapi.war` e il frontend `dist/self-check-in/browser` per `/self/` coordinatamente. I vecchi client che inviano solo `accepted` devono ricaricare la pagina: non possiedono la nuova informativa e il nuovo endpoint non attesta una versione mai presentata.
3. Per una futura revisione cambiare insieme `PRIVACY_NOTICE_VERSION` in Angular e `SciPrivacy.VERSION` in Java; archiviare i testi della versione precedente insieme al rilascio.

La migrazione è stata applicata solo al MySQL locale. Nessuna distribuzione in produzione eseguita.

## Verifiche

41 test Angular superati, comprese apertura senza registrazione implicita, chiusura, controlli disponibili senza scorrimento, nuova versione, ripresa degli step e contenuti delle dieci lingue. Test Java/MySQL su tabelle temporanee superati: metadati della presa visione, gate della versione, uscita, validazione, transazione e rollback, oltre alla regressione ospiti/residenza. Build Angular e WAR completate.

La build frontend segnala 537,11 kB iniziali rispetto alla soglia di avviso di 500 kB (sotto il limite bloccante di 1 MB), oltre all'avviso CommonJS già presente per `qrcode`.

## Elementi organizzativi ancora aperti

Questa implementazione non certifica la conformità complessiva del servizio e non implementa il processo di cancellazione definito nell'altro documento. Prima della pubblicazione dell'informativa, rendere effettiva la policy di conservazione descritta e completare le verifiche già annotate su backup/trasferimenti e DPO. Definire anche la durata del nuovo registro di presa visione: non è stata applicata automaticamente la durata quinquennale delle ricevute Alloggiati Web, che hanno una finalità diversa.

I testi applicativi comprendono solo l'informativa per gli ospiti, non le note interne con IP, anagrafiche operative o problemi da verificare. Nessuna dichiarazione non verificata di localizzazione esclusiva nell'UE è stata aggiunta.
