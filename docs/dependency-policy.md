# Abhängigkeits-Richtlinie

Ziel: so wenig Fremdcode wie nötig. Eine Abhängigkeit wird nur behalten, wenn sie ihren Platz verdient.

Die Richtlinie ist vom Projekt jmanico/trim-reaper (MIT, Copyright 2026 Jim Manico) inspiriert: https://github.com/jmanico/trim-reaper. Die Formulierungen hier sind eigene und auf dieses Projekt zugeschnitten.

## Stand dieses Projekts

- **Laufzeit:** keine npm-Pakete. Chart.js 4.4.1 kommt per CDN (cdnjs), Supabase läuft über `fetch` gegen die REST-API.
- **Entwicklung:** `@playwright/test` und `http-server` (nur in `devDependencies`, nicht im ausgelieferten Code).
- **Build:** keiner. Das Projekt ist Vanilla JS (siehe CLAUDE.md).

## Regeln für neue Abhängigkeiten

1. **Erst prüfen, ob es ohne geht.** Standardbibliothek oder Browser-API zuerst. Eine Funktion mit 10 Zeilen ist meist billiger als ein Paket.
2. **Sicherheitskritisches nicht selbst bauen.** Kryptografie, Authentifizierung und komplexes Parsen bleiben bei etablierten Bibliotheken.
3. **Transitive Abhängigkeiten ansehen.** Vor dem Hinzufügen oder Upgraden prüfen, was das Paket zusätzlich mitzieht (`npm ls <paket>`).
4. **Name und Herausgeber verifizieren.** Paketnamen gegen die offizielle Quelle prüfen, nicht aus dem Gedächtnis übernehmen.
5. **Lizenz, Pflege und Sicherheitshinweise prüfen.** `npm audit`, Lizenz im Paket, letzte Veröffentlichung.
6. **CDN-Skripte immer mit fester Version einbinden**, nie `latest` oder ohne Versionsnummer.
7. **Entwicklungs-Abhängigkeiten nicht ausliefern.** Tools für Tests und lokalen Server bleiben in `devDependencies`.
8. **Änderungen klein halten.** Ein Paket pro Schritt, mit Build- und Test-Lauf davor und danach (`npm run test:e2e`).

## Abbau bestehender Abhängigkeiten (bei Bedarf)

Wenn du aufräumen willst, in dieser Reihenfolge prüfen:

1. Ungenutzte Pakete entfernen.
2. Pakete durch Standardfunktionen ersetzen, wo das gleichwertig ist.
3. Kleine Hilfsfunktionen lokal ausschreiben.
4. Überlappende Bibliotheken zusammenführen.
5. Transitive Last verringern.
6. Entwicklungsabhängigkeiten von der Auslieferung trennen.
7. Größere Ersetzungen nur mit klarem Nutzen.
8. Ergebnis verifizieren: Tests grün, Verhalten unverändert, Ergebnis dokumentieren.

Hinweis: Wer ein Paket entfernt, übernimmt dessen Pflege und Sicherheit selbst. Ersetzen lohnt sich nur bei klarem Nettonutzen.
