# RICHIESTA 020 — confronto cod_comuni

Verifica del 19 settembre 2026 sul database locale `gcv@localhost:3306`, in sola lettura. Riferimento vincolante: `docs/tabelle_codici/comuni.csv`.

Confronto `Codice → cod`, `Descrizione → des`, `Provincia → pr`. I codici sono trattati come stringhe. Descrizioni e province confrontate esattamente, senza correggere automaticamente apostrofi, spazi o denominazioni. “Attuali” indica esclusivamente le righe con `DataFineVal` vuota nel CSV; “storici” quelle con `DataFineVal` compilata. Non sono stati consultati elenchi alternativi per sostituire i valori del CSV.

| Controllo | Risultato |
|---|---:|
| Codici univoci nel CSV | 11.294 |
| Senza fine validità nel CSV | 7.898 |
| Storici nel CSV | 3.396 |
| Record nella tabella | 7.980 |
| Codici mancanti nella tabella | 3.314 |
| Mancanti senza fine validità | 155 |
| Mancanti storici | 3.159 |
| Descrizioni diverse a parità di codice | 12 |
| Province diverse a parità di codice | 0 |
| Codici della tabella assenti dal CSV | 0 |
| Codici duplicati nel CSV o nella tabella | 0 |
| Record presenti che il CSV classifica come storici | 237 |

La tabella contiene quindi 7.743 codici attuali e 237 storici. I record storici non sono errori da cancellare: possono essere necessari per identificare il comune di nascita. La tabella attuale non dispone di un campo per `DataFineVal`; il confronto di questo attributo è pertanto solo classificatorio, non una verifica di un campo del database.

Per l’allineamento integrale di codici, descrizioni e province occorrerebbero **3.314 inserimenti e 12 aggiornamenti di descrizione**, senza cancellazioni. Limitandosi alle sole righe senza fine validità sarebbero invece 155 inserimenti e gli stessi 12 aggiornamenti. Nessuno di questi interventi è stato eseguito.

## Descrizioni da adeguare al CSV

| Codice | Database | CSV vincolante | Provincia |
|---|---|---|---|
| 403016031 | BONATE DI SOTTO | BONATE SOTTO | BG |
| 401001032 | BORGONE DI SUSA | BORGONE SUSA | TO |
| 404022079 | DRO' | DRO | TN |
| 420091027 | GALTELLI | GALTELLI' | NU |
| 417077016 | MONTALBANO IONICO | MONTALBANO JONICO | MT |
| 412058060 | MONTECOMPATRI | MONTE COMPATRI | RM |
| 414094029 | MONTENERO VALCOCCHIARA | MONTENERO VAL COCCHIARA | IS |
| 406030090 | REANA DEL ROIALE | REANA DEL ROJALE | UD |
| 418080080 | SANT'ALESSIO D'ASPROMONTE | SANT'ALESSIO IN ASPROMONTE | RC |
| 417077031 | SCANZANO IONICO | SCANZANO JONICO | MT |
| 418079133 | SIMERI E CRICHI | SIMERI CRICHI | CZ |
| 415064109 | TORELLA DE' LOMBARDI | TORELLA DEI LOMBARDI | AV |

## Codici senza fine validità mancanti

2 dei 155 codici mancanti hanno già una voce con identici nome e provincia ma codice diverso nel database. Questa corrispondenza testuale è un ausilio alla revisione: non autorizza a sostituire i codici storici nei dati degli ospiti.

