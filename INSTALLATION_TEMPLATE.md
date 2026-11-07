# INSTALLATION -- Wiederverwendbare Entwicklungsumgebung

> **Vorlage:** Windows 11 + WSL2/Ubuntu + Docker Desktop + VS Code Dev
> Containers + optional Playwright und Claude Code.\
> **Zweck:** Neue Rechner oder neue Projekte reproduzierbar einrichten.\
> **Stand:** 2026-11-06

## 0. Platzhalter vor Verwendung ersetzen

  ----------------------------------------------------------------------------------------------
  Platzhalter             Bedeutung               Beispiel
  ----------------------- ----------------------- ----------------------------------------------
  `<LINUX_USER>`          Ubuntu-Benutzer         `developer`

  `<WSL_DISTRO>`          Name der                `Ubuntu`
                          WSL-Distribution        

  `<PROJECT_NAME>`        Verzeichnisname, ohne   `meine-app`
                          Leerzeichen             

  `<REPO_URL>`            Git-Clone-URL           `https://git.example.org/team/meine-app.git`

  `<APP_PORT>`            HTTP-Port der Anwendung `3000`

  `<APP_START_COMMAND>`   Befehl zum Starten der  `npm run dev -- --host 0.0.0.0`
                          App                     

  `<NODE_IMAGE_TAG>`      Playwright-Image-Tag    `v1.59.1-noble`
                          (wenn Playwright        
                          benötigt wird)          
  ----------------------------------------------------------------------------------------------

**Wichtig:** Platzhalter sind Text zum Ersetzen, keine direkt
ausführbaren Shell-Befehle. In JSON müssen Ports als Zahlen eingetragen
werden. Die unten stehende Beispielkonfiguration verwendet **Port 3000**
und **Projektpfad `/workspaces/app`**, damit die Vorlage selbst sofort
syntaktisch gültig ist. Diese Werte kannst du anpassen.

## 1. Voraussetzungen

-   Windows 11 mit Hardware-Virtualisierung und Administratorrechten
-   Internetzugang für Erstinstallation
-   Git-Repository mit dem vollständigen Projektcode
-   Bei Node.js: `package.json` und eine zur Installationsmethode
    passende Lockdatei
-   Für Claude Code: geeignete Anmeldung; niemals Tokens in Git
    speichern

## 2. WSL2 installieren

PowerShell **als Administrator**:

``` powershell
wsl --install -d Ubuntu
```

Falls verlangt neu starten; Ubuntu öffnen und Benutzer/Passwort
einrichten.

``` powershell
wsl --list --verbose
```

Die Distribution soll Version **2** verwenden. Falls nötig
(Distributionsnamen ersetzen):

``` powershell
wsl --set-version Ubuntu 2
```

## 3. Docker Desktop

Docker Desktop installieren:
https://www.docker.com/products/docker-desktop/

-   Settings → General → **Use the WSL 2 based engine**
-   Settings → Resources → WSL Integration → die verwendete Distribution
    aktivieren

Im **Ubuntu-Terminal** prüfen:

``` bash
docker version
docker run --rm hello-world
```

`docker version` muss Client und Server zeigen.

## 4. VS Code

Installieren: https://code.visualstudio.com/

Erweiterungen: - **WSL** (Microsoft) - **Dev Containers** (Microsoft) -
**Playwright Test for VS Code** (optional) - **Claude Code** (optional;
nicht identisch mit der CLI)

## 5. Projekt aus Git öffnen

Im Ubuntu-Terminal:

``` bash
sudo apt update
sudo apt install -y git
mkdir -p ~/projects
cd ~/projects
git clone <REPO_URL> <PROJECT_NAME>
cd <PROJECT_NAME>
code .
```

**Vor Ausführung** `<REPO_URL>` und `<PROJECT_NAME>` ersetzen.
Alternativ einen bereits vorhandenen Projektordner öffnen.

``` bash
pwd
ls -la
```

Die Dateien sollten auf dem Linux-Dateisystem liegen, z. B. unter
`/home/<LINUX_USER>/projects/<PROJECT_NAME>`.

## 6. Beispiel: generischer Node.js-Dev-Container

