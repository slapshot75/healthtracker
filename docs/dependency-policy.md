# Abhängigkeits-Richtlinie

Ziel: so wenig Fremdcode wie nötig. Eine Abhängigkeit wird nur behalten, wenn sie ihren Platz verdient.

Die Richtlinie ist vom Projekt jmanico/trim-reaper (MIT, Copyright 2026 Jim Manico) inspiriert: https://github.com/jmanico/trim-reaper. Die Formulierungen hier sind eigene und auf dieses Projekt zugeschnitten.

## Stand dieses Projekts

- **Laufzeit:** keine npm-Pakete. Chart.js 4.6.1 kommt per CDN (cdnjs, mit SRI-Hash), Supabase läuft über `fetch` gegen die REST-API.
- **Entwicklung:** `@playwright/test` und `http-server` (nur in `devDependencies`, nicht im ausgelieferten Code).
- **Build:** keiner. Das Projekt ist Vanilla JS (siehe CLAUDE.md).

## Regeln für neue Abhängigkeiten

1. **Erst prüfen, ob es ohne geht.** Standardbibliothek oder Browser-API zuerst. Eine Funktion mit 10 Zeilen ist meist billiger als ein Paket. Lohnt sich eine Eigenlösung, schreibe sie lokal aus, wenn sie einfacher zu warten und zu prüfen ist.
2. **Sicherheitskritisches nicht selbst bauen.** Kryptografie, Authentifizierung und komplexes Parsen bleiben bei etablierten Bibliotheken oder geprüften Plattform-APIs. Bestehende Spezialbibliotheken bleiben, wenn ein Ersatz Sicherheit, Korrektheit oder Wartung verschlechtern würde.
3. **Transitive Abhängigkeiten ansehen.** Vor dem Hinzufügen oder Upgraden den aufgelösten Abhängigkeitsbaum prüfen (`npm ls <paket>`). Bei spürbarer Vergrößerung begründen, warum sie nötig ist, und den Pflegeaufwand abschätzen. Pakete mit kleinerem Baum sind vorzuziehen.
4. **Name und Herausgeber verifizieren.** Den Paketnamen gegen Dokumentation oder Repository des Projekts prüfen, nicht aus dem Gedächtnis übernehmen. Die Registry-Seite live abrufen und nicht allein deren Metadaten vertrauen. Ähnlich klingende Namen, Eigentümerwechsel und unbekannte neue Pakete werden vor dem Weitermachen untersucht.
5. **Lizenz prüfen, auch für transitive Pakete.** Lizenz des Pakets und aller Abhängigkeiten gegen die beabsichtigte Nutzung und Verbreitung prüfen. Pflichtige Hinweise (Copyright, Lizenztext) erhalten. Unklare oder nicht passende Lizenzen werden dem Maintainer zur Entscheidung vorgelegt, bevor es weitergeht.
6. **Pflege bewerten.** Support-Status, offene Issues, Reaktionszeit auf Sicherheitsmeldungen und Kompatibilität mit den unterstützten Laufzeiten gehören zur Bewertung. Die Zahl der Releases ist nur ein Signal; ein reifes, stabiles Paket braucht wenige. Archivierte, veraltete oder verwaiste Projekte werden abgelehnt.
7. **Sicherheitshinweise aus offiziellen Quellen prüfen.** Herangezogen werden die Hinweise des Projekts und gängige Advisory-Datenbanken, zusätzlich `npm audit`. Im Ergebnis stehen Quellen, Prüfdatum, betroffene Versionen und die Frage, ob sie dieses Projekt treffen. Eine Version mit bekannter, zutreffender Schwachstelle wird nicht verwendet. Ist die Prüfung nicht möglich, wird angehalten und berichtet. Eine ungeprüfte Version gilt nicht als sicher.
8. **Aktuelle stabile Version wählen.** Die neueste stabile Version, die zum Projekt passt, ist der Standard. Sehr neue Releases und unerwartete Wechsel bei Maintainern oder Veröffentlichungen werden kritisch geprüft. Eine ältere Version wird begründet.
9. **Breaking Changes vor dem Update lesen.** Release Notes, Migrationshinweise und Abhängigkeitsvorgaben prüfen. Konkrete Auswirkungen auf dieses Projekt und der nötige Migrationsaufwand werden festgehalten. Erfordert ein Update einen größeren Umbau, wird angehalten und Befund sowie Optionen vorgelegt.
10. **Updates eng halten.** Nur das Paket aktualisieren, das die Aufgabe braucht. Transitive Pakete über den Paketmanager auflösen. Keine erzwungenen Overrides und keine manuellen Eingriffe in das Lockfile. Wenn möglich, zuerst ein kompatibles übergeordnetes Paket aktualisieren.
11. **Ohne Prüfung nicht hinzufügen.** Lässt sich eine der Regeln 4 bis 9 nicht erfüllen, wird das Paket nicht hinzugefügt oder aktualisiert. Ausnahme ist nur die ausdrückliche Akzeptanz des Risikos durch die Maintainerin oder den Maintainer.
12. **CDN-Skripte immer mit fester Version einbinden**, nie `latest` oder ohne Versionsnummer.
13. **Entwicklungs-Abhängigkeiten nicht ausliefern.** Tools für Tests und lokalen Server bleiben in `devDependencies`.
14. **Änderungen klein halten.** Ein Paket pro Schritt, mit Test-Lauf davor und danach (`npm run test:e2e`).

## Abbau bestehender Abhängigkeiten (bei Bedarf)

Wenn du aufräumen willst, in dieser Reihenfolge prüfen:

1. Ungenutzte oder doppelte Pakete als Kandidaten markieren. Vor dem Entfernen prüfen: Code, dynamisches Laden, Plugins, Konfigurationsdateien, Skripte, Tests und Build-Werkzeug. Nur wenn nichts davon das Paket braucht, wird es entfernt.
2. Pakete durch Standardfunktionen ersetzen, wo das gleichwertig ist.
3. Kleine Hilfsfunktionen lokal ausschreiben.
4. Überlappende Bibliotheken zusammenführen.
5. Transitive Last verringern.
6. Entwicklungsabhängigkeiten von der Auslieferung trennen.
7. Größere Ersetzungen nur mit klarem Nutzen.
8. Ergebnis verifizieren: Tests grün, Verhalten und unterstützte Laufzeiten unverändert, Ergebnis dokumentieren. Behaltene Pakete mit Begründung festhalten.

Hinweis: Wer ein Paket entfernt, übernimmt dessen Pflege und Sicherheit selbst. Ersetzen lohnt sich nur bei klarem Nettonutzen.

## Dokumentierte Prüfungen

Zu jeder Prüfung nach den Regeln 4 bis 9 wird festgehalten:

- Paket, Version, Datum der Prüfung,
- verwendete Quellen (Registry, Repository, Advisory-Datenbank),
- Ergebnis und Entscheidung, bei älterer Version die Begründung.

Die Notizen gehören in den Commit oder die Pull-Request-Beschreibung der Änderung.
