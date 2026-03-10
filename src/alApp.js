import { useState } from "react";

const T = {
  bg:"#0d0f1a", card:"#13162a", card2:"#1a1e35",
  border:"rgba(255,255,255,0.08)",
  fw:"#f97316", spd:"#e4002b", cdu:"#000000", gruen:"#46962b",
  fdp:"#ffed00", linke:"#be3075", afd:"#009ee0", volt:"#502379",
  text:"#e8eaf0", muted:"#64748b", gold:"#fbbf24",
};

const PARTEIEN = {
  fw:    { name:"FREIE WÄHLER", short:"FW",  col:T.fw,      icon:"🟠" },
  spd:   { name:"SPD",          short:"SPD", col:T.spd,     icon:"🔴" },
  cdu:   { name:"CDU",          short:"CDU", col:"#555",    icon:"⚫" },
  gruen: { name:"GRÜNE",        short:"GRN", col:T.gruen,   icon:"🟢" },
  fdp:   { name:"FDP",          short:"FDP", col:"#c8a700", icon:"🟡" },
  linke: { name:"Linke",        short:"LNK", col:T.linke,   icon:"🟣" },
};

const THEMEN = [
  {
    id:"wohnen", icon:"🏠", title:"Bezahlbares Wohnen",
    jugendrelevanz:"⚡ Sehr relevant – Mieten, WG, erstes eigenes Zuhause",
    positionen:{
      fw:   { pos:"Leerstand aktivieren, Bürokratieabbau beim Bauen, Innenentwicklung vor Außenerweiterung, serielle Bauweise fördern.", versprochen2021:"Mehr Wohnraum durch Nachverdichtung", umgesetzt:"⚠️ Teilweise – Nachverdichtung vorangetrieben, aber Mietpreise weiter gestiegen" },
      spd:  { pos:"Städtisches Wohngeld für mittlere Einkommen (~40.000 Haushalte), mehr kommunaler Wohnungsbau, Mietpreisbremse stärken.", versprochen2021:"30% Sozialwohnungen bei Neubau", umgesetzt:"✅ Teils – Sozialer Wohnanteil erhöht, Ziel nicht vollständig erreicht" },
      cdu:  { pos:"Genehmigungsverfahren beschleunigen, Dachausbauten (15.000 Wohneinheiten Potenzial), Schuldendeckel bei 5 Mrd. €.", versprochen2021:"Wohnbauoffensive 2021–2026", umgesetzt:"⚠️ Teilweise – Genehmigungen schneller, Baukrise bremste Projekte" },
      gruen:{ pos:"Klimaangepasstes Bauen, 100% Sozialquote bei Stadtentwicklung, autofreie Quartiere als Chance.", versprochen2021:"Soziales Wohnen stärken", umgesetzt:"✅ Mehrere Klimaschutzsiedlungen realisiert" },
      fdp:  { pos:"Marktwirtschaft statt Mietstopps, Fast Lanes für internationale Fachkräfte, Standortattraktivität stärken.", versprochen2021:"Deregulierung Wohnungsmarkt", umgesetzt:"❌ Kaum Einfluss – in Opposition" },
      linke:{ pos:"Vergesellschaftung großer Immobilienkonzerne, Mietenstopp, kommunaler Wohnungsbau massiv ausbauen.", versprochen2021:"Mietenstopp und Enteignungen", umgesetzt:"❌ Nicht umgesetzt – fehlende Mehrheiten" },
    }
  },
  {
    id:"verkehr", icon:"🚲", title:"Verkehr & Mobilität",
    jugendrelevanz:"⚡ Relevant – ÖPNV-Tickets, Radwege, Nachtbus",
    positionen:{
      fw:   { pos:"Alle Verkehrsteilnehmer gleichberechtigt, Staustraßen mit Radspuren objektiv prüfen, S-Bahn-Ring langfristig.", versprochen2021:"Ausgewogene Verkehrspolitik", umgesetzt:"⚠️ Gemischt – kein Großprojekt durchgesetzt" },
      spd:  { pos:"ÖPNV vollständig barrierefrei, S-Bahn- und Straßenbahn-Ring, kostenloser ÖPNV als Ziel.", versprochen2021:"365-€-Ticket Frankfurt", umgesetzt:"✅ Deutschlandticket 49€ maßgeblich mitgestaltet" },
      cdu:  { pos:"Autogerechte Stadt mit Radwegen, keine ideologischen Verkehrsexperimente, Staus beseitigen.", versprochen2021:"Verkehrsfluss verbessern", umgesetzt:"⚠️ Teilweise – Ampeloptimierungen, wenig Strukturwandel" },
      gruen:{ pos:"Fahrradstadt Frankfurt, Radschnellwege, Tempolimits, autofreie Innenstadt mittelfristig.", versprochen2021:"100 km neue Radwege", umgesetzt:"✅ 60+ km neue Radinfrastruktur umgesetzt" },
      fdp:  { pos:"Keine Verbote, Wahlfreiheit im Verkehr, gegen Auto-Fahrverbote, digitale Verkehrssteuerung.", versprochen2021:"Smarte Ampelsteuerung", umgesetzt:"⚠️ Pilotprojekte gestartet, kein Flächenrollout" },
      linke:{ pos:"Kostenloser ÖPNV, kein Ausbau für Autos, Radwege Vorrang, Klimanotstand konsequent umsetzen.", versprochen2021:"Kostenloses ÖPNV-Ticket", umgesetzt:"❌ Nicht umgesetzt" },
    }
  },
  {
    id:"bildung", icon:"🎓", title:"Bildung & Jugend",
    jugendrelevanz:"🔥 Direkt betroffen – Schulen, Kitas, Ausbildung, Jugendräume",
    positionen:{
      fw:   { pos:"Weniger Bürokratie in Schulen, Digitalisierung vorantreiben, Jugendliche mehr in Entscheidungen einbeziehen.", versprochen2021:"Digitale Schulausstattung", umgesetzt:"⚠️ Tablets angeschafft, WLAN-Infrastruktur noch lückenhaft" },
      spd:  { pos:"Bildungsgerechtigkeit, kostenlose Kitas ausbauen, Ganztagsschulen für alle, Schulsozialarbeit stärken.", versprochen2021:"Kostenfreie Kita-Plätze", umgesetzt:"✅ Gebührenfreiheit ab 3. Lebensjahr umgesetzt" },
      cdu:  { pos:"Schulbau und Sanierungen bündeln, ungenutzte Liegenschaften für Schulen nutzen, Leistungsorientierung.", versprochen2021:"Schulbauoffensive", umgesetzt:"⚠️ Investitionen gesteigert, Sanierungsstau bleibt groß" },
      gruen:{ pos:"Klimabildung in allen Schulen, mehr Schulsozialarbeit, inklusive Bildung stärken, Jugendparlamente.", versprochen2021:"Klimabildung einführen", umgesetzt:"✅ Klimabildungs-Modellprojekte gestartet" },
      fdp:  { pos:"Bildungsvielfalt, leistungsbetonte Schulen, mehr Wahlmöglichkeiten für Familien, Privatschulen fördern.", versprochen2021:"Schulvielfalt stärken", umgesetzt:"⚠️ Punktuelle Entscheidungen, keine Großreform" },
      linke:{ pos:"Gleiche Bildung für alle unabhängig vom Einkommen, keine Privatschulen fördern, Jugendfreizeitangebote.", versprochen2021:"Freie Bildung für alle", umgesetzt:"❌ In Opposition, nicht umgesetzt" },
    }
  },
  {
    id:"klima", icon:"🌱", title:"Klimaschutz & Umwelt",
    jugendrelevanz:"🔥 Zukunftsthema – Hitze in der Stadt, Parks, Luftqualität",
    positionen:{
      fw:   { pos:"Pragmatische Klimapolitik ohne Verbote, Begrünung fördern, Energieeffizienz in städtischen Gebäuden.", versprochen2021:"Klimaneutrales Frankfurt 2035", umgesetzt:"⚠️ Ziele gesetzt, Umsetzungsgeschwindigkeit kritisch" },
      spd:  { pos:"Fernwärmeausbau, Solaranlagen auf allen Stadtdächern, klimagerechte Stadtentwicklung.", versprochen2021:"Solar-Offensive Frankfurt", umgesetzt:"✅ Solaranlagen auf Schulen und Verwaltungsgebäuden ausgebaut" },
      cdu:  { pos:"Klimaschutz wirtschaftlich denken, Technologieoffenheit, keine Verbote, Effizienzsteigerung.", versprochen2021:"Klimaneutrale Stadtgebäude", umgesetzt:"⚠️ Fortschritte bei Sanierungen, Tempo zu langsam" },
      gruen:{ pos:"Klimanotstand ernst nehmen, 2035 klimaneutral, 30% mehr Grünflächen, Hitzeschutzplan.", versprochen2021:"Klimanotstand ausrufen", umgesetzt:"✅ Klimanotstand beschlossen, Hitzeschutzmaßnahmen eingeleitet" },
      fdp:  { pos:"Innovation statt Verbote, Carbon Capture, marktwirtschaftliche Lösungen, keine Heizverbote.", versprochen2021:"Klimaschutz durch Innovation", umgesetzt:"⚠️ Einige Innovationsprojekte, wenig Durchschlagskraft" },
      linke:{ pos:"Konsequenter Ausstieg aus fossilen Investitionen, grüne Wärme für alle, autofreie Innenstadt.", versprochen2021:"Fossile Investitionen stoppen", umgesetzt:"❌ Nicht in Regierungsverantwortung" },
    }
  },
  {
    id:"sicherheit", icon:"🛡️", title:"Sicherheit & Öffentlicher Raum",
    jugendrelevanz:"⚡ Relevant – Ausgehen, Bahnhofsviertel, sichere Nächte",
    positionen:{
      fw:   { pos:"Sicherheit und Ordnung in allen Stadtteilen, Stadtpolizei stärken, Brennpunkte gezielt angehen.", versprochen2021:"Mehr Stadtpolizei", umgesetzt:"✅ Stadtpolizei aufgestockt, Präsenz erhöht" },
      spd:  { pos:"Soziale Sicherheit zuerst: Hilfsangebote für Suchtgefährdete, Prävention statt Repression.", versprochen2021:"Präventionsprogramme ausbauen", umgesetzt:"✅ Drogenhilfe ausgebaut, Sozialprogramme Bahnhofsviertel" },
      cdu:  { pos:"Videoüberwachung an Brennpunkten, Bodycams für Stadtpolizei, 7-Punkte-Plan Bahnhofsviertel.", versprochen2021:"Videoüberwachung ausbauen", umgesetzt:"✅ Kameras erweitert, 7-Punkte-Plan beschlossen" },
      gruen:{ pos:"Sichere Stadtteile durch soziale Investitionen, keine Überwachungsausweitung, Beleuchtung verbessern.", versprochen2021:"Beleuchtungsoffensive Radwege", umgesetzt:"✅ Beleuchtung an Rad- und Fußwegen verbessert" },
      fdp:  { pos:"Smarte Sicherheit mit Technologie, gegen willkürliche Verbotszonen, Bürgerrechte schützen.", versprochen2021:"Digitale Sicherheitsinfrastruktur", umgesetzt:"⚠️ Pilotprojekte, kein Flächenrollout" },
      linke:{ pos:"Kein Ausbau von Überwachung, Sozialarbeiter statt mehr Polizei, Drogenpolitik reformieren.", versprochen2021:"Keine Überwachungsausweitung", umgesetzt:"❌ In Opposition" },
    }
  },
  {
    id:"demokratie", icon:"🗳️", title:"Demokratie & Beteiligung",
    jugendrelevanz:"🔥 DEIN Thema – Wahlrecht ab 16, Jugendbeteiligung, Mitsprache",
    positionen:{
      fw:   { pos:"Direkte Demokratie stärken, Bürger mehr einbeziehen, Transparenz erhöhen, Informationsfreiheit verbessern.", versprochen2021:"Bürgerbegehren erleichtern", umgesetzt:"✅ Ortsbeiräte gestärkt, Bürgerfragestunden ausgebaut" },
      spd:  { pos:"Jugendparlament stärken, Wahlrecht ab 16 auf kommunaler Ebene unterstützen, Bürgerräte einführen.", versprochen2021:"Wahlrecht ab 16 kommunal", umgesetzt:"⚠️ Diskutiert, noch nicht umgesetzt in Frankfurt" },
      cdu:  { pos:"Stabile repräsentative Demokratie, gegen zu viele Volksabstimmungen, verlässliche Institutionen.", versprochen2021:"Bürgerdialog-Format", umgesetzt:"⚠️ Formate eingeführt, Reichweite begrenzt" },
      gruen:{ pos:"Jugendplenum ausbauen, Klimajugend einbeziehen, Bürgerbeteiligung digital ermöglichen.", versprochen2021:"Digitale Bürgerbeteiligung", umgesetzt:"✅ Online-Beteiligung bei Stadtplanungsprojekten eingeführt" },
      fdp:  { pos:"Starke Zivilgesellschaft, weniger staatliche Eingriffe, freie Meinungsäußerung schützen.", versprochen2021:"Transparenzgesetz Frankfurt", umgesetzt:"⚠️ Transparenzportal verbessert, kein Vollgesetz" },
      linke:{ pos:"Jugendräte mit echten Rechten, Partizipation für alle Altersgruppen, Stadtpolitik von unten.", versprochen2021:"Stadtteil-Demokratiefonds", umgesetzt:"❌ Nicht in Regierungsverantwortung" },
    }
  },
  {
    id:"senioren", icon:"🤝", title:"Senioren & Generationen",
    jugendrelevanz:"🤝 Heute sie – morgen du. Betrifft alle.",
    positionen:{
      fw:   { pos:"Barrierefreie Stadtentwicklung, Begegnungsorte für alle Generationen, pragmatische Pflegelösungen.", versprochen2021:"Barrierefreiheit im ÖPNV", umgesetzt:"⚠️ Teilweise – einzelne Haltestellen barrierefrei ausgebaut" },
      spd:  { pos:"Wohnortnahe Pflegeangebote, Stadtteilzentren fördern, Einsamkeit aktiv bekämpfen.", versprochen2021:"Mehr Pflegeplätze kommunal", umgesetzt:"✅ Stadtteilzentren-Förderung erhöht" },
      cdu:  { pos:"Altengerechtes Wohnen fördern, Digitalkompetenz für Senioren, Sicherheit im öffentlichen Raum.", versprochen2021:"Seniorenbeauftragte stärken", umgesetzt:"⚠️ Beauftragte ernannt, wenig Entscheidungsmacht" },
      gruen:{ pos:"Generationengerechte Stadtentwicklung, Begegnungsorte, Klimaanpassung für vulnerable Gruppen.", versprochen2021:"Hitzeschutz für ältere Menschen", umgesetzt:"✅ Hitzeschutzplan mit Fokus auf ältere Menschen beschlossen" },
      fdp:  { pos:"Eigenverantwortung stärken, digitale Dienste für Senioren, privaten Pflegemarkt fördern.", versprochen2021:"Digitale Angebote für Senioren", umgesetzt:"⚠️ Pilotprojekte, keine Flächenwirkung" },
      linke:{ pos:"Pflege als kommunale Aufgabe, keine Privatisierung, kostenloser ÖPNV auch für Senioren.", versprochen2021:"Kostenloser ÖPNV für Senioren", umgesetzt:"❌ Nicht in Regierungsverantwortung" },
    }
  },
];

