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

## Umstellung Tailwind-Build (20.10.2026)
- **Tailwind-CDN (Teil 2 der Vorlage)** · Symptom: Besucher-IP ging an Dritte, in der Sandbox war die Seite ungestylt testbar nicht · Ursache: Play-CDN zur Laufzeit · Fix: lokaler Build, `assets/tailwind.css` eingecheckt · Lehre: Das Play-CDN ist laut Tailwind nicht für Produktion gedacht; Build von Anfang an einplanen.
- **Stolperstein beim Build:** Dynamisch erzeugte Klassen (in `app.js`) werden nur gefunden, wenn `app.js` in `content` der `tailwind.config.js` steht, und nur als vollständige Strings (keine zusammengesetzten Klassennamen). Nach Klassenänderungen CSS neu bauen, sonst fehlen Stile in der Produktion.
- **Platzhaltertext zu hell** · Tailwind-Standard (gray-400) ≈ 2,5:1 · Fix: `#6b7280` (4,8:1) in `src/input.css`.
- **npm audit (7 Funde)** · nur Dev-Abhängigkeiten des Build-Werkzeugs, `--omit=dev`: 0 Funde · bewusst nicht per `audit fix --force` behoben, das würde Tailwind über die gepinnte Version heben.

## Pages-Einrichtung (20.10.2026)
- **Falle: Pages-Quelle „GitHub Actions“ hätte die bestehende Seite ersetzt.** Auf `gh-pages` liegt bereits eine React-Seite. Ein Wechsel der Pages-Quelle oder ein Deploy des ganzen Ordners hätte sie überschrieben · Fix: Workflow schreibt nur nach `gh-pages:/buergerplattform/`.
- **Falle: `npm run deploy` (gh-pages-Paket) leert `gh-pages`** und löscht damit die Bürgerplattform · im README vermerkt; Workflow danach erneut starten.
- **Automatisches Veröffentlichen bewusst vermieden:** Impressum/Datenschutz sind Entwürfe, Positionen nicht freigegeben. Ein Push-Trigger würde unfertige Inhalte öffentlich machen · Workflow nur per `workflow_dispatch`, Startseite mit `noindex`.
- **Nicht getestet:** Der Workflow lief noch nie (kein Actions-Zugriff aus der Sandbox). Erster Lauf ist der Test; Fehler hier eintragen.

## Korrektur Pages-Einrichtung (20.10.2026)
- **Falsche Annahme zur Pages-Quelle** · Symptom: Der Workflow „Bürgerplattform veröffentlichen“ lief nie, die Seite war trotzdem online · Ursache: Ich habe „Pages liefert von `gh-pages`“ aus dem vorhandenen Branch geschlussfolgert und im README als „vermutlich“ vermerkt, statt die Einstellung zu prüfen. Tatsächlich liefert Pages vom Branch `main` (Actions-Läufe „pages build and deployment“ mit `head_branch: main`, `gh-pages` zuletzt im März geändert) · Fix: Workflow entfernt, README korrigiert · Lehre: Pages-Quelle über die Actions-Läufe oder die Seite selbst belegen, bevor Deploy-Mechanik gebaut wird; ein vorhandener `gh-pages`-Branch beweist nichts.
- **Folge, die erst spät auffiel:** Mit der Auslieferung von `main` war die Plattform nach dem Merge von PR #1 öffentlich erreichbar, mit Entwurfs-Rechtstexten. `noindex` kam erst mit PR #3. Lehre: Bei Pages vom Hauptzweig ist jeder Merge eine Veröffentlichung, `noindex` und Entwurfshinweise gehören in den ersten Commit.
- **Bestätigung per PDF-Ausdruck** der Live-Seite (vom Nutzer): Seite lädt, Layout stimmig. Die Buttons erscheinen im Ausdruck ohne Hintergrund; das ist Browser-Druckverhalten (Hintergrundgrafiken aus), kein Fehler.
