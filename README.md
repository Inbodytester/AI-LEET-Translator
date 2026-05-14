# AI-LEET-Translator

A humorous yet functional AI-powered translator that converts standard English into "1337speak" (Leet Speak) using localized LLMs.

## Overview

**AI-LEET-Translator** uses a small-parameter model (like Phi-3 or TinyLlama) to intelligently map characters and phrases to their leet equivalents, maintaining readability while maximizing the "elite" aesthetic. Unlike rule-based converters, this AI approach understands context and can choose the most appropriate substitutions.

## Example

**Input:** "Fear the hacker elite."  
**Output:** "ph34r 7h3 h4ck3r 3l173."

## Features

- **Dynamic Substitution** - Uses LLM reasoning to decide when to use numbers (0, 1, 3, 4, 7) vs symbols (@, $, !).
- **Varying "Lvl" Settings** - Adjustable complexity from "Noob" (basic) to "H4X0R" (extreme).
- **Local Execution** - Privacy-focused; no text ever leaves your machine.

## Requirements

- Python 3.9+
- Ollama or LM Studio (running locally)

## Installation

```bash
git clone https://github.com/Inbodytester/AI-LEET-Translator.git
cd AI-LEET-Translator
pip install -r requirements.txt
python leet_translate.py --text "Hello World"
```

---

> "n0 0n3 15 54f3 fr0m 7h3 41 r3v0lu710n."