const WAHLSYSTEM_FAKTEN = [
  { icon:"🗳️", titel:"Du hast VIELE Stimmen!", text:"Bei der Kommunalwahl hast du so viele Stimmen wie Sitze zu vergeben sind – z.B. 37 Stimmen für die Stadtverordnetenversammlung." },
  { icon:"🔀", titel:"Panaschieren", text:"Du kannst deine Stimmen auf Kandidaten verschiedener Parteien verteilen. CDU hier, GRÜNE da – alles erlaubt!" },
  { icon:"🎯", titel:"Kumulieren", text:"Du kannst einer Person bis zu 3 Stimmen geben, wenn dir jemand besonders gut gefällt." },
  { icon:"⏰", titel:"Wann?", text:"Sonntag, 15. März 2026 – 8:00 bis 18:00 Uhr. Oder jetzt sofort per Briefwahl!" },
  { icon:"📍", titel:"Was wird gewählt?", text:"Stadtverordnetenversammlung, Ortsbeiräte, Kreistag und Ausländerbeirat." },
  { icon:"🏙️", titel:"Lokale Macht", text:"Die Stadtverordnetenversammlung entscheidet über Schulen, Verkehr, Parks, Wohnbau und das Milliardenbudget Frankfurts." },
];

const ZIELGRUPPE_JUNG = {
  id:"young_14_35", label:"14–35 Jahre", icon:"⚡", color:T.fw,
  hooks:[
    "Du wohnst in Frankfurt und bist unter 35? Dann geht dich das hier direkt was an.",
    "37 Stimmen bei der Kommunalwahl?! Ja, du hast richtig gehört.",
    "Kurze Frage: Wer bezahlt eigentlich, wenn deine Miete durch die Decke geht?",
    "Wenn du nachts durch Frankfurt läufst – fühlst du dich safe?",
    "Politik ist langweilig? Nicht wenn sie über deine Miete, deinen Bus und deine Schule entscheidet.",
    "Du willst nicht 60% deines Einkommens für Miete zahlen? Dann lies weiter.",
  ],
  ctas:[
    "15. März, 8–18 Uhr. Perso einpacken, 10 Minuten einplanen, fertig.",
    "Schick das an zwei Leute, die auch in Frankfurt wählen dürfen.",
    "Check kurz die Themen-Übersicht – dauert 3 Minuten.",
    "Deine Stimme zählt – besonders weil viele in deinem Alter nicht hingehen.",
  ],
  argumente:[
    { thema:"wohnen",     argument:"Die Stadt entscheidet direkt, wie viel günstiger Wohnraum in Neubauten sein muss – das betrifft jede WG-Suche in Frankfurt.", beispiel:"30% Sozialquote bei Neubau = mehr bezahlbare Wohnungen in neuen Stadtteilen." },
    { thema:"verkehr",    argument:"Ob der Nachtbus fährt, wie oft und wohin – das beschließt die Stadtverordnetenversammlung im Budget.", beispiel:"Mehr Nachtlinien = sicherer nach Hause kommen ohne teures Taxi." },
    { thema:"klima",      argument:"Frankfurt wird heißer. Parks, Bäume, Grünflächen: Die Stadt entscheidet, was sie schützt und was zubetoniert wird.", beispiel:"Mehr Stadtbäume senken die Temperatur im Sommer spürbar." },
    { thema:"bildung",    argument:"Ob Schulen digital ausgestattet sind und Kitas kostenfrei – entscheidet die Kommunalpolitik.", beispiel:"Ein digitales Bürgerportal spart dir Urlaubstage beim Ummelden." },
    { thema:"demokratie", argument:"Mit Kumulieren und Panaschieren kannst du direkt bestimmte Kandidaten stärken – egal welcher Partei.", beispiel:"Du gibst 3 Stimmen einer Person, die dir besonders wichtig ist." },
    { thema:"sicherheit", argument:"Ob Nachtbusse fahren, Parks beleuchtet sind und Stadtpolizei präsent ist – alles kommunale Entscheidungen.", beispiel:"Gut beleuchtete Wege und Plätze erhöhen das Sicherheitsgefühl nachts deutlich." },
  ],
};

