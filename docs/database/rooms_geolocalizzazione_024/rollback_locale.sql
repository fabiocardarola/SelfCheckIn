-- Ripristino dei soli valori lat/lng precedenti del database LOCALE.
-- Non usare come backup della produzione: i valori originari possono essere diversi.
START TRANSACTION;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=1 AND hostPk=3 AND BINARY address=BINARY 'Via Pindaro 106' AND lat=41.7575289 AND lng=12.3666156;
UPDATE rooms SET lat=41.8997221,lng=12.467162 WHERE pk=2 AND hostPk=3 AND BINARY address=BINARY 'Via Dei Banchi Nuovi 11' AND lat=41.8996927 AND lng=12.4672596;
UPDATE rooms SET lat=41.8905557,lng=12.4691382 WHERE pk=3 AND hostPk=3 AND BINARY address=BINARY 'Vicolo De'' Cinque 57' AND lat=41.8905773 AND lng=12.4692241;
UPDATE rooms SET lat=41.9087178,lng=12.4513243 WHERE pk=4 AND hostPk=3 AND BINARY address=BINARY 'Via Santamaura 49' AND lat=41.9087093 AND lng=12.4535636;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=5 AND hostPk=3 AND BINARY address=BINARY 'Viale Gorgia di Leontini,  330' AND lat=41.7561122 AND lng=12.3533226;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=71 AND hostPk=3 AND BINARY address=BINARY 'Via Della Croce 77' AND lat=41.9063684 AND lng=12.4800134;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=76 AND hostPk=3 AND BINARY address=BINARY 'Via Aurelia 36' AND lat=41.8998679 AND lng=12.4527672;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=77 AND hostPk=3 AND BINARY address=BINARY 'Via Della Scala 15' AND lat=41.8908194 AND lng=12.4683926;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=80 AND hostPk=3 AND BINARY address=BINARY 'Via Germanico 170' AND lat=41.9087689 AND lng=12.4616210;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=81 AND hostPk=3 AND BINARY address=BINARY 'Vicolo del Curato, 12' AND lat=41.9005767 AND lng=12.4669916;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=82 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Governo Vecchio 56' AND lat=41.8983939 AND lng=12.4698358;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=85 AND hostPk=3 AND BINARY address=BINARY 'Via Della Panetteria 10' AND lat=41.9017099 AND lng=12.4845107;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=86 AND hostPk=3 AND BINARY address=BINARY 'Via Dell''Orso 34' AND lat=41.9018450 AND lng=12.4736099;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=87 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Curato 12' AND lat=41.9005767 AND lng=12.4669916;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=95 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Curato 12' AND lat=41.9005767 AND lng=12.4669916;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=96 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Governo Vecchio 54' AND lat=41.8983372 AND lng=12.4697989;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=97 AND hostPk=3 AND BINARY address=BINARY 'Via Della Vetrina 24' AND lat=41.9001440 AND lng=12.4696970;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=98 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Curato 12' AND lat=41.9005767 AND lng=12.4669916;
UPDATE rooms SET lat=0.0,lng=0.0 WHERE pk=99 AND hostPk=3 AND BINARY address=BINARY 'Vicolo Del Curato 12' AND lat=41.9005767 AND lng=12.4669916;
COMMIT;
