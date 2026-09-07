---
title: "Guide: Upgrade Windows 10 -> Windows 10 IoT Enterprise LTSC"
date: 2025-03-17
draft: false
showtoc: true
author: "TimLew"
---

> **EinsKatze:**\
> Moin Freunde, das ist im Grunde ein Gastbeitrag. Die komplette Anleitung wurde von TimLew geschrieben — riesiger Dank an ihn! 💖\
> Discord: `timlew`

<!--more-->

## Schritt 1: ISO-Datei herunterladen

**Download-Link**:
[Windows 10 Enterprise LTSC 2021 (x64) ISO](https://drive.massgrave.dev/de-de_windows_10_enterprise_ltsc_2021_x64_dvd_71796d33.iso)

> **Hinweis**: Dies ist die reguläre ISO-Datei von Windows 10 Enterprise LTSC (nicht direkt IoT), wodurch deine Systemsprache Deutsch bleibt. Die Umstellung auf die IoT-Edition erfolgt im weiteren Verlauf.

---

## Schritt 2: Systemsprache überprüfen

Stelle sicher, dass deine Systemsprache auf **Deutsch** eingestellt ist. Führe dazu in PowerShell (als Administrator) folgenden Befehl aus:

```powershell
dism /english /online /get-intl | find /i "Default system UI language"
```

Die Ausgabe sollte `de-DE` lauten.

Falls die Sprache eine andere ist, findest du hier die passenden Sprachversionen:
[Windows LTSC Download-Übersicht](https://massgrave.dev/windows_ltsc_links)

---

## Schritt 3: Daten sichern

⚠️ **Sichere alle wichtigen Daten** (*Lesezeichen, Passwörter, Dokumente, Bilder etc.*) von Laufwerk `C:`.

> **Hinweis**: Der Upgrade-Prozess verläuft in der Regel reibungslos, wechselt jedoch technisch von Build 22H2 auf 21H2. Ein Backup vorab wird daher dringend empfohlen.

---

## Schritt 4: Registry-Key anpassen

Führe in PowerShell (Administrator) folgenden Befehl aus, um die EditionID vorübergehend anzupassen:

```powershell
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v EditionID /d IoTEnterpriseS /f
```

Binde die heruntergeladene ISO-Datei **unmittelbar danach** ein und starte `setup.exe`.

---

## Schritt 5: Upgrade durchführen

Wähle im Setup die Option **"Persönliche Dateien und Apps behalten"**.

> ⚠️ **Wichtig**: Führe diesen Schritt zügig durch, da Windows die geänderte Registry-Einstellung nach einiger Zeit zurücksetzen kann!

Lasse die Installation vollständig durchlaufen.

---

## Schritt 6: Generic Key für IoT Enterprise LTSC eintragen

Verwende nach dem Upgrade den folgenden Installationsschlüssel:

```text
QPM6N-7J2WJ-P88HH-P3YRH-YY74H
```

Dein System führt gegebenenfalls einen Neustart durch.

---

## Schritt 7: System aktivieren

Öffne PowerShell (als Administrator) und führe das Microsoft Activation Script aus:

```powershell
irm https://get.activated.win | iex
```

Wähle Option **[1]** (HWID-Aktivierung).

---

## Schritt 8: Microsoft Store wiederherstellen (optional)

Falls der Microsoft Store nach dem Upgrade nicht mehr vorhanden ist und benötigt wird:

```powershell
wsreset -i
```

> Warte etwa 1–2 Minuten, bis der Store im Hintergrund installiert wurde. Eventuelle Warnungen im Terminal können ignoriert werden.

Um den Windows App Installer / WinGet nachzuinstallieren:
[App Installer im Microsoft Store herunterladen](https://apps.microsoft.com/detail/9nblggh4nns1)

> *Hierfür muss der Microsoft Store bereits installiert sein.*

---

✅ **Fertig!** Dein System läuft nun auf Windows 10 IoT Enterprise LTSC mit verlängertem Support.