const ZIELGRUPPE_SENIOR = {
  id:"senior_55_plus", label:"55+ & Generationen", icon:"🤝", color:T.gold,
  hooks:[
    "Heute betrifft es deine Großeltern – in 30 Jahren bist du es selbst.",
    "Barrierefreie Busse helfen älteren Menschen – und dir mit Kinderwagen oder Koffer.",
    "Ob ältere Menschen einsam sind oder Teil der Nachbarschaft – das ist keine Schicksalsfrage, sondern Politik.",
    "Wohnortnahe Ärzte, Aufzüge, sichere Bürgersteige – entscheidet Frankfurt lokal.",
  ],
  ctas:[
    "Frag deine Eltern oder Großeltern, was sie in ihrem Stadtteil brauchen.",
    "Nimm jemanden älteren mit zum Wählen – am 15. März.",
    "Zeig diesen Screen deiner Familie – jede Stimme zählt.",
  ],
  argumente:[
    { thema:"senioren",   argument:"Die Stadt entscheidet, ob Haltestellen, Ämter und neue Gebäude barrierefrei sind.", beispiel:"Ein Aufzug an der S-Bahn-Station ermöglicht älteren Menschen, selbstständig mobil zu bleiben." },
    { thema:"sicherheit", argument:"Mehr Beleuchtung, sichere Fußwege und Stadtpolizei – finanziert vom Stadtparlament.", beispiel:"Gut beleuchtete Parks und Wege erhöhen das Sicherheitsgefühl für alle Altersgruppen." },
    { thema:"wohnen",     argument:"Frankfurt kann altersgerechte Wohnungen im sozialen Wohnungsbau vorschreiben und Umbauförderung anbieten.", beispiel:"Bodengleiche Duschen, breite Türen, Aufzüge – das schreibt die Stadt bei Neubau vor." },
    { thema:"verkehr",    argument:"Barrierefreier ÖPNV und sichere Haltestellen sind kommunale Entscheidungen.", beispiel:"Niederflurige Busse und taktile Leitsysteme an Haltestellen helfen täglich tausenden Menschen." },
    { thema:"demokratie", argument:"Seniorenbeauftragte und Stadtteilzentren – ihre Stärke entscheidet das Stadtparlament.", beispiel:"Mehr Mittel für Stadtteilzentren bedeutet mehr Begegnung, weniger Einsamkeit." },
  ],
};

