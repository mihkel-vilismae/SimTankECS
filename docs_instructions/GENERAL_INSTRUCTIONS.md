_Version: v1.3 – 2025-09-09 22:45:44 EEST_




- DO NOT MODIFY THE  STYLE_GUIDE_INSTRUCTIONS.md file (keep it verbatim),
- if i want to add a new command for AI, then append it to the file COMMANDS.md 
- if i tell you to change/add automatic actions after every prompt, then modify the AUTO_ACTIONS.md file
- 

## Smoke Test Checklist (for verifying AI behavior after upload)

1. Upload the project ZIP.
2. Confirm the assistant:
   - Reads `docs_instructions/AI_START_HERE.md` first.
   - Loads and follows `GENERAL_INSTRUCTIONS.md`.
   - Loads and strictly applies `STYLE_GUIDE_INSTRUCTIONS.md` (never modifies it).
   - Loads `COMMANDS.md` and recognizes all defined commands.
   - Loads and executes `AUTO_ACTIONS.md` (auto-run `print quick folder list`, timestamps).
3. Issue command `print quick folder list`.
   - Expect folder-only tree, counts shown, NO LOC totals.
4. Issue command `print folder list`.
   - Expect folder-only tree with LOC totals included.
5. Issue command `print full filelist`.
   - Expect complete tree including files with `(LOC, created, modified)`.
6. Verify each assistant answer begins with two timestamp lines:
   ```
   [prompt at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
   [response at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
   ```


## Changelog

- 2025-09-09 – v1.1: Added version markers to all instruction files; created Smoke Test Checklist.- 2025-09-09 19:30:46 – v1.1: Added time to version markers in all instruction files; created standalone CHANGELOG.md.- 2025-09-09 19:40:58 – v1.2: Auto-incremented version and regenerated instruction bundle.- 2025-09-09 22:45:44 EEST – v1.3: Auto-incremented version and regenerated instruction bundle.
