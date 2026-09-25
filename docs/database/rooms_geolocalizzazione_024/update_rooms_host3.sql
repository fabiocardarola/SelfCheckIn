-- RICHIESTA 024: coordinate WGS84 e correzioni CAP, solo rooms.hostPk=3.
-- CAP: PK 3 da 00158 a 00153; PK 98 da 00187 a 00186.
-- Eseguire nel database desiderato (nessun USE imposto).
-- Controllo completo: tutti i 19 PK devono avere host e indirizzo attesi.
-- In caso di difformita NON viene aggiornata alcuna riga.
-- Fonte: ArcGIS World Geocoding, corrispondenze PointAddress; vedere REPORT.md.
SET NAMES utf8mb4;
DROP TEMPORARY TABLE IF EXISTS sci_024_rooms_coordinates;
CREATE TEMPORARY TABLE sci_024_rooms_coordinates (
  pk INT PRIMARY KEY, address VARCHAR(500), city VARCHAR(500), cap VARCHAR(20), cap_corretto VARCHAR(20),
  lat DOUBLE, lng DOUBLE
);
INSERT INTO sci_024_rooms_coordinates(pk,address,city,cap,lat,lng) VALUES
(1,'Via Pindaro 106','Roma','00125',41.7575289,12.3666156),
(2,'Via Dei Banchi Nuovi 11','Roma','00186',41.8996927,12.4672596),
(3,'Vicolo De'' Cinque 57','Roma','00158',41.8905773,12.4692241),
(4,'Via Santamaura 49','Roma','00192',41.9087093,12.4535636),
(5,'Viale Gorgia di Leontini,  330','Roma','00124',41.7561122,12.3533226),
(71,'Via Della Croce 77','Roma','00187',41.9063684,12.4800134),
(76,'Via Aurelia 36','Roma','00165',41.8998679,12.4527672),
(77,'Via Della Scala 15','Roma','00153',41.8908194,12.4683926),
(80,'Via Germanico 170','Roma','00192',41.9087689,12.4616210),
(81,'Vicolo del Curato, 12','Roma','00186',41.9005767,12.4669916),
(82,'Vicolo Del Governo Vecchio 56','Roma','00186',41.8983939,12.4698358),
(85,'Via Della Panetteria 10','Roma','00187',41.9017099,12.4845107),
(86,'Via Dell''Orso 34','Roma','00186',41.9018450,12.4736099),
(87,'Vicolo Del Curato 12','Roma','00186',41.9005767,12.4669916),
(95,'Vicolo Del Curato 12','Roma','00186',41.9005767,12.4669916),
(96,'Vicolo Del Governo Vecchio 54','Roma','00186',41.8983372,12.4697989),
(97,'Via Della Vetrina 24','Roma','00186',41.9001440,12.4696970),
(98,'Vicolo Del Curato 12','Roma','00187',41.9005767,12.4669916),
(99,'Vicolo Del Curato 12','Roma','00186',41.9005767,12.4669916);
-- Mantiene gli altri CAP; accetta sia il valore originario sia quello gia corretto.
UPDATE sci_024_rooms_coordinates
SET cap_corretto=CASE pk WHEN 3 THEN '00153' WHEN 98 THEN '00186' ELSE cap END;
START TRANSACTION;
-- Blocca i record durante verifica e aggiornamento.
SELECT r.pk FROM rooms r JOIN sci_024_rooms_coordinates e ON r.pk=e.pk FOR UPDATE;
SELECT COUNT(*) INTO @sci024_matching FROM rooms r
JOIN sci_024_rooms_coordinates e ON r.pk=e.pk AND r.hostPk=3 AND BINARY r.address=BINARY e.address AND BINARY r.city=BINARY e.city AND (BINARY r.cap=BINARY e.cap OR BINARY r.cap=BINARY e.cap_corretto);
SELECT @sci024_matching AS indirizzi_verificati, 19 AS indirizzi_attesi;
-- Eventuali righe mancanti o con indirizzo/host differente:
SELECT e.pk AS pk_non_corrispondente, e.address AS indirizzo_atteso
FROM sci_024_rooms_coordinates e LEFT JOIN rooms r ON r.pk=e.pk AND r.hostPk=3 AND BINARY r.address=BINARY e.address AND BINARY r.city=BINARY e.city AND (BINARY r.cap=BINARY e.cap OR BINARY r.cap=BINARY e.cap_corretto)
WHERE r.pk IS NULL;
UPDATE rooms r JOIN sci_024_rooms_coordinates e ON r.pk=e.pk AND r.hostPk=3 AND BINARY r.address=BINARY e.address AND BINARY r.city=BINARY e.city AND (BINARY r.cap=BINARY e.cap OR BINARY r.cap=BINARY e.cap_corretto)
SET r.lat=e.lat, r.lng=e.lng, r.cap=e.cap_corretto
WHERE @sci024_matching=19;
SELECT ROW_COUNT() AS righe_modificate,
       IF(@sci024_matching=19,'OK: 19 indirizzi verificati (script rieseguibile)',
          'NON APPLICATO: correggere le difformita prima di riprovare') AS esito;
COMMIT;
SELECT r.pk,r.description,r.address,r.city,r.cap,r.lat,r.lng
FROM rooms r JOIN sci_024_rooms_coordinates e ON r.pk=e.pk WHERE r.hostPk=3 ORDER BY r.pk;
DROP TEMPORARY TABLE sci_024_rooms_coordinates;
