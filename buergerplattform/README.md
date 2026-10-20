# Bürgerplattform FREIE WÄHLER Frankfurt

Statische Seite (HTML, Tailwind 3.4.17 per CDN, Vanilla JS). Inhalte kommen aus `data/*.json`, Texte aus `texte/*.md`.
Lokal testen: `python3 -m http.server` in diesem Ordner, dann `http://localhost:8000`.
Kein Tracking, keine Cookies, keine externen Fonts. Details zu Entscheidungen und Fehlern: `FEHLER-LOG.md`.

## Vor Livegang prüfen (TODO)
- [ ] Positionstexte in `data/themen.json` vom Vorstand freigeben (`freigegeben` auf `true`), solange erscheint der Blog leer.
- [ ] Kita-Text gegen die aktuelle Frankfurter Gebührenregelung prüfen (Kita Frankfurt / Stadtschulamt).
- [ ] Freigabe der Logo-Nutzung; Logo `assets/fw-logo-weiss.png` liegt **nicht** vor, die Seite nutzt vorerst einen Textzug.
- [ ] Impressum und Datenschutz: alle `[PFLICHTANGABE …]` ausfüllen, vom Vorstand bzw. Datenschutzbeauftragten freigeben lassen. Hosting-Anbieter und Tailwind-CDN (IP-Übertragung) bewerten, besser auf Tailwind-CLI-Build umstellen.
- [ ] Stadtteile der Ortsbeiräte 1–9 und 11–16 aus offizieller Quelle ergänzen, danach `verifiziert: true`.
- [ ] Sitzungstermine der 16 Ortsbeiräte aus PARLIS in `data/sitzungen.json` übernehmen (Beispieleintrag entfernen).
- [ ] Ideen-Regel (bisher „200 Unterstützer in 8 Wochen“) in den „Häufigen Fragen“ auf ffm.de bestätigen; erst dann eine Zahl nennen.
- [ ] Quiz um echte Bürgerrechte-Fragen mit Quelle erweitern.
- [ ] Alle ffm.de-Links im Browser prüfen (ffm.de blockt curl mit 403, das ist kein Fehler).
- [ ] Lighthouse Accessibility ≥ 95, Kontrast und Layout bei 360 px/1280 px im Browser mit Internet prüfen.
- [ ] Entscheidung Repo/Deployment: Die Repo-Wurzel enthält ein fremdes React-Projekt; ggf. eigenes Repo `fw-frankfurt-buergerplattform` anlegen.

## Prüfergebnis dieser Umsetzung (20.10.2026, Sandbox ohne Internet)
Getestet mit Chromium/Playwright bei 360 px: keine eigenen Konsolenfehler, Filter/Suche, Stadtteil-Suche, Formularvalidierung, Quiz, `.ics`-Download, Hash-State, Stimmungsbild funktionieren; kein horizontaler Scroll. **Nicht prüfbar:** Tailwind-Darstellung (CDN blockiert), Lighthouse, externe Links (`curl -I` nicht möglich). Rechnerisch geprüfter Kontrast: #B85000 auf Weiß 5,0:1, auf #FFF1E4 4,5:1, dunkle Schrift auf #EE7202 6,0:1.

## Phase 2 (nach Vorstandsbeschluss)
EU-gehostetes Formular-Backend für Uploads und echte Stimmenzählung (`FORM_ENDPOINT` in `assets/app.js`).
