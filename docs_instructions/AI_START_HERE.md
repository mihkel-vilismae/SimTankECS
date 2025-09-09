# AI_START_HERE.md

_Version: v1.4 – 2025-09-09 23:05:48 Europe/Tartu_









> Read this file first after a project ZIP is uploaded. Then follow the steps and rules below exactly.

## 0) Project bootstrap (run in this order)
1. Confirm this folder exists: `docs_instructions/`.
2. Read these files in order:
   - `docs_instructions/GENERAL_INSTRUCTIONS.md`  ← governance rules (what may/may not be edited).
   - `docs_instructions/STYLE_GUIDE_INSTRUCTIONS.md` ← **style guide (MUST follow, NEVER edit).**
   - `docs_instructions/COMMANDS.md` ← user-facing commands you must recognize and execute.
   - `docs_instructions/AUTO_ACTIONS.md` ← auto-behaviors to run without being asked.
3. Apply **AUTO ACTIONS** immediately (see §3).
4. Then wait for user commands (see §2).

> Notes:
> - Per governance: **Do not modify** the style guide file; add new commands to `COMMANDS.md`; update auto-behaviors in `AUTO_ACTIONS.md` when the user asks.
> - If any of the four files are missing, inform the user which are missing and proceed with the ones available.

---

## 1) Style Guide (binding)
- The contents of `STYLE_GUIDE_INSTRUCTIONS.md` are the **authoritative project style**.
- You **must follow it strictly** and **must not modify it** (see governance rules in `GENERAL_INSTRUCTIONS.md`).

---

## 2) Commands (what users can ask you to run)
- Load all commands from `docs_instructions/COMMANDS.md`.
- Recognize the aliases exactly as defined there (e.g., `print folder list`, `print quick folder list`, `print full list`/`print full filelist`).
- Execute with the precise output format specified in that file.

### Built-in expectations (derived from `COMMANDS.md`)
- **`print folder list`**: render the folder-only tree with subfolder/file counts and `total_files_nested`, `total_loc_nested`, with **dash separators** before/after branch folders and after each folder’s final child list, per the spec and example.
- **`print quick folder list`**: same as above but **omit LOC-related totals**.
- **`print full list` / `print full filelist`**: render the **complete tree including files**, with per-file metadata `(LOC=…, created=…, modified=…)`, ordering folders first then files, alphabetically, and split output into sequential parts if very long.

> If any command is unclear or conflicts with other rules, prioritize `COMMANDS.md` and ask the user to clarify.

---

## 3) Auto Actions (run without being asked)
- Load `docs_instructions/AUTO_ACTIONS.md` and perform all listed actions.
- **Example present behavior:** when a new project ZIP is uploaded, automatically run **`print quick folder list`**.
- **Timestamp rule for every reply:** Prepend two lines at the very top of every assistant answer:
  ```
  [prompt at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
  [response at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
  ```
  - `prompt at`: the exact time the user sent their prompt.
  - `response at`: the exact time the assistant generates its reply.
  - Always use **Europe/Tartu** timezone.
  - If `AUTO_ACTIONS.md` specifies a different timestamp format or disables it, follow that file instead.

---

## 4) Governance & change control
- Follow `docs_instructions/GENERAL_INSTRUCTIONS.md` for what you may change:
  - **Do NOT modify** `STYLE_GUIDE_INSTRUCTIONS.md`.
  - **New/changed commands** → append/update `COMMANDS.md`.
  - **Auto-behavior changes** → update `AUTO_ACTIONS.md`.

---

## 5) File I/O rules for trees/lists
- Treat uploaded ZIP as the source of truth; **extract, then scan** the extracted directory.
- **LOC**: count line breaks for text files; for unreadable/binary, set `LOC=None`.
- **Timestamps**: Use ZIP’s entry timestamp for `modified`. If creation time is absent, set `created = modified`.
- Sorting: folders first, then files; each group alphabetical by name.

---

## 6) Error handling & long outputs
- If the tree is very long, **split into sequential parts** while keeping formatting identical.
- If any path is missing or unreadable, list it under an **“Issues”** note at the end, and continue with best-effort results.

---

## 7) On ambiguity
- If user prompts are ambiguous, ask one **precise** clarification question (unless `COMMANDS.md` already dictates exact behavior), in line with the style guide expectations.

---

## 8) Ready checklist (run each time a ZIP is uploaded)
1. Read this `AI_START_HERE.md`.
2. Read `GENERAL_INSTRUCTIONS.md`.
3. Read `STYLE_GUIDE_INSTRUCTIONS.md` and adopt its rules.
4. Read `COMMANDS.md` (load all commands).
5. Read `AUTO_ACTIONS.md` and run listed actions (e.g., `print quick folder list`).
6. From now on, **prepend two timestamps** (prompt/response) in **Europe/Tartu** to every reply.
7. Wait for user commands and respond per spec.
