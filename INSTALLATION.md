# HealthTracker -- Installationsanleitung

**Stand:** 06.11.2026\
**Ziel:** Reproduzierbare Entwicklungsumgebung auf einem neuen
Windows-11-Laptop mit WSL2, Ubuntu, Docker Desktop, VS Code, Playwright
und Claude Code.

> **Geltungsbereich:** Diese Anleitung dokumentiert die im Chat
> erfolgreich getestete Konfiguration. Der vollständige Projektcode,
> `package.json`, `package-lock.json` und `start.sh` müssen aus dem
> bestehenden HealthTracker-Projekt übernommen werden. Ohne diese
> Dateien ist der Aufbau nicht vollständig. Die im Chat verwendete
> Playwright-Image-Version ist `v1.59.1-noble`; für spätere Updates
> Versionen bewusst gemeinsam anpassen.

## 1. Voraussetzungen

-   Windows 11 mit aktivierter Hardware-Virtualisierung.
-   Administratorrechte zur Einrichtung von WSL2 und Docker Desktop.
-   Internetzugang für Installation, Image-Download, npm und Claude
    Code.
-   Zugang zum HealthTracker-Git-Repository oder eine vollständige Kopie
    des Projektordners.
-   Claude-Konto bzw. unterstützte Authentifizierung für Claude Code.
-   Bei Teamarbeit: Secrets **nicht** in Git einchecken.

## 2. WSL2 und Ubuntu installieren

PowerShell **als Administrator** öffnen:

``` powershell
wsl --install -d Ubuntu
```

Bei Aufforderung Windows neu starten. Ubuntu starten und Linux-Benutzer
samt Passwort einrichten.

Installation kontrollieren:

``` powershell
wsl --list --verbose
```

Bei Ubuntu muss **VERSION 2** stehen. Falls nicht:

``` powershell
wsl --set-version Ubuntu 2
```

## 3. Docker Desktop installieren und verbinden

Docker Desktop von https://www.docker.com/products/docker-desktop/
installieren und starten.

1.  **Settings → General:** „Use the WSL 2 based engine" aktivieren.
2.  **Settings → Resources → WSL Integration:** Integration für Ubuntu
    aktivieren.
3.  Änderungen übernehmen und Docker Desktop neu starten, falls
    verlangt.

**Im Ubuntu-Terminal** testen:

``` bash
docker version
docker run --rm hello-world
```

`docker version` soll Client **und** Server anzeigen; `hello-world` muss
erfolgreich durchlaufen.

## 4. VS Code und Erweiterungen

VS Code installieren: https://code.visualstudio.com/

In VS Code die Microsoft-Erweiterungen **WSL**, **Dev Containers** und
**Playwright Test for VS Code** installieren. Die **Claude
Code**-Erweiterung ist optional; sie ersetzt nicht die Claude CLI.

## 5. HealthTracker-Projekt holen

**Im Ubuntu-Terminal:**

``` bash
mkdir -p ~/projects
cd ~/projects
```

Wenn ein Git-Repository existiert:

``` bash
git clone <REPOSITORY-URL> healthtracker
cd healthtracker
code .
```

`<REPOSITORY-URL>` durch die echte Git-URL ersetzen. Falls Git noch
nicht installiert ist:

``` bash
sudo apt update
sudo apt install -y git
```

**Wichtig:** Bei einem bestehenden Projekt **nicht** versehentlich einen
neuen leeren Projektordner anstelle der echten Dateien verwenden. Im
Projektordner prüfen:

``` bash
pwd
ls -la
ls -la .devcontainer/
```

Erwarteter Projektpfad ist
`/home/<LINUX-BENUTZER>/projects/healthtracker`. Es müssen mindestens
`.devcontainer/devcontainer.json`, `.devcontainer/Dockerfile`,
`package.json`, `package-lock.json` und `start.sh` vorhanden sein. Der
vollständige Anwendungscode wird ebenfalls benötigt.

## 6. Dev-Container-Dateien

Datei **`.devcontainer/Dockerfile`** (großes D, keine Endung):

