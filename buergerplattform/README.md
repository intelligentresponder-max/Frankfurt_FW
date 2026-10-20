# Bürgerplattform FREIE WÄHLER Frankfurt

Statische Seite (HTML, Tailwind 3.4.17 lokal gebaut, Vanilla JS). Inhalte kommen aus `data/*.json`, Texte aus `texte/*.md`.
Lokal testen: `python3 -m http.server` in diesem Ordner, dann `http://localhost:8000`.

**CSS bauen:** `npm install` und `npm run build:css` erzeugen `assets/tailwind.css` (wird eingecheckt, damit GitHub Pages ohne Build auskommt). Nach jeder Änderung an Klassen in `*.html`, `assets/app.js` oder `assets/legal.js` neu bauen und die Datei mitcommitten. Tailwind ist auf 3.4.17 gepinnt. `npm audit` meldet 7 Funde ausschließlich in Build-Werkzeugen (Dev-Abhängigkeiten, 0 bei `--omit=dev`); sie gelangen nicht in die ausgelieferte Seite.
Kein Tracking, keine Cookies, keine externen Fonts. Details zu Entscheidungen und Fehlern: `FEHLER-LOG.md`.

## Veröffentlichen (GitHub Pages)
Die Seite wird in den Branch `gh-pages` unter `/buergerplattform/` kopiert, die dort liegende React-Seite bleibt unberührt. Adresse nach dem ersten Lauf: `https://intelligentresponder-max.github.io/Frankfurt_FW/buergerplattform/`.
1. Einmalig prüfen: Repo → Settings → Pages → Source = „Deploy from a branch“, Branch `gh-pages`, Ordner `/ (root)` (steht vermutlich schon so).
2. Repo → Actions → „Bürgerplattform veröffentlichen“ → Run workflow. Der Lauf baut das CSS neu und bricht ab, wenn `assets/tailwind.css` veraltet ist oder ein JSON ungültig ist.
3. Der Workflow läuft bewusst nur manuell, nie automatisch bei Push.

**Achtung:** `npm run deploy` im Repo-Root (gh-pages-Paket der React-Seite) leert den Branch `gh-pages` und würde `/buergerplattform/` löschen. Danach den Workflow erneut starten.

**Indexierung:** `index.html` trägt `noindex`, Impressum/Datenschutz ebenso. Beim Livegang das Meta-Tag in `index.html` entfernen, aber erst, wenn die TODO-Liste unten leer ist.

## Vor Livegang prüfen (TODO)
- [ ] Positionstexte in `data/themen.json` vom Vorstand freigeben (`freigegeben` auf `true`), solange erscheint der Blog leer.
- [ ] Kita-Text gegen die aktuelle Frankfurter Gebührenregelung prüfen (Kita Frankfurt / Stadtschulamt).
- [ ] Freigabe der Logo-Nutzung; Logo `assets/fw-logo-weiss.png` liegt **nicht** vor, die Seite nutzt vorerst einen Textzug.
- [ ] Impressum und Datenschutz: alle `[PFLICHTANGABE …]` ausfüllen, vom Vorstand bzw. Datenschutzbeauftragten freigeben lassen. Hosting-Anbieter bewerten (Tailwind-CDN ist entfernt, die Seite lädt keine Drittinhalte).
- [ ] Stadtteile der Ortsbeiräte 1–9 und 11–16 aus offizieller Quelle ergänzen, danach `verifiziert: true`.
- [ ] Sitzungstermine der 16 Ortsbeiräte aus PARLIS in `data/sitzungen.json` übernehmen (Beispieleintrag entfernen).
- [ ] Ideen-Regel (bisher „200 Unterstützer in 8 Wochen“) in den „Häufigen Fragen“ auf ffm.de bestätigen; erst dann eine Zahl nennen.
- [ ] Quiz um echte Bürgerrechte-Fragen mit Quelle erweitern.
- [ ] Alle ffm.de-Links im Browser prüfen (ffm.de blockt curl mit 403, das ist kein Fehler).
- [ ] Lighthouse Accessibility ≥ 95 im Browser prüfen (Layout bei 360 px/1280 px per Screenshot geprüft, siehe unten).
- [ ] `noindex` in `index.html` entfernen (erst beim Livegang).
- [ ] Entscheidung Repo: Die Repo-Wurzel enthält ein fremdes React-Projekt; ggf. eigenes Repo `fw-frankfurt-buergerplattform` anlegen, dann Pages direkt dort einrichten.

## Prüfergebnis dieser Umsetzung (20.10.2026, Sandbox ohne Internet)
Getestet mit Chromium/Playwright bei 360 px: keine eigenen Konsolenfehler, Filter/Suche, Stadtteil-Suche, Formularvalidierung, Quiz, `.ics`-Download, Hash-State, Stimmungsbild funktionieren; kein horizontaler Scroll. **Nicht prüfbar:** Lighthouse, externe Links (`curl -I` nicht möglich). Nach Umstellung auf lokalen Tailwind-Build (0.2.0) per Screenshot bei 360 px und 1280 px gesichtet: Darstellung stimmig, keine Konsolenfehler, kein horizontaler Scroll. Rechnerisch geprüfter Kontrast: #B85000 auf Weiß 5,0:1, auf #FFF1E4 4,5:1, dunkle Schrift auf #EE7202 6,0:1.

## Phase 2 (nach Vorstandsbeschluss)
EU-gehostetes Formular-Backend für Uploads und echte Stimmenzählung (`FORM_ENDPOINT` in `assets/app.js`).
