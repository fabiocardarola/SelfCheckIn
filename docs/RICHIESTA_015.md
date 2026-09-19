# RICHIESTA 015 — tipo passaporto legacy

Il backend converte `P` in `PASOR` nel campo `documentTypeCode` restituito da
`sci_guests`. Angular riconosce quindi il tipo e mostra PASSAPORTO ORDINARIO.
Anche `sci_guest_save` normalizza `P` in `PASOR`, per gestire form già aperti:
al salvataggio `complaints.doctype` viene registrato come `PASOR`, conservando il pk.
La sola lettura non modifica `doctype` sul database. Non occorre una migrazione.
Gli altri tipi documento mantengono la gestione precedente.

Verifiche: build WAR e test MySQL su tabelle temporanee per conversione in lettura,
salvataggio da un form con codice P, persistenza PASOR e conservazione degli altri codici.
