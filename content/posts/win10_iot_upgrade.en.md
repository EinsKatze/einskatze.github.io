---
title: "Guide: Upgrade Windows 10 -> Windows 10 IoT Enterprise LTSC"
date: 2025-03-17
draft: false
showtoc: true
author: "TimLew"
---

> EinsKatze:\
> Hi everyone, this basically is a guest-post. This guide is entirely written by TimLew, shoutout to him! 💖
> His Discord Username: timlew

## Step 1: Download the ISO File
**Download Link**:
[https://drive.massgrave.dev/de-de_windows_10_enterprise_ltsc_2021_x64_dvd_71796d33.iso](https://drive.massgrave.dev/de-de_windows_10_enterprise_ltsc_2021_x64_dvd_71796d33.iso)

> **Note**: This is the standard Windows 10 Enterprise LTSC ISO (non-IoT), but it retains your system language as German.

---

## Step 2: Verify System Language
1. Open **PowerShell** as Administrator.
2. Run:
```powershell
dism /english /online /get-intl | find /i "Default system UI language"
```

If the output shows German (```de-DE```), proceed.

If not, download the correct language ISO from:
[Windows LTSC Versions](https://massgrave.dev/windows_ltsc_links#:~:text=en%2Dgb_windows_10_enterprise_ltsc_2021_x86_dvd_baa2b09f.iso-,English,-x64)

---

## Step 3: Backup Your Data
⚠️ Backup all critical files from your ```C:``` drive (bookmarks, passwords, photos, etc.).

> Note: While the upgrade process is generally stable, you may technically "downgrade" from 22H2 to 21H2. Proceed with caution.

---

## Step 4: Modify the Registry Key
In PowerShell (Admin), run:

```powershell
reg add "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v EditionID /d IoTEnterpriseS /f
```

**Immediately** mount the ISO and launch ```setup.exe.```

---

## Step 5: Perform the Upgrade
During setup, select **"Keep personal files and apps"**.

> ⚠️ Act quickly – this option may disappear if you are not fast enough!

Allow the installation to complete.

---

## Step 6: Activate IoT Enterprise LTSC
Use the following Windows activation key after the upgrade:
```QPM6N-7J2WJ-P88HH-P3YRH-YY74H```

Your system may restart automatically or request to do so.

---

## Step 7: Legitimate Activation
Open PowerShell (Admin) and run:

```powershell
irm https://get.activated.win | iex
```

Select Option [1] (or 3/4/5). Option [1] is preferred.

---

## Step 8: Restore Microsoft Store (if needed)
Run in PowerShell (Admin):

```powershell
wsreset -i
```
> Wait 2 minutes for the Store to reinstall. There my be Warnings, ignore them.

Download AppInstaller (if needed):
https://apps.microsoft.com/detail/9nblggh4nns1.
> The Microsoft Store must be installed for this step.

---

✅ Done! Your system is now running Windows 10 IoT Enterprise LTSC.