``` dockerfile
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /workspaces/healthtracker

RUN curl -fsSL https://claude.ai/install.sh | bash

ENV PATH="/root/.local/bin:${PATH}"

CMD ["sh", "-c", "until [ -x ./node_modules/.bin/http-server ]; do sleep 1; done; exec ./start.sh"]
```

Datei **`.devcontainer/devcontainer.json`**:

``` json
{
  "name": "HealthTracker Playwright",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "overrideCommand": false,
  "remoteUser": "root",
  "forwardPorts": [3000, 9323],
  "portsAttributes": {
    "3000": {
      "label": "HealthTracker",
      "onAutoForward": "silent"
    },
    "9323": {
      "label": "Playwright Report",
      "onAutoForward": "silent"
    }
  },
  "postCreateCommand": "npm ci",
  "customizations": {
    "vscode": {
      "extensions": [
        "ms-playwright.playwright"
      ]
    }
  }
}
```

**Hinweise:** `npm ci` benötigt eine passende `package-lock.json`.
`http-server` muss über die Projektabhängigkeiten verfügbar sein; das
Startskript muss ausführbar bzw. mit `sh` aufrufbar sein. Die
Container-Konfiguration verwendet absichtlich `root`, wie im bisherigen
funktionierenden Setup. Das ist für eine lokale Entwicklungsumgebung
gedacht; für langfristige Teamnutzung empfiehlt sich später ein nicht
privilegierter Benutzer.

## 7. Startskript und Abhängigkeiten prüfen

Die **echte** `start.sh` und die beiden npm-Dateien aus dem
funktionierenden Projekt übernehmen. Ihr Inhalt ist aus dem Chat nicht
vollständig bekannt und wird hier nicht erfunden.

**Auf dem bestehenden Rechner** vor dem Übertragen prüfen:

``` bash
cd ~/projects/healthtracker
ls -l start.sh package.json package-lock.json
cat start.sh
npm pkg get scripts dependencies devDependencies
```

Wenn `http-server` nicht als lokale Abhängigkeit vorhanden ist, muss es
passend zum Projekt ergänzt und die Lockdatei aktualisiert werden (auf
dem bestehenden Entwicklungsrechner):

``` bash
npm install --save-dev http-server
```

Änderungen an `package.json` und `package-lock.json` in Git committen.
Sicherstellen, dass `start.sh` den Webserver auf **0.0.0.0:3000**
startet und nicht ausschließlich auf einer ungeeigneten Adresse lauscht.
Der genaue Startbefehl richtet sich nach dem tatsächlichen Skript.

## 8. Dev Container starten

1.  Projekt in VS Code **aus WSL** öffnen (`code .` im
    Ubuntu-Projektordner).
2.  **F1 → Dev Containers: Reopen in Container** auswählen.
3.  Image-Build und `postCreateCommand` abwarten.
4.  Bei Änderungen an der Dockerfile **Dev Containers: Rebuild
    Container** bzw. **Rebuild and Reopen in Container** auswählen
    (Bezeichnung kann je nach VS-Code-Version variieren).

**Achtung:** Nur „Reopen" verwendet gegebenenfalls ein bereits gebautes
Image; Änderungen an der Dockerfile erfordern einen Rebuild.

## 9. Funktionstests im Dev-Container-Terminal

``` bash
pwd
claude --version
curl -I http://localhost:3000
```

Erwartet: Claude gibt eine Versionsnummer aus; der HTTP-Test liefert
**`HTTP/1.1 200 OK`**. Im bisherigen Chat wurden Claude Code **2.1.318**
und HTTP **200** bestätigt; bei Neuinstallation kann die Claude-Version
neuer sein.

Die Anwendung im Browser öffnen: http://localhost:3000

**Playwright prüfen:**

``` bash
npx playwright --version
```

Tests nur ausführen, wenn im Projekt entsprechende Tests/Skripte
existieren, beispielsweise:

``` bash
npx playwright test
```

## 10. Claude Code anmelden

Im Dev-Container-Terminal:

``` bash
claude
```