function generateTikTokContent(themaId, zielgruppeId) {
  const thema = THEMEN.find(t => t.id === themaId);
  const zg = zielgruppeId === "young_14_35" ? ZIELGRUPPE_JUNG : ZIELGRUPPE_SENIOR;
  const arg = zg.argumente.find(a => a.thema === themaId) || zg.argumente[0];
  const hook = zg.hooks[Math.floor(Math.random() * zg.hooks.length)];
  const cta  = zg.ctas[Math.floor(Math.random() * zg.ctas.length)];
  const caption = `${thema.icon} ${thema.title}\n\n${hook}\n\n${arg.argument}\n\n📍 ${arg.beispiel}\n\n👉 ${cta}`;
  const hashtags = [
    "#Kommunalwahl2026","#Frankfurt","#FREIEWÄHLERFrankfurt",
    `#${thema.id}`,"#Stadtpolitik","#WahlFrankfurt",
    zielgruppeId === "young_14_35" ? "#Erstwähler" : "#Generationen",
    "#Demokratie",
  ].join(" ");
  return { hook, argument:arg.argument, beispiel:arg.beispiel, cta, caption, hashtags };
}

async function askClaude(prompt) {
  try {
    const res = await fetch("http://localhost:5001/api/ask", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ question: prompt }),
    });
    const data = await res.json();
    return data.answer || "Keine Antwort erhalten.";
  } catch {
    return "⚠️ Backend nicht erreichbar. Läuft der Server auf Port 5001?";
  }
}

