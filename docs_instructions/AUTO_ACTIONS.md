# AUTO_ACTIONS.md

## Auto Actions (always active)

- **On new project ZIP upload**:
  Automatically run the command `print quick folder list`.

- **On every assistant reply**:
  Prepend two timestamp lines:
  ```
  [prompt at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
  [response at: YYYY-MM-DD HH:MM:SS Europe/Tartu]
  ```
  - `prompt at`: the exact time the user sent the prompt.
  - `response at`: the exact time the assistant generates the reply.
  - Always use the timezone **Europe/Tartu**.

- **If AUTO_ACTIONS.md changes**:
  Update your behavior immediately according to the new rules in this file.
