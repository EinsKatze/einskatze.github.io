---
title: "Guide: Upgrade Windows 10 -> Windows 10 IoT Enterprise LTSC"
date: 2025-03-17
draft: false
showtoc: true
author: "TimLew"
---

> **EinsKatze:**\
> Hi everyone, this is basically a guest post. This guide was written by TimLew — huge shoutout to him! 💖\
> Discord: `timlew`

<!--more-->

## Step 1: Download the ISO File

**Download Link**:
[Windows 10 Enterprise LTSC 2021 (x64) ISO](https://drive.massgrave.dev/de-de_windows_10_enterprise_ltsc_2021_x64_dvd_71796d33.iso)

> **Note**: This is the standard Windows 10 Enterprise LTSC ISO (non-IoT), which keeps your system language as German. The IoT conversion is handled during installation.

---

## Step 2: Verify System Language

1. Open **PowerShell** as Administrator.
2. Run:

```powershell
dism /english /online /get-intl | find /i "Default system UI language"
```

If the output confirms German (`de-DE`), proceed to the next step.

If not, download the matching language ISO from:
[Windows LTSC Download Links](https://massgrave.dev/windows_ltsc_links)

---

## Step 3: Back Up Your Data

⚠️ **Back up all critical files** from your `C:` drive (bookmarks, documents, passwords, photos, etc.).

> **Note**: While the in-place upgrade process is generally smooth, it technically transitions the build version from 22H2 to 21H2. Backing up first is always strongly advised.

---

## Step 4: Modify the Registry Key

In PowerShell (Admin), run:

```powershell
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v EditionID /d IoTEnterpriseS /f
```

**Immediately** mount the downloaded ISO and launch `setup.exe`.

---

## Step 5: Perform the Upgrade

During setup, select **"Keep personal files and apps"**.

> ⚠️ **Important**: Act quickly — Windows may revert the registry value if you wait too long before starting setup!

Allow the installation to complete.

---

## Step 6: Activate IoT Enterprise LTSC

After the upgrade completes, use the generic Windows setup key:

```text
QPM6N-7J2WJ-P88HH-P3YRH-YY74H
```

Your system may restart automatically.

---

## Step 7: System Activation

Open PowerShell (Admin) and run the Microsoft Activation Script:

```powershell
irm https://get.activated.win | iex
```

Select Option **[1]** (HWID activation).

---

## Step 8: Restore Microsoft Store (Optional)

If the Microsoft Store is missing after the upgrade and you need it, run in PowerShell (Admin):

```powershell
wsreset -i
```

> Wait 1–2 minutes for the Store to reinstall in the background. If any warnings appear in the terminal, you can safely ignore them.

To install App Installer / WinGet (if needed):
[Download App Installer from Microsoft Store](https://apps.microsoft.com/detail/9nblggh4nns1)

> *The Microsoft Store must be installed for this link to open.*

---

✅ **Done!** Your system is now running Windows 10 IoT Enterprise LTSC with extended support.