Die folgenden Dateien gehören in **`<PROJECT_NAME>/.devcontainer/`**.
Dieses Beispiel ist bewusst **ohne Playwright und ohne Claude**
gehalten. Für andere Sprachen das Basisimage, die Paketinstallation und
den Startbefehl anpassen.

**`.devcontainer/Dockerfile`:**

``` dockerfile
FROM node:22-bookworm

WORKDIR /workspaces/app

CMD ["sleep", "infinity"]
```

**`.devcontainer/devcontainer.json`:**

``` json
{
  "name": "Development Container",
  "build": {
    "dockerfile": "Dockerfile"
  },
  "workspaceFolder": "/workspaces/app",
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspaces/app,type=bind",
  "forwardPorts": [3000],
  "portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "silent"
    }
  },
  "postCreateCommand": "if [ -f package-lock.json ]; then npm ci; elif [ -f package.json ]; then npm install; else echo 'No Node.js project detected'; fi",
  "customizations": {
    "vscode": {
      "extensions": []
    }
  }
}
```

**Warum hier `sleep infinity`?** Der Container bleibt auch dann offen,
wenn die Anwendung noch nicht gestartet wurde. Der eigentliche App-Start
wird im Terminal ausgeführt und muss projektspezifisch ergänzt werden.
Das verhindert Startschleifen bei neuen Projekten.

Für eine Anwendung auf Port 3000 beispielsweise im
**Container-Terminal**:

``` bash
npm run dev -- --host 0.0.0.0
```

Dieser Befehl ist **nur ein Beispiel** und funktioniert nur, wenn das
Projekt ein entsprechendes `dev`-Skript hat. Für andere Frameworks den
projektspezifischen Startbefehl verwenden.

### Optional A: Playwright

Wenn Browser-E2E-Tests benötigt werden, kann in der Dockerfile statt
`node:22-bookworm` ein zur verwendeten Playwright-Version passendes
Image stehen:

``` dockerfile
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /workspaces/app

CMD ["sleep", "infinity"]
```

Das Image bringt Browser und Systemabhängigkeiten mit, **nicht
automatisch das passende npm-Projektpaket**. Im Projekt muss
`@playwright/test` bzw. die passende Playwright-Abhängigkeit installiert
und versioniert sein. Versionen von Image und npm-Paket aufeinander
abstimmen.

Beispieltest:

``` bash
npx playwright --version
npx playwright test
```

Der Testbefehl setzt vorhandene Tests voraus.

### Optional B: Claude Code CLI

Für einen Container, der als **root** läuft, kann die native
Claude-Code-Installation in der Dockerfile ergänzt werden:

``` dockerfile
RUN curl -fsSL https://claude.ai/install.sh | bash
ENV PATH="/root/.local/bin:${PATH}"
```

Diese Zeilen **vor** `CMD` einfügen. Das Basisimage muss `curl` und
`bash` enthalten. Für einen Nicht-root-Benutzer müssen Installationspfad
und Benutzer angepasst werden. Installation aus einem Netzwerkskript nur
aus einer vertrauenswürdigen Quelle ausführen.

Im Container:

``` bash
claude --version
claude
```

Die Anmeldung erfolgt interaktiv. **Ein Rebuild erhält die Installation,
aber nicht zwangsläufig die Anmeldung.** Für persistente Anmeldedaten
später eine sichere, benutzerbezogene Lösung vorsehen; niemals
Credentials in Images oder Git einbacken.

## 7. Dev Container starten

In VS Code mit geöffnetem WSL-Projekt:

1.  **F1 → Dev Containers: Reopen in Container**
2.  Build und Post-Create-Installation abwarten
3.  Terminal öffnen und den projektspezifischen Startbefehl ausführen
4.  Bei Änderungen an Dockerfile: **Dev Containers: Rebuild Container**
    bzw. **Rebuild and Reopen in Container**

## 8. Prüfen

Im **Dev-Container-Terminal**:

``` bash
pwd
node --version
npm --version
```

Bei HTTP-Anwendungen auf dem Beispielport:

``` bash
curl -I http://localhost:3000
```

Erwartet wird ein erfolgreicher HTTP-Status (häufig `200`, abhängig von
Anwendung und Route). Wenn `curl` nicht installiert ist, zunächst im
Browser testen oder das Werkzeug im Image ergänzen.

## 9. Ubuntu-Dateien aus Windows erreichen

Windows-Explorer öffnen und in die Adressleiste eingeben:

``` text
\\wsl$\Ubuntu
```

Projektpfad (Beispiel):

``` text
\\wsl$\Ubuntu\home\<LINUX_USER>\projects\<PROJECT_NAME>
```

Der Distributionsname muss ggf. angepasst werden. Optional in
**Windows-CMD** als Laufwerk U: einbinden:

``` cmd
net use U: \\wsl$\Ubuntu /persistent:yes
```

Das Laufwerk kann nach einem Neustart erst wieder verfügbar sein,
nachdem WSL gestartet wurde. Für Entwicklung, Git, npm und Docker
vorzugsweise das WSL-Terminal verwenden.

## 10. Fehlerbehebung

**`Dockerfile` nicht gefunden / ENOENT:**

``` bash
ls -la .devcontainer/
```

Datei muss `Dockerfile` heißen (großes D, keine `.txt`-Endung). Falls
kleingeschrieben:

``` bash
mv .devcontainer/dockerfile .devcontainer/Dockerfile
```

**`Permission denied` beim Speichern:**

``` bash
ls -l .devcontainer/
```

Wenn die Dockerfile fälschlich root gehört, im **WSL-Hostterminal** aus
dem Projektordner:

``` bash
sudo chown "$(id -un):$(id -gn)" .devcontainer/Dockerfile
```

**VS Code: „Disconnected from Dev Container":**

``` bash
cd ~/projects/<PROJECT_NAME>
code .
```

Vorher `<PROJECT_NAME>` ersetzen. Dann erneut „Reopen in Container".

**Port nicht erreichbar:** Läuft der Server? Hört er auf `0.0.0.0` statt
nur auf `127.0.0.1` im Container? Ist der korrekte Port in
`forwardPorts` eingetragen? Stimmt der Startbefehl?

**`npm ci` scheitert:** Lockdatei vorhanden und konsistent?
`package.json`/Lockdatei ins Repository übernommen? Bei anderen
Paketmanagern `postCreateCommand` ändern.

**Claude fehlt nach Rebuild:** Installationszeilen in der Dockerfile und
`PATH` des richtigen Benutzers kontrollieren; Image neu bauen.

## 11. Team- und Sicherheitscheckliste

-   [ ] Projekt-Repository erreichbar
-   [ ] WSL2/Ubuntu und Docker Desktop funktionieren
-   [ ] Dev-Container-Dateien sind in Git
-   [ ] Basisimage und Projektabhängigkeiten sind versioniert
-   [ ] Startbefehl, Ports und erforderliche Dienste sind dokumentiert
-   [ ] Secrets sind nicht in Git oder Dockerfile
-   [ ] `.env.example` ohne echte Geheimnisse vorhanden (falls
    erforderlich)
-   [ ] Dev Container startet nach einem Rebuild
-   [ ] App-Test und optionale Playwright-Tests laufen
-   [ ] Optionale Claude-Code-Anmeldung funktioniert

## 12. Projektbezogene Ergänzungen

Für jedes Projekt folgende Angaben ergänzen:

``` text
Projektname:         <PROJECT_NAME>
Git-Repository:      <REPO_URL>
Linux-Benutzer:      <LINUX_USER>
WSL-Distribution:    <WSL_DISTRO>
Framework/Sprache:   <FRAMEWORK>
App-Port:            <APP_PORT>
Startbefehl:         <APP_START_COMMAND>
Testbefehl:          <TEST_COMMAND>
Datenbank/Dienste:   <DATABASE_AND_SERVICES>
Umgebungsvariablen:  <ENV_VARIABLE_NAMES_ONLY>
```

> **Grenze dieser Vorlage:** Sie richtet eine generische
> Node.js-Entwicklungsumgebung ein. Für PostgreSQL, Redis, weitere
> Dienste, Desktop-Apps oder vollständig offline arbeitende Setups ist
> eine projektspezifische Erweiterung (oft Docker Compose) erforderlich.
> Sie installiert solche Dienste nicht automatisch.
