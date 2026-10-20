# CHANGELOG

## 2026-10-20 – 0.2.0
- Tailwind-CDN entfernt, Tailwind 3.4.17 wird lokal gebaut (`npm run build:css` → `assets/tailwind.css`). Keine Drittanbieter-Aufrufe mehr.
- Platzhalterfarbe in Eingabefeldern auf 4,8:1 Kontrast angehoben.
- Datenschutztext: CDN-Abschnitt ersetzt.

## 2026-10-20 – Erste Version (unveröffentlicht)
- Statische Single-Page (Tailwind 3.4.17 gepinnt, Vanilla JS) mit Sektionen Home, Themen, Mitmachen, Mängel, Ideen, Ortsbeiräte, Sitzungen, Quiz.
- Inhalte in `data/*.json` mit Quelle und Stand; `freigegeben: false` wird nicht gerendert.
- Formular im `mailto:`-Modus mit Einwilligung; `FORM_ENDPOINT` für spätere Backend-Anbindung vorbereitet.
- `.ics`-Export (RFC 5545, Europe/Berlin); Ortsbeirat-Auswahl im URL-Hash (`#ortsbeiraete?obr=10`).
- Impressum und Datenschutz als Entwurf mit markierten Pflichtangaben.
