---
title: "Do a quick system scan with ClamAV"
date: 2024-07-28
draft: false
---

Hey everyone! This is a short guide on how to download the portable version of ClamAV for Windows and run a quick scan on your system.

## Download ClamAV (no install)

First go to the [GitHub Repository of ClamAV](https://github.com/Cisco-Talos/clamav/releases) and download the latest release.
Extract the contents of the zip file.

## Downloading the ClamAV Databases

You need to create a config for freshclam.exe, you can just copy the example from the conf_examples folder and remove the "Example" line and change the folder for the database.

Now open up a terminal and navigate to the ClamAV folder and execute freshclam.exe. You will see that it downloads some files. After a few minutes it should be done.

## Scanning your whole System

In the same terminal, run clamscan.exe with the recursive scanning parameter and the folder to scan.

So for a full system scan this would be:
`clamscan.exe --recursive C:\`

## More Information

For more information have a look at the [ClamAV docs](https://docs.clamav.net/) yourself