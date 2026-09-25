# RICHIESTA 024 — coordinate appartamenti host 3

Aggiornamento applicato al database locale il 20 settembre 2026: **19 record**, relativi a **15 indirizzi distinti**. Nessuna esecuzione in produzione.

## File per la produzione

Eseguire `update_rooms_host3.sql` nel database di destinazione con MySQL 8. Lo script contiene le coordinate e non richiede chiamate a servizi esterni.

Il controllo confronta tutti i 19 `pk`, `hostPk=3`, `address`, `city` e `cap`. Se manca una corrispondenza, nessuna riga viene aggiornata e vengono elencati i PK difformi. In caso positivo modifica `lat` e `lng` e corregge il CAP dei PK 3 e 98, in transazione. Per questi due record il controllo accetta sia il CAP originario sia quello corretto, consentendo la riesecuzione. È rieseguibile: al secondo passaggio i valori restano identici e le righe modificate possono essere zero. Eventuali nuovi appartamenti non inclusi nei 19 PK restano esclusi.

`rollback_locale.sql` contiene i valori originari locali; non è un backup dei valori della produzione. `before.json`, `after.json`, `coordinate.csv`, `apply_result.txt` e `verification.json` documentano l'esecuzione.

## Metodo e fonti

Coordinate WGS84, `lat` = latitudine e `lng` = longitudine, arrotondate a 7 decimali. La precisione numerica non equivale alla precisione del rilievo: sono punti di indirizzo del geocoder, non misure GPS del portone.

Sono state selezionate le corrispondenze **PointAddress** di [ArcGIS World Geocoding](https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer), verificando via, civico e città. Le risposte complete e gli URL di ciascuna ricerca sono conservati in `arcgis.json`; `plan.json` associa le fonti ai record. Punteggio 100 per 14 indirizzi e 93,55 per Vicolo de’ Cinque, la cui via e numero corrispondono ma il CAP differisce.

Il controllo preliminare con [Nominatim/OpenStreetMap](https://nominatim.org/release-docs/latest/api/Search/) è conservato in `geocoding.json`. Diversi risultati riguardavano solo la strada o località diverse: non sono stati usati per assegnare coordinate ai civici. Per Via Santamaura 49 il punto ArcGIS è inoltre coerente con il [portale ufficiale Turismo Roma](https://www.turismoroma.it/en/hospitality/vatican-comfort-suites-guest-house-o-affittacamere-0), che riporta lo stesso indirizzo con coordinate 41.90866993, 12.45353845. Il vecchio valore nel database era circa 185 metri più a ovest.

Gli appartamenti con lo stesso indirizzo Vicolo del Curato 12 ricevono lo stesso punto, anche dove il CAP è differente.

## Correzioni CAP incluse nello script SQL

- PK 3, MARIEL APARTMENT: Vicolo de’ Cinque 57. CAP nel database **00158**, corrispondenza geocoder **00153**.
- PK 98, Coronari Collection Deluxe: Vicolo del Curato 12. CAP nel database **00187**, corrispondenza geocoder e altri record dello stesso indirizzo **00186**.

Lo script è stato successivamente aggiornato su richiesta per correggere anche questi due CAP. La variante con correzione CAP è stata verificata su tabelle temporanee, ma non eseguita sul database locale né sulla produzione. Gli snapshot e `rollback_locale.sql` documentano l’esecuzione iniziale delle sole coordinate e non includono un ripristino dei CAP.

## Coordinate applicate

| PK | Appartamento | Indirizzo | Latitudine | Longitudine |
|---|---|---|---:|---:|
| 1 | PINDARO | Via Pindaro 106 | 41.7575289 | 12.3666156 |
| 2 | NAVONA & PANTHEON | Via Dei Banchi Nuovi 11 | 41.8996927 | 12.4672596 |
| 3 | MARIEL APARTMENT | Vicolo De' Cinque 57 | 41.8905773 | 12.4692241 |
| 4 | SYLVIA STYLISH | Via Santamaura 49 | 41.9087093 | 12.4535636 |
| 5 | Casa di Agata | Viale Gorgia di Leontini,  330 | 41.7561122 | 12.3533226 |
| 71 | Marylin Apartment Via Della Croce | Via Della Croce 77 | 41.9063684 | 12.4800134 |
| 76 | Agata Vatican Stylish self check-in apartment | Via Aurelia 36 | 41.8998679 | 12.4527672 |
| 77 | Sylvia Apartment in Trastevere | Via Della Scala 15 | 41.8908194 | 12.4683926 |
| 80 | VATICAN DOLCE VITA APARTMENT | Via Germanico 170 | 41.9087689 | 12.4616210 |
| 81 | Curato Collection Art Déco | Vicolo del Curato, 12 | 41.9005767 | 12.4669916 |
| 82 | Navona Chic 56 Apartment | Vicolo Del Governo Vecchio 56 | 41.8983939 | 12.4698358 |
| 85 | Trevi Charming Apartment | Via Della Panetteria 10 | 41.9017099 | 12.4845107 |
| 86 | Navona Boutique Apartment 34 | Via Dell'Orso 34 | 41.9018450 | 12.4736099 |
| 87 | Curato Penthouse | Vicolo Del Curato 12 | 41.9005767 | 12.4669916 |
| 95 | Curato Collection Suite | Vicolo Del Curato 12 | 41.9005767 | 12.4669916 |
| 96 | Navona Style Cozy Apartment | Vicolo Del Governo Vecchio 54 | 41.8983372 | 12.4697989 |
| 97 | Agata Coronari Charming | Via Della Vetrina 24 | 41.9001440 | 12.4696970 |
| 98 | Coronari Collection Deluxe | Vicolo Del Curato 12 | 41.9005767 | 12.4669916 |
| 99 | Coronari Collection Terrace Suite | Vicolo Del Curato 12 | 41.9005767 | 12.4669916 |

## Verifiche

Prima dell'applicazione, lo script è stato eseguito su tabelle temporanee: un indirizzo difforme impedisce tutti gli aggiornamenti; con dati corretti aggiorna i 19 record ed è idempotente. Dopo l'applicazione reale, il confronto completo dello snapshot conferma che tutti i valori previsti sono presenti, gli altri appartamenti sono invariati e nessun campo dell'indirizzo è stato modificato.