| Codice CSV | Descrizione CSV | Provincia |
|---|---|---|
| 411141001 | ACQUALAGNA | PU |
| 401006192 | ALLUVIONI PIOVERA | AL |
| 408033049 | ALTA VAL TIDONE | PC |
| 401002170 | ALTO SERMENZA | VC |
| 411141002 | APECCHIO | PU |
| 408140001 | BAGNO DI ROMAGNA | FC |
| 405024124 | BARBARANO MOSSANO | VI |
| 409048054 | BARBERINO TAVARNELLE | FI |
| 403012144 | BARDELLO CON MALGESSO E BREGANO | VA |
| 411141005 | BELFORTE ALL'ISAURO | PU |
| 408140003 | BERTINORO | FC |
| 408140004 | BORGHI | FC |
| 404022252 | BORGO D'ANAUNIA | TN |
| 403020072 | BORGO MANTOVANO | MN |
| 411141006 | BORGO PACE | PU |
| 405025074 | BORGO VALBELLUNA | BL |
| 405028107 | BORGO VENETO | PD |
| 403020073 | BORGOCARBONARA | MN |
| 403012143 | CADREZZATE CON OSMATE | VA |
| 411141007 | CAGLI | PU |
| 401005914 | CALLIANO MONFERRATO | AT |
| 403018926 | CAMPOSPINOSO ALBAREDO | PV |
| 411141008 | CANTIANO | PU |
| 415065925 | CAPACCIO PAESTUM | SA |
| 411141009 | CARPEGNA | PU |
| 411141010 | CARTOCETO | PU |
| 401005920 | CASORZO MONFERRATO | AT |
| 401006191 | CASSANO SPINOLA | AL |
| 403098062 | CASTELGERUNDO | LO |
| 401006945 | CASTELLANIA COPPI | AL |
| 408140005 | CASTROCARO TERME E TERRA DEL SOLE | FC |
| 401002171 | CELLIO CON BREIA | VC |
| 403013254 | CENTRO VALLE INTELVI | CO |
| 408140007 | CESENA | FC |
| 408140008 | CESENATICO | FC |
| 408140009 | CIVITELLA DI ROMAGNA | FC |
| 405024126 | COLCERESA | VI |
| 411141069 | COLLI AL METAURO | PU |
| 403018193 | COLLI VERDI | PV |
| 418078157 | CORIGLIANO-ROSSANO | CS |
| 405023930 | COSTERMANO SUL GARDA | VR |
| 408140011 | DOVADOLA | FC |
| 411141013 | FANO | PU |
| 411141014 | FERMIGNANO | PU |
| 406030190 | FIUMICELLO VILLA VICENTINA | UD |
| 408140012 | FORLI' | FC |
| 408140013 | FORLIMPOPOLI | FC |
| 411141015 | FOSSOMBRONE | PU |
| 411141016 | FRATTE ROSA | PU |
| 411141017 | FRONTINO | PU |
| 411141018 | FRONTONE | PU |
| 411141019 | GABICCE MARE | PU |
| 408140014 | GALEATA | FC |
| 408140015 | GAMBETTOLA | FC |
| 408140016 | GATTEO | FC |
| 401003166 | GATTICO-VERUNO | NO |
| 411141020 | GRADARA | PU |
| 401005956 | GRANA MONFERRATO | AT |
| 411141021 | ISOLA DEL PIANO | PU |
| 409051042 | LATERINA PERGINE VALDARNO | AR |
| 408140018 | LONGIANO | FC |
| 401006193 | LU E CUCCARO MONFERRATO | AL |
| 411141022 | LUNANO | PU |
| 405024127 | LUSIANA CONCO | VI |
| 411141023 | MACERATA FELTRIA | PU |
| 408140019 | MELDOLA | FC |
| 411141025 | MERCATELLO SUL METAURO | PU |
| 411141026 | MERCATINO CONCA | PU |
| 408140020 | MERCATO SARACENO | FC |
| 419081025 | MISILISCEMI | TP |
| 408140022 | MODIGLIANA | FC |
| 411141027 | MOMBAROCCIO | PU |
| 411141028 | MONDAVIO | PU |
| 411141029 | MONDOLFO | PU |
| 404021952 | MONGUELFO-TESIDO | BZ |
| 404021953 | MONTAGNA SULLA STRADA DEL VINO | BZ |
| 407008068 | MONTALTO CARPASIO | IM |
| 411141031 | MONTE CERIGNONE | PU |
| 411141935 | MONTE GRIMANO TERME | PU |
| 411141038 | MONTE PORZIO | PU |
| 411141030 | MONTECALVO IN FOGLIA | PU |
| 411099030 | MONTECOPIOLO | RN |
| 411141034 | MONTEFELCINO | PU |
| 411141036 | MONTELABBATE | PU |
| 401005977 | MONTEMAGNO MONFERRATO | AT |
| 408140028 | MONTIANO | FC |
| 401005122 | MORANSENGO-TONENGO | AT |
| 405023952 | NEGRAR DI VALPOLICELLA | VR |
| 404022253 | NOVELLA | TN |
| 411141041 | PEGLIO | PU |
| 411141043 | PERGOLA | PU |
| 411141044 | PESARO | PU |
| 411141045 | PETRIANO | PU |
| 403019116 | PIADENA DRIZZONA | CR |
| 411141047 | PIANDIMELETO | PU |
| 411141048 | PIETRARUBBIA | PU |
| 405026096 | PIEVE DEL GRAPPA | TV |
| 411141049 | PIOBBICO | PU |
| 413068933 | POPOLI TERME | PE |
| 408140031 | PORTICO E SAN BENEDETTO | FC |
| 408140032 | PREDAPPIO | FC |
| 408140033 | PREMILCUORE | FC |
| 416075098 | PRESICCE-ACQUARICA | LE |
| 401096087 | QUAREGNA CERRETO | BI |
| 409049021 | RIO | LI |
| 408038029 | RIVA DEL PO | FE |
| 408140036 | ROCCA SAN CASCIANO | FC |
| 408140037 | RONCOFREDDO | FC |
| 402007964 | SAINT-RHEMY-EN-BOSSES | AO |
| 404021976 | SALORNO SULLA STRADA DEL VINO | BZ |
| 411141051 | SAN COSTANZO | PU |
| 403020957 | SAN GIORGIO BIGARELLO | MN |
| 404022950 | SAN GIOVANNI DI FASSA-SEN JAN | TN |
| 411141054 | SAN LORENZO IN CAMPO | PU |
| 408140041 | SAN MAURO PASCOLI | FC |
| 405028108 | SANTA CATERINA D'ESTE | PD |
| 408140043 | SANTA SOFIA | FC |
| 411141057 | SANT'ANGELO IN VADO | PU |
| 411141058 | SANT'IPPOLITO | PU |
| 405030189 | SAPPADA | UD |
| 408140044 | SARSINA | FC |
| 411141071 | SASSOCORVARO AUDITORE | PU |
| 411099031 | SASSOFELTRIO | RN |
| 408140045 | SAVIGNANO SUL RUBICONE | FC |
| 403020961 | SERMIDE E FELONICA | MN |
| 411141061 | SERRA SANT'ABBONDIO | PU |
| 405025075 | SETTEVILLE | BL |
| 408140046 | SOGLIANO AL RUBICONE | FC |
| 403013255 | SOLBIATE CON CAGNO | CO |
| 404022976 | SORAGA DI FASSA | TN |
| 408034051 | SORBOLO MEZZANI | PR |
| 405024128 | SOVIZZO | VI |
| 411141064 | TAVOLETO | PU |
| 411141065 | TAVULLIA | PU |
| 404022251 | TERRE D'ADIGE | TN |
| 411141070 | TERRE ROVERESCHE | PU |
| 403016215 | TORRE DE' BUSI | BG |
| 408140049 | TREDOZIO | FC |
| 403017989 | TREMOSINE SUL GARDA | BS |
| 406030191 | TREPPO LIGOSULLO | UD |
| 408038030 | TRESIGNANA | FE |
| 404021902 | TRODENA NEL PARCO NATURALE | BZ |
| 403013256 | UGGIATE CON RONAGO | CO |
| 411141066 | URBANIA | PU |
| 411141067 | URBINO | PU |
| 401001317 | VAL DI CHY | TO |
| 405024125 | VALBRENTA | VI |
| 401001318 | VALCHIUSA | TO |
| 401096088 | VALDILANA | BI |
| 401103079 | VALLE CANNOBINA | VB |
| 411141068 | VALLEFOGLIA | PU |
| 403097093 | VALVARRONE | LC |
| 408140050 | VERGHERETO | FC |
| 403015251 | VERMEZZO CON ZELO | MI |
| 404022254 | VILLE DI FIEMME | TN |

## Elenchi completi

- [155 codici attuali mancanti](mancanti_attuali.csv)
- [3.159 codici storici mancanti](mancanti_storici.csv)
- [12 descrizioni diverse](differenze.csv)
- [237 record presenti ma storici secondo il CSV](presenti_storici.csv)
- [Corrispondenze per stesso nome e provincia, con codice diverso](mancanti_con_stesso_nome.csv)
- [Codici presenti solo nel database: nessuno](solo_database.csv)
- [Riepilogo numerico](summary.json)
- [Snapshot della tabella letta](database_snapshot.json)
