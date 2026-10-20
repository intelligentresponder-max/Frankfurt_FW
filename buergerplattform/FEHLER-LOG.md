# FEHLER-LOG

Format: Symptom · Ursache · Fix · Datum. Einmal gemachte Fehler hier festhalten, damit sie nicht wiederholt werden.

## Aus Prüfprotokoll v1 → v2 (Vorlage)
Siehe Teil 0 der Vorlage: 16 Fehler (zerstörtes JS, falsche Markenfarbe, simulierter Feed, Voting mit „offizieller Hürde“, Upload ohne Backend, fehlender Datenschutz u. a.). Alle in v2 behoben.

## Aus der Recherche am 20.10.2026
- **Mängelmelder-/Beteiligen-URL zuerst „unbestätigt“** · ffm.de blockt Abrufe (HTTP 403) · per Browser-PDF bestätigt · Lehre: bei Bot-Sperre Browser-Nachweis erbitten statt raten.
- **Annahme „Quorumsfunktion ersetzt die 200er-Regel“** · falsch; sie betrifft *Vorhaben* (400 Stimmen/55 Tage), nicht Ideen · korrigiert, Ideen-Regel bleibt „noch prüfen“.
- **Ideenplattform-Fallback `/de/beteiligen`** · inhaltlich falsch (Projekte statt Ideen) · ersetzt durch bestätigte URL `/de/ideenplattform`.
- **ortsbeiraete@stadt-frankfurt.de als Kontakt** · nur für Anträge von Ortsbeiratsmitgliedern · nirgends als Bürgerkontakt verwendet.
- **Links als „[suspicious link removed]“ geliefert** · nicht übernommen · Regel: keine URL ins Repo, die nicht im Browser geöffnet wurde.

## Aus der Umsetzung (20.10.2026)
- **Repo-Wurzel passt nicht zur Vorlage** · Symptom: Wurzel enthält ein Create-React-App-Projekt und eine fremde `index.html` („Energieberater“) · Fix: neue Plattform vollständig in `buergerplattform/`, nichts Bestehendes verändert · Offen: Entscheidung über eigenes Repo (Vorlage Teil 4 Schritt 1) oder Deployment-Pfad, siehe README.
- **Stadtteile der OBR 1–9 und 11–16 unbekannt** · Wikipedia in der Sandbox nicht erreichbar (`ENOTFOUND`); Teil 5 belegt nur OBR 10 · Fix: Felder leer gelassen, `verifiziert: false`, nichts aus dem Gedächtnis ergänzt · Folge: Stadtteil-Suche findet dort nur Ortsbeirat-Namen · TODO im README.
- **Tailwind-CDN in der Sandbox blockiert** (`ERR_TUNNEL_CONNECTION_FAILED`, Folgefehler „tailwind is not defined“ durch das Config-Skript) · Ursache: Sandbox-Proxy, kein Seitenfehler · Folge: Optik, Kontrast und Lighthouse hier **nicht** geprüft · TODO im README. Empfehlung: Tailwind-Build per CLI (kein externer Abruf, Datenschutz besser).
- **Alle Positionstexte `freigegeben: false`** · gewollt (Vorstandsfreigabe fehlt) · Folge: Blog zeigt Leerzustand. Test mit abgefangener JSON-Antwort (alle `true`) zeigte 5 Karten; die Datei selbst wurde nicht verändert.
- **Quiz-Fragen** · ohne Netzzugang keine neuen Fakten prüfbar · Fix: ausschließlich Fakten aus dem geprüften Teil 5 (Quorum, Mängelmelder) verwendet, jeweils mit Quelle. Echte „Bürgerrechte“-Fragen später ergänzen.