Dem interaktiven Anmeldeablauf folgen. **Wichtig:** Die Installation
wird durch die Dockerfile bei Rebuilds wiederhergestellt; die
**Anmeldung** ist damit noch nicht dauerhaft gesichert. Bei Neubau oder
Löschen des Containers kann eine erneute Anmeldung erforderlich werden.
Authentifizierungsdaten nicht in die Dockerfile, `devcontainer.json`
oder Git schreiben. Für einen dauerhaften, sicheren Zugang kann später
ein benutzerspezifisches Volume oder eine andere von Claude unterstützte
Credential-Lösung eingerichtet werden.

## 11. Fehlerbehebung

### Dockerfile fehlt (`ENOENT`)

``` bash
ls -la .devcontainer/
```

Der Dateiname muss exakt **`Dockerfile`** sein, nicht `dockerfile` oder
`Dockerfile.txt`. Falls die vorhandene Datei kleingeschrieben ist:

``` bash
mv .devcontainer/dockerfile .devcontainer/Dockerfile
```

### Speichern nicht möglich (`EACCES`)

``` bash
ls -l .devcontainer/
```

Nur wenn die Dockerfile fälschlich `root` gehört, **im
Ubuntu-Hostterminal, nicht im Container**, aus dem Projektverzeichnis:

``` bash
sudo chown "$(id -un):$(id -gn)" .devcontainer/Dockerfile
```

### VS Code zeigt keine Dateien / „Disconnected from Dev Container"

Ubuntu-Terminal öffnen:

``` bash
cd ~/projects/healthtracker
code .
```

Erst Projektdateien prüfen, dann erneut **Reopen in Container**.

### `claude: command not found`

``` bash
ls -l /root/.local/bin/claude
echo "$PATH"
```

Falls die CLI in einem anderen Benutzerkonto installiert wurde, ist
dessen Home-Verzeichnis maßgeblich. Nach einer Dockerfile-Änderung neu
bauen.

### Port 3000 antwortet nicht

Im Container prüfen:

``` bash
pwd
ls -l start.sh
ls -l node_modules/.bin/http-server
ps aux
curl -v http://localhost:3000
```

Insbesondere prüfen, ob `npm ci` erfolgreich war und `start.sh` den
Webserver startet. Bei fehlendem `http-server` den Abschnitt zu den
npm-Abhängigkeiten beachten.

## 12. Reproduzierbarkeit und Teamarbeit

Für jeden neuen Rechner sollten mindestens diese Dateien versioniert
sein:

-   `.devcontainer/Dockerfile`
-   `.devcontainer/devcontainer.json`
-   `start.sh`
-   `package.json`
-   `package-lock.json`
-   Anwendungscode und Tests
-   `INSTALLATION.md` (diese Anleitung)

Zusätzlich sinnvoll: `.gitignore` für `node_modules/`, `.env`, Secrets
und lokale Ausgaben; `.env.example` ohne echte Zugangsdaten;
einheitliche Node-/Playwright-Versionen; CI-Tests; Dokumentation der
benötigten Umgebungsvariablen. **Die bisherige Konfiguration startet den
Webserver im Dev Container; eine separate Docker-Compose-Architektur ist
noch nicht eingerichtet.**

## 13. Abschluss-Checkliste

-   [ ] WSL2 / Ubuntu funktioniert
-   [ ] Docker Desktop mit Ubuntu verbunden
-   [ ] `docker run --rm hello-world` erfolgreich
-   [ ] VS Code mit WSL- und Dev-Containers-Erweiterung eingerichtet
-   [ ] Vollständiges HealthTracker-Projekt aus Git geladen
-   [ ] `Dockerfile` und `devcontainer.json` korrekt
-   [ ] `package-lock.json`, `package.json` und `start.sh` geprüft
-   [ ] Dev Container erfolgreich gebaut
-   [ ] `claude --version` erfolgreich
-   [ ] `curl -I http://localhost:3000` liefert HTTP 200
-   [ ] Claude Code angemeldet
-   [ ] Playwright-Version und Tests geprüft

**Ergebnis:** HealthTracker läuft lokal im reproduzierbaren Dev
Container; die Installation von Claude Code ist Bestandteil des
Image-Builds.
