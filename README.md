# HelloHost Self Check-in

Prototipo mobile-first del percorso di self check-in per turisti, realizzato con Angular 21.

## Avvio locale

```bash
npm install
npm start
```

Aprire `http://localhost:4200` usando la modalità dispositivo del browser oppure uno smartphone sulla stessa rete locale.

## Flusso disponibile

- scelta fra 10 lingue;
- accettazione o rifiuto dell'informativa privacy;
- mappa illustrata con quattro tappe sequenziali;
- blocco e sblocco progressivo degli step;
- schermate segnaposto localizzate per apertura portone e recupero chiavi.
- registrazione guidata dei quattro ospiti con validazioni, selettori da CSV e salvataggio parziale simulato.
- indicazioni per raggiungere l’appartamento, taxi, preventivo NCC simulato, Uber, FreeNow e navigazione a piedi o con mezzi pubblici; opzioni configurabili per appartamento.

Dettagli di configurazione, fonti e comportamento dei deep link Uber/FreeNow: [Richiesta 007](docs/RICHIESTA_007.md). Correzione FreeNow e percorso a piedi dalla posizione attuale: [Richiesta 008](docs/RICHIESTA_008.md).

L'interfaccia è ottimizzata per viewport mobile Android e iPhone e tiene conto delle safe area del dispositivo.

## Verifiche

```bash
npm test -- --watch=false
npm run build
```

Zoom durante la compilazione, leggibilità dei mesi e verifica della precompilazione FreeNow: [Richiesta 009](docs/RICHIESTA_009.md).
