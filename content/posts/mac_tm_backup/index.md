---
title: "Making a Mac Timemachine Backup on a SMB share"
date: 2026-01-07
draft: false
---

Hi everyone, welcome to my first post this year. I wish you a happy new year!

# Create sparse image (virtual disk)
There are two ways to create this virtual disk - via commands in the terminal or via the Disk Utility App (GUI)

### Terminal way
Go into the folder where u want to create the virtual disk (NOT THE SMB SHARE, this step comes later)
In this case im using my Desktop

```bash
cd Desktop
```

With the following command we are going to create a 500GB virtual disk image named "TimeMachine" – change the size to suit your needs (roughly twice the size of your Mac's storage space is recommended)

```bash 
hdiutil create -size 500g -type SPARSEBUNDLE -fs "HFS+J" TimeMachine.sparsebundle
```

### GUI way

Open the Disk Utility App

Now click "New Image" in the Toolbar or press `⌘ + N`

![image](du_new_image.png)

First set Image Format as "sparse button disk image", then set the size you want (setting the size first will probably result in an error message). Give the disk a name (I use TimeMachine in this tutorial), then optionally enable encryption. Save the disk to your desktop.

# 2. Copy the image file to your network share
Head to Finder, and open the network folder you'd like to use for your backup. Drag the sparse image you just created to this folder.

Once everything has copied you can then delete the remaining image on your desktop. Now, double-click the copy of the image on your network share – this will mount it. If everything worked, you should see the new TimeMachine drive in your Finder's sidebar and on your desktop (depending on your settings).

# 3. Add Image as Destination for Timemachine
For whatever reason the gui doesnt recognise the mounted image as valid path, therefore we need to add it as Time Machine Destination via the terminal.

`sudo tmutil setdestination /Volumes/TimeMachine`

If you've named your Image something else you need to adjust the command accordingly



TODO: Add Pictures and step 4. mounting the image on boot automatically.
source of info: https://www.makeuseof.com/tag/turn-nas-windows-share-time-machine-backup/
