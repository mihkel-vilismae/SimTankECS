# Instruction for future chats:

**1. Command:**

`print folder list` / `print folder tree`

Expected behavior:
When I say print folder list, take the uploaded project ZIP, extract it, and output the folder structure in this exact style:

Root and any folder that has subfolders are printed as ### **FOLDERNAME** (...)

Leaf folders are printed as - folderName (...)

Include metadata: subfolders=, files=, total_files_nested=, total_loc_nested=

Insert a dash-only line (-) after the last child list of every folder

Insert a dash-only line before any folder that has subfolder

Example output format:

- ### **SimTankECS_instructions_extracted** (subfolders=2, files=6, total_files_nested=112, total_loc_nested=3463)
-
- ### ├── **src** (subfolders=10, files=1, total_files_nested=60, total_loc_nested=1882)
│   ├── aim (files=1, total_loc_nested=13)
│   ├── app (files=4, total_loc_nested=201)
...
│   └── vfx (files=3, total_loc_nested=83)
-
└── tests (files=46, total_loc_nested=1290)
-

**2. Command:**

`print quick folder list` / `print quick folder tree`

Expected behavior:
Print the same as `print folder list` but without `total_loc_nested` (and without other LOC related metadata).

**3. Command:**

`print full list` / `print full tree` / `print full filelist`

Expected behavior:
When I say `print file list`, take the uploaded project ZIP, extract it, and output the full file tree (including files) with the following rules:

Structure

Show a classic ASCII tree with connectors (├──, └──, │ ) starting at the project root.

List folders first, then files, each group alphabetically by name.

Per-file metadata

After every file name, append:
(LOC=<lines>, created=<YYYY-MM-DD HH:MM:SS>, modified=<YYYY-MM-DD HH:MM:SS>)

LOC is the number of text lines (best effort; binary/unreadable → LOC=None).

created and modified come from ZIP metadata. If creation time isn’t available, set created = modified.

Per-folder lines

Print only the folder name (no counts) on its tree line.

Do not add separators or headings here (unlike the folder-only view).

General

Preserve the exact indentation/connector style.

If the output is extremely long, split into sequential parts without changing formatting.

Example output format:

├── src
│   ├── aim
│   │   └── math.js (LOC=13, created=2025-09-06 15:18:50, modified=2025-09-06 15:18:50)
│   ├── app
│   │   ├── attachInput.js (LOC=10, created=2025-09-06 19:13:06, modified=2025-09-06 19:13:06)
│   │   ├── attachMouse.js (LOC=27, created=2025-09-06 19:13:10, modified=2025-09-06 19:13:10)
│   │   ├── createGame.js (LOC=106, created=2025-09-06 15:18:50, modified=2025-09-06 15:18:50)
│   │   └── registerSystems.js (LOC=58, created=2025-09-06 19:10:02, modified=2025-09-06 19:10:02)
│   ├── components
│   │   ├── arrowGizmo.js (LOC=9, created=2025-09-06 15:18:50, modified=2025-09-06 15:18:50)
│   │   ├── flight.js (LOC=4, created=2025-09-06 15:18:50, modified=2025-09-06 15:18:50)