const inp = { background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, color:"#e8eaf0", padding:"12px 16px", width:"100%", fontSize:14, boxSizing:"border-box" };

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function NavBar({ tab, setTab }) {
  const tabs = [["home","🏠"],["themen","📋"],["vergleich","⚖️"],["wahlcheck","🗳️"],["tiktok","🎬"],["fragen","💬"]];
  return (
    <div style={{ position:"sticky", top:0, zIndex:100, background:T.card,
      borderBottom:"1px solid "+T.border, display:"flex",
      justifyContent:"space-around", padding:"8px 0", overflowX:"auto" }}>
      {tabs.map(([k,ic])=>(
        <button key={k} onClick={()=>setTab(k)} style={{
          background:"none", border:"none", cursor:"pointer",
          color:tab===k?T.fw:T.muted, fontSize:20, padding:"4px 8px", minWidth:44,
          borderBottom:tab===k?`2px solid ${T.fw}`:"2px solid transparent" }}>
          {ic}
        </button>
      ))}
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div style={{ padding:20 }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🗳️</div>
        <div style={{ fontSize:24, fontWeight:900, color:"#fff", lineHeight:1.2, marginBottom:8 }}>
          Deine Stimme.<br/>Deine Stadt.
        </div>
        <div style={{ fontSize:14, color:T.muted, marginBottom:16 }}>Frankfurt · 15. März 2026 · Kommunalwahl</div>
        <div style={{ background:`${T.fw}18`, border:`1px solid ${T.fw}44`, borderRadius:12, padding:14, textAlign:"left" }}>
          <div style={{ color:T.fw, fontWeight:800, fontSize:13, marginBottom:6 }}>⚡ Warum diese Wahl besonders ist</div>
          <div style={{ color:"#e8eaf0", fontSize:13, lineHeight:1.6 }}>
            <b style={{ color:"#fff" }}>260.000 junge Menschen</b> in Hessen wählen erstmals kommunal.
            Die Kommunalwahl bestimmt, was in deinem Viertel passiert – Mieten, Busse, Parks, Schulen.
            Hier gilt: <b style={{ color:T.fw }}>Jede Stimme zählt direkt.</b>
          </div>
        </div>
      </div>

      <div style={{ background:T.card2, borderRadius:14, padding:16, marginBottom:20, textAlign:"center", border:`1px solid ${T.border}` }}>
        <div style={{ fontSize:12, color:T.muted, marginBottom:6, textTransform:"uppercase" }}>Wahltermin</div>
        <div style={{ fontSize:28, fontWeight:900, color:T.fw }}>Sonntag, 15. März 2026</div>
        <div style={{ fontSize:13, color:T.muted, marginTop:4 }}>8:00 – 18:00 Uhr · Briefwahl bereits möglich</div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:800, color:"#e8eaf0", marginBottom:12, textTransform:"uppercase", letterSpacing:0.5 }}>Das solltest du wissen</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {WAHLSYSTEM_FAKTEN.map((f,i)=>(
            <div key={i} style={{ background:T.card2, borderRadius:10, padding:12, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:22, marginBottom:6 }}>{f.icon}</div>
              <div style={{ fontSize:12, fontWeight:800, color:"#fff", marginBottom:4 }}>{f.titel}</div>
              <div style={{ fontSize:11, color:T.muted, lineHeight:1.5 }}>{f.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:`${T.fw}10`, border:`1px solid ${T.fw}33`, borderRadius:14, padding:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:T.fw, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🟠</div>
          <div>
            <div style={{ color:T.fw, fontWeight:900, fontSize:15 }}>FREIE WÄHLER Frankfurt</div>
            <div style={{ color:T.muted, fontSize:11 }}>Bürgerlich · Pragmatisch · Unabhängig</div>
          </div>
        </div>
        <div style={{ fontSize:12, color:"#e8eaf0", lineHeight:1.7 }}>
          <b style={{ color:"#fff" }}>Spitzenkandidat:</b> Eric Pärisch<br/>
          <b style={{ color:"#fff" }}>Motto:</b> „Pragmatische Lösungen statt ideologischer Grabenkämpfe"<br/>
          <b style={{ color:"#fff" }}>Kernthemen FREIE WÄHLER:</b> Wohnen · Sicherheit · Wirtschaft · Digitalisierung
        </div>
        <div style={{ marginTop:10, display:"flex", gap:8, flexWrap:"wrap" }}>
          {["Bezahlbares Wohnen","Stadtpolizei stärken","Weniger Bürokratie","Direkte Demokratie"].map(t=>(
            <span key={t} style={{ background:`${T.fw}22`, color:T.fw, border:`1px solid ${T.fw}44`, borderRadius:6, padding:"3px 8px", fontSize:10, fontWeight:700 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── THEMEN ────────────────────────────────────────────────────────────────────
function ThemenPage() {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("alle");
  const thema = THEMEN.find(t=>t.id===selected);
  return (
    <div style={{ padding:20 }}>
      {view==="alle" ? (
        <>
          <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>📋 Themen</div>
          <div style={{ fontSize:12, color:T.muted, marginBottom:16 }}>Was entscheidet die Kommunalwahl?</div>
          {THEMEN.map(t=>(
            <div key={t.id} onClick={()=>{ setSelected(t.id); setView("detail"); }}
              style={{ background:T.card2, borderRadius:12, padding:14, marginBottom:10, cursor:"pointer", border:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:28 }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ color:"#fff", fontWeight:800, fontSize:14 }}>{t.title}</div>
                <div style={{ color:T.muted, fontSize:11, marginTop:2 }}>{t.jugendrelevanz}</div>
              </div>
              <div style={{ color:T.muted }}>›</div>
            </div>
          ))}
        </>
      ) : thema ? (
        <>
          <button onClick={()=>setView("alle")} style={{ background:"none", border:"none", color:T.fw, cursor:"pointer", fontSize:13, padding:"0 0 12px 0", fontWeight:700 }}>← Zurück</button>
          <div style={{ fontSize:24, marginBottom:4 }}>{thema.icon}</div>
          <div style={{ fontSize:20, fontWeight:900, color:"#fff", marginBottom:4 }}>{thema.title}</div>
          <div style={{ fontSize:12, color:T.gold, marginBottom:20 }}>{thema.jugendrelevanz}</div>
          {Object.entries(thema.positionen).map(([pid,pos])=>{
            const p = PARTEIEN[pid];
            return (
              <div key={pid} style={{ background:T.card2, borderRadius:12, padding:14, marginBottom:12, border:`1px solid ${p.col}33` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ background:`${p.col}22`, color:p.col, border:`1px solid ${p.col}44`, borderRadius:6, padding:"3px 10px", fontSize:11, fontWeight:800 }}>{p.icon} {p.name}</span>
                </div>
                <div style={{ fontSize:13, color:"#e8eaf0", lineHeight:1.6, marginBottom:10 }}>{pos.pos}</div>
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:10, color:T.muted, textTransform:"uppercase", marginBottom:4 }}>📜 Versprochen 2021</div>
                  <div style={{ fontSize:12, color:"#e8eaf0", marginBottom:6 }}>{pos.versprochen2021}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:pos.umgesetzt.startsWith("✅")?"#4ade80":pos.umgesetzt.startsWith("⚠️")?"#fbbf24":"#f87171" }}>{pos.umgesetzt}</div>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

// ── VERGLEICH ─────────────────────────────────────────────────────────────────
function VergleichPage() {
  const [themaId, setThemaId] = useState("wohnen");
  const [p1, setP1] = useState("fw");
  const [p2, setP2] = useState("gruen");
  const thema = THEMEN.find(t=>t.id===themaId);
  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>⚖️ Direktvergleich</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:16 }}>Zwei Parteien, ein Thema</div>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:6, textTransform:"uppercase" }}>Thema wählen</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {THEMEN.map(t=>(
            <button key={t.id} onClick={()=>setThemaId(t.id)} style={{
              background:themaId===t.id?`${T.fw}22`:"rgba(255,255,255,0.05)",
              color:themaId===t.id?T.fw:T.muted, border:`1px solid ${themaId===t.id?T.fw:T.border}`,
              borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:11, fontWeight:700 }}>
              {t.icon} {t.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {[[p1,setP1],[p2,setP2]].map(([val,setter],i)=>(
          <div key={i} style={{ flex:1 }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>Partei {i+1}</div>
            <select style={{ ...inp, fontSize:13 }} value={val} onChange={e=>setter(e.target.value)}>
              {Object.entries(PARTEIEN).map(([k,v])=><option key={k} value={k}>{v.icon} {v.name}</option>)}
            </select>
          </div>
        ))}
      </div>
      {thema && (
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[p1,p2].map(pid=>{
            const par = PARTEIEN[pid];
            const pos = thema.positionen[pid];
            if(!pos) return null;
            return (
              <div key={pid} style={{ background:T.card2, borderRadius:12, padding:14, border:`2px solid ${par.col}55` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:20 }}>{par.icon}</span>
                  <span style={{ color:par.col, fontWeight:900, fontSize:15 }}>{par.name}</span>
                </div>
                <div style={{ fontSize:13, color:"#e8eaf0", lineHeight:1.7, marginBottom:10 }}>{pos.pos}</div>
                <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:10 }}>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:3 }}>📜 Versprochen 2021: {pos.versprochen2021}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:pos.umgesetzt.startsWith("✅")?"#4ade80":pos.umgesetzt.startsWith("⚠️")?"#fbbf24":"#f87171" }}>{pos.umgesetzt}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── WAHL-CHECK ────────────────────────────────────────────────────────────────
function WahlCheckPage() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const FRAGEN = [
    { id:"miete",    frage:"Die Stadt soll aktiv in den Wohnungsmarkt eingreifen (z.B. Mietpreisbremse, kommunaler Bau).", pro:["spd","linke","gruen"], contra:["fdp","fw"] },
    { id:"auto",     frage:"Autos sollen in der Innenstadt weniger Platz haben – zugunsten von Rad & ÖPNV.", pro:["gruen","linke","spd"], contra:["cdu","fdp","fw"] },
    { id:"security", frage:"Mehr Videoüberwachung und Stadtpolizei für mehr Sicherheit ist der richtige Weg.", pro:["cdu","fw","fdp"], contra:["linke","gruen"] },
    { id:"klima",    frage:"Frankfurt soll bis 2035 klimaneutral sein – auch wenn es Einschränkungen bedeutet.", pro:["gruen","linke","spd"], contra:["cdu","fdp"] },
    { id:"digi",     frage:"Weniger Bürokratie & mehr Digitalisierung haben Vorrang vor sozialen Programmen.", pro:["fdp","fw","cdu"], contra:["linke","spd"] },
    { id:"demo",     frage:"Bürger sollten per direkter Demokratie häufiger abstimmen können.", pro:["fw","gruen","linke"], contra:["cdu","fdp"] },
  ];
  const answer = (id,val) => setAnswers(a=>({...a,[id]:val}));
  const berechne = () => {
    const scores = Object.fromEntries(Object.keys(PARTEIEN).map(k=>[k,0]));
    FRAGEN.forEach(f=>{
      const a = answers[f.id];
      if(a===1)  f.pro.forEach(p=>{ if(scores[p]!==undefined) scores[p]+=2; });
      if(a===0)  { f.pro.forEach(p=>{ if(scores[p]!==undefined) scores[p]-=1; }); f.contra.forEach(p=>{ if(scores[p]!==undefined) scores[p]+=1; }); }
      if(a===-1) f.contra.forEach(p=>{ if(scores[p]!==undefined) scores[p]+=2; });
    });
    setResult(Object.entries(scores).sort((a,b)=>b[1]-a[1]));
  };
  const done = Object.keys(answers).length === FRAGEN.length;
  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>🗳️ Wahl-Check</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:20 }}>6 Fragen – welche Partei passt zu dir?</div>
      {!result ? (
        <>
          {FRAGEN.map((f,i)=>(
            <div key={f.id} style={{ background:T.card2, borderRadius:12, padding:14, marginBottom:14, border:`1px solid ${T.border}` }}>
              <div style={{ fontSize:11, color:T.muted, marginBottom:6 }}>Frage {i+1} / {FRAGEN.length}</div>
              <div style={{ fontSize:14, color:"#fff", fontWeight:700, marginBottom:14, lineHeight:1.5 }}>{f.frage}</div>
              <div style={{ display:"flex", gap:8 }}>
                {[["Ja",1,"#4ade80"],["Egal",0,T.muted],["Nein",-1,"#f87171"]].map(([lb,val,col])=>(
                  <button key={val} onClick={()=>answer(f.id,val)} style={{
                    flex:1, border:`2px solid ${answers[f.id]===val?col:T.border}`,
                    background:answers[f.id]===val?`${col}22`:"transparent",
                    color:answers[f.id]===val?col:T.muted,
                    borderRadius:9, padding:"10px 0", cursor:"pointer", fontWeight:800, fontSize:13 }}>
                    {lb}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button onClick={berechne} disabled={!done} style={{
            width:"100%", background:done?T.fw:"#333", color:done?"#000":"#555",
            border:"none", borderRadius:10, padding:"14px 0", fontWeight:900,
            fontSize:15, cursor:done?"pointer":"not-allowed", marginTop:8 }}>
            {done?"🎯 Ergebnis anzeigen":"Alle Fragen beantworten"}
          </button>
        </>
      ) : (
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:"#fff", marginBottom:16 }}>Dein Ergebnis</div>
          {result.map(([pid,score],i)=>{
            const par = PARTEIEN[pid];
            const max = result[0][1] || 1;
            const pct = Math.max(0, Math.round((score/max)*100));
            return (
              <div key={pid} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:13, color:i===0?"#fff":T.muted, fontWeight:i===0?800:400 }}>{par.icon} {par.name}</span>
                  <span style={{ fontSize:13, color:par.col, fontWeight:800 }}>{pct}%</span>
                </div>
                <div style={{ height:10, background:"rgba(255,255,255,0.06)", borderRadius:5, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:par.col, borderRadius:5 }} />
                </div>
                {i===0 && <div style={{ fontSize:11, color:par.col, fontWeight:700, marginTop:4 }}>⭐ Beste Übereinstimmung</div>}
              </div>
            );
          })}
          <button onClick={()=>{ setAnswers({}); setResult(null); }} style={{
            width:"100%", background:"rgba(255,255,255,0.06)", color:"#e8eaf0",
            border:`1px solid ${T.border}`, borderRadius:10, padding:12,
            cursor:"pointer", fontWeight:700, marginTop:16, fontSize:13 }}>
            🔄 Nochmal
          </button>
        </div>
      )}
    </div>
  );
}

// ── TIKTOK GENERATOR ──────────────────────────────────────────────────────────
function TikTokPage() {
  const [zielgruppe, setZielgruppe] = useState("young_14_35");
  const [themaId, setThemaId] = useState("wohnen");
  const [content, setContent] = useState(null);
  const [copied, setCopied] = useState(false);
  const generate = () => { setContent(generateTikTokContent(themaId, zielgruppe)); setCopied(false); };
  const copy = () => {
    if(content) {
      navigator.clipboard.writeText(content.caption+"\n\n"+content.hashtags);
      setCopied(true); setTimeout(()=>setCopied(false),2000);
    }
  };
  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>🎬 TikTok-Generator</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:20 }}>Content für FREIE WÄHLER Frankfurt – zielgruppengerecht</div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:8, textTransform:"uppercase" }}>Zielgruppe</div>
        <div style={{ display:"flex", gap:10 }}>
          {[ZIELGRUPPE_JUNG, ZIELGRUPPE_SENIOR].map(zg=>(
            <button key={zg.id} onClick={()=>setZielgruppe(zg.id)} style={{
              flex:1, background:zielgruppe===zg.id?`${zg.color}22`:"rgba(255,255,255,0.04)",
              border:`2px solid ${zielgruppe===zg.id?zg.color:T.border}`,
              borderRadius:10, padding:"10px 8px", cursor:"pointer",
              color:zielgruppe===zg.id?zg.color:T.muted, fontWeight:800, fontSize:13 }}>
              {zg.icon} {zg.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:8, textTransform:"uppercase" }}>Thema</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {THEMEN.map(t=>(
            <button key={t.id} onClick={()=>setThemaId(t.id)} style={{
              background:themaId===t.id?`${T.fw}22`:"rgba(255,255,255,0.05)",
              color:themaId===t.id?T.fw:T.muted,
              border:`1px solid ${themaId===t.id?T.fw:T.border}`,
              borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:11, fontWeight:700 }}>
              {t.icon} {t.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>
      <button onClick={generate} style={{
        width:"100%", background:`linear-gradient(135deg,${T.fw} 0%,#d97706 100%)`,
        color:"#000", border:"none", borderRadius:10, padding:"14px 0",
        cursor:"pointer", fontWeight:900, fontSize:15, marginBottom:20,
        boxShadow:"0 4px 12px rgba(249,115,22,0.3)" }}>
        ⚡ Content generieren
      </button>
      {content && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:T.card2, borderRadius:12, padding:14, border:`1px solid ${T.fw}33` }}>
            <div style={{ fontSize:10, color:T.fw, fontWeight:800, marginBottom:6, textTransform:"uppercase" }}>🎣 Hook</div>
            <div style={{ fontSize:14, color:"#fff", fontWeight:700, lineHeight:1.5 }}>{content.hook}</div>
          </div>
          <div style={{ background:T.card2, borderRadius:12, padding:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, fontWeight:800, marginBottom:6, textTransform:"uppercase" }}>💡 Argument</div>
            <div style={{ fontSize:13, color:"#e8eaf0", lineHeight:1.6, marginBottom:8 }}>{content.argument}</div>
            <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, padding:10 }}>
              <div style={{ fontSize:10, color:T.muted, marginBottom:4 }}>📍 Beispiel</div>
              <div style={{ fontSize:12, color:T.gold }}>{content.beispiel}</div>
            </div>
          </div>
          <div style={{ background:T.card2, borderRadius:12, padding:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, fontWeight:800, marginBottom:6, textTransform:"uppercase" }}>👉 Call-to-Action</div>
            <div style={{ fontSize:13, color:"#e8eaf0", fontWeight:700 }}>{content.cta}</div>
          </div>
          <div style={{ background:T.card2, borderRadius:12, padding:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, fontWeight:800, marginBottom:8, textTransform:"uppercase" }}>#️⃣ Hashtags</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {content.hashtags.split(" ").map(h=>(
                <span key={h} style={{ background:`${T.fw}18`, color:T.fw, border:`1px solid ${T.fw}33`, borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:700 }}>{h}</span>
              ))}
            </div>
          </div>
          <div style={{ background:"rgba(0,0,0,0.4)", borderRadius:12, padding:14, border:`1px solid ${T.border}` }}>
            <div style={{ fontSize:10, color:T.muted, fontWeight:800, marginBottom:8, textTransform:"uppercase" }}>📋 Full Caption</div>
            <div style={{ fontSize:12, color:"#e8eaf0", lineHeight:1.7, whiteSpace:"pre-wrap" }}>{content.caption}</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={copy} style={{
              flex:1, background:copied?"#4ade8022":"rgba(255,255,255,0.06)",
              color:copied?"#4ade80":"#e8eaf0",
              border:`1px solid ${copied?"#4ade80":T.border}`,
              borderRadius:10, padding:12, cursor:"pointer", fontWeight:800, fontSize:13 }}>
              {copied?"✅ Kopiert!":"📋 Kopieren"}
            </button>
            <button onClick={generate} style={{
              flex:1, background:`${T.fw}18`, color:T.fw,
              border:`1px solid ${T.fw}44`,
              borderRadius:10, padding:12, cursor:"pointer", fontWeight:800, fontSize:13 }}>
              🔄 Neu
            </button>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(content.caption+"\n\n"+content.hashtags)}`,"_blank")}
              style={{ flex:1, background:"#25D36622", color:"#25D366", border:"1px solid #25D36644", borderRadius:8, padding:10, cursor:"pointer", fontWeight:800, fontSize:12 }}>
              📲 WhatsApp
            </button>
            <button onClick={()=>window.open(`https://t.me/share/url?url=freiewaehler-frankfurt.de&text=${encodeURIComponent(content.caption)}`,"_blank")}
              style={{ flex:1, background:"#0088cc22", color:"#0088cc", border:"1px solid #0088cc44", borderRadius:8, padding:10, cursor:"pointer", fontWeight:800, fontSize:12 }}>
              ✈️ Telegram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FRAGEN ────────────────────────────────────────────────────────────────────
function FragenPage() {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState(null);
  const [loading, setLoading] = useState(false);
  const QUICK = [
    "Was macht der Ortsbeirat genau?",
    "Warum lohnt sich die Kommunalwahl für mich?",
    "Was ist Kumulieren und Panaschieren?",
    "Was haben FREIE WÄHLER Frankfurt bisher erreicht?",
    "Was versprechen die Parteien jungen Menschen?",
    "Was tun die Parteien für Senioren in Frankfurt?",
  ];
  const ask = async (question) => {
    setQ(question); setLoading(true); setAns(null);
    const r = await askClaude(`Frage zur Frankfurter Kommunalwahl 2026: ${question}`);
    setAns(r); setLoading(false);
  };
  return (
    <div style={{ padding:20 }}>
      <div style={{ fontSize:18, fontWeight:900, color:"#fff", marginBottom:4 }}>💬 Deine Fragen</div>
      <div style={{ fontSize:12, color:T.muted, marginBottom:16 }}>KI erklärt Kommunalpolitik verständlich</div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:8, textTransform:"uppercase" }}>Schnellfragen</div>
        {QUICK.map(qk=>(
          <button key={qk} onClick={()=>ask(qk)} style={{
            display:"block", width:"100%", textAlign:"left", background:T.card2,
            border:`1px solid ${T.border}`, borderRadius:9, padding:"10px 14px",
            color:"#e8eaf0", cursor:"pointer", fontSize:13, marginBottom:8 }}>
            💡 {qk}
          </button>
        ))}
      </div>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:11, color:T.muted, marginBottom:8, textTransform:"uppercase" }}>Eigene Frage</div>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ ...inp, flex:1 }} value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Deine Frage zur Kommunalwahl..."
            onKeyDown={e=>e.key==="Enter"&&q&&ask(q)} />
          <button onClick={()=>q&&ask(q)} disabled={!q||loading} style={{
            background:T.fw, color:"#000", border:"none", borderRadius:10,
            padding:"0 16px", cursor:"pointer", fontWeight:800, fontSize:14 }}>→</button>
        </div>
      </div>
      {loading && (
        <div style={{ textAlign:"center", padding:30 }}>
          <div style={{ fontSize:30, marginBottom:8 }}>💭</div>
          <div style={{ color:T.muted, fontSize:13 }}>Denke nach...</div>
        </div>
      )}
      {ans && (
        <div style={{ background:`${T.fw}0c`, border:`1px solid ${T.fw}33`, borderRadius:12, padding:16 }}>
          <div style={{ fontSize:11, color:T.fw, fontWeight:800, marginBottom:8 }}>🤖 KI-Antwort</div>
          <div style={{ fontSize:13, color:"#e8eaf0", lineHeight:1.7 }}>{ans}</div>
        </div>
      )}
      <div style={{ marginTop:24, background:T.card2, borderRadius:12, padding:14, border:`1px solid ${T.border}` }}>
        <div style={{ fontSize:12, fontWeight:800, color:"#fff", marginBottom:8 }}>📲 Teilen & Informieren</div>
        <div style={{ fontSize:12, color:T.muted, marginBottom:12 }}>Zeig deinen Freunden diese App – jede Stimme zählt!</div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>window.open("https://wa.me/?text="+encodeURIComponent("🗳️ Kommunalwahl Frankfurt 15. März – informier dich! FREIE WÄHLER Frankfurt: freiewaehler-frankfurt.de"),"_blank")}
            style={{ flex:1, background:"#25D366", color:"#fff", border:"none", borderRadius:8, padding:10, cursor:"pointer", fontWeight:800, fontSize:12 }}>
            📲 WhatsApp
          </button>
          <button onClick={()=>window.open("https://t.me/share/url?url=freiewaehler-frankfurt.de","_blank")}
            style={{ flex:1, background:"#0088cc", color:"#fff", border:"none", borderRadius:8, padding:10, cursor:"pointer", fontWeight:800, fontSize:12 }}>
            ✈️ Telegram
          </button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"system-ui,sans-serif", maxWidth:480, margin:"0 auto" }}>
      <div style={{ background:T.card, padding:"14px 20px 10px", borderBottom:"1px solid "+T.border, position:"sticky", top:0, zIndex:200 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ color:T.fw, fontWeight:900, fontSize:16 }}>🟠 FREIE WÄHLER Frankfurt</div>
            <div style={{ color:T.muted, fontSize:10 }}>Kommunalwahl · 15. März 2026</div>
          </div>
          <div style={{ background:`${T.fw}22`, color:T.fw, border:`1px solid ${T.fw}44`, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:800 }}>
            v4.4 🔥
          </div>
        </div>
      </div>
      <NavBar tab={tab} setTab={setTab} />
      <div style={{ paddingBottom:40 }}>
        {tab==="home"      && <HomePage />}
        {tab==="themen"    && <ThemenPage />}
        {tab==="vergleich" && <VergleichPage />}
        {tab==="wahlcheck" && <WahlCheckPage />}
        {tab==="tiktok"    && <TikTokPage />}
        {tab==="fragen"    && <FragenPage />}
      </div>
      <div style={{ textAlign:"center", padding:"12px 0 20px", color:T.muted, fontSize:10 }}>
        v4.4 · FREIE WÄHLER Frankfurt · Kommunalwahl 15. März 2026
      </div>
    </div>
  );
}
