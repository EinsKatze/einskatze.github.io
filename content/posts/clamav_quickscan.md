---
title: "Do a quick system scan with ClamAV"
date: 2024-07-28
draft: false
---

Hey everyone! This is a short guide on how to download the portable version of ClamAV for Windows and run a quick scan on your system.

<!--more-->

## 1. Download ClamAV (Portable / No Install)

First, visit the [ClamAV GitHub Releases](https://github.com/Cisco-Talos/clamav/releases) page and download the latest Windows `.zip` release. Extract the contents of the ZIP archive to a folder of your choice.

## 2. Download the ClamAV Databases

Before scanning, you need to configure `freshclam.exe` to download signature databases:

1. Navigate to the `conf_examples` folder.
2. Copy the example configuration file (`freshclam.conf.sample`) into the main ClamAV directory and rename it to `freshclam.conf`.
3. Open `freshclam.conf` in a text editor, remove or comment out the line that says `Example`, and configure the database directory path if desired.

Now open a terminal (Command Prompt or PowerShell), navigate to your ClamAV directory, and run:

```cmd
freshclam.exe
```

It will begin downloading the latest virus definition databases. After a few minutes, the update will finish.

## 3. Scan Your Entire System

In the same terminal, run `clamscan.exe` with the recursive scanning flag and the target drive or folder:

```cmd
clamscan.exe --recursive C:\
```

## More Information

For more information and advanced scanning options, take a look at the official [ClamAV documentation](https://docs.clamav.net/).