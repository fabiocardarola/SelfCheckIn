# Richiesta 009 — FreeNow e leggibilità su smartphone

## Percorso FreeNow

Verificate nuovamente le fonti pubbliche: non è stato trovato un contratto documentato di parametri per preimpostare partenza FCO e destinazione sul link HTTPS funzionante `https://m.free-now.com/JGMc`. Non è possibile confermare che questa funzione sia disponibile tramite quel link. Il collegamento e le istruzioni per copiare la destinazione restano invariati; non vengono aggiunti parametri ipotetici né ripristinato lo schema che provocava l’errore.

La [guida ufficiale FreeNow](https://support.free-now.com/hc/en-gb/articles/360020681173-Booking-Managing-Your-Trip-request) descrive l’inserimento di partenza e destinazione nell’app. Per un’integrazione precompilata servono specifiche confermate da FreeNow e una verifica su app native. Nessuna richiesta è stata inviata a FreeNow.

## Zoom durante la compilazione

I campi nome, cognome, numero documento e ricerca nei selettori avevano font da 12–13 px: una causa plausibile dello zoom automatico al focus sui dispositivi iOS. Portati a 16 px; giorno e anno restano a 21 px. Aggiunta una base globale da 16 px per input, select e textarea.

Il viewport mantiene larghezza del dispositivo e scala iniziale 1, con `viewport-fit=cover` per le safe area e `interactive-widget=resizes-visual` per chiedere ai browser compatibili di limitare l’effetto della tastiera al viewport visibile. Uniformato `text-size-adjust: 100%` alla proprietà WebKit già presente. Lo zoom manuale resta disponibile.

Non viene promesso un blocco assoluto del viewport: tastiera, orientamento e interfaccia del browser dipendono dal dispositivo. Il browser integrato desktop non riproduce lo zoom automatico di Safari iOS; la correzione va confermata sul telefono che presentava il problema.

## Mesi

Font aumentato da 9 px a 15–17 px, con 16 px sugli schermi fino a 380 px. Tre colonne normalmente, due sui telefoni stretti; pulsanti da almeno 48–50 px, testo a capo se necessario e colonne che non si allargano oltre la griglia. Il contenuto del popup resta scorrevole quando l’altezza disponibile è ridotta.

## Verifiche

- Verifica visiva in italiano a 320 × 568 e 390 × 844: mesi leggibili, dodici pulsanti visibili senza testo fuori dai bordi.
- Controllo nel browser: font effettivo da 16 px nei campi nome, cognome e documento; nessun overflow orizzontale dei pulsanti dei mesi a 320 px.
- `npm test -- --watch=false`: 11 test superati.
- `npm run build`: riuscita.
