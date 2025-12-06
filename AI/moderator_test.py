import os
import sys
import json
import subprocess
from pathlib import Path
from openai import OpenAI

# -------------------------------------------------------
# KONFIGURACJA
# -------------------------------------------------------

OPENAI_API_KEY = "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"

client = OpenAI(api_key=OPENAI_API_KEY)

TEST_DIR = "moderator_testy"

WULGARYZMY = [
    "chuj", "huj", "dupa", "kurwa", "pierdol", "pierdoli",
    "jebac", "jebać", "jebany", "jebana", "jebane", "jeb",
    "cipa", "cipka", "cipę", "cycki"
]

POLITYKA_MODERACJI = """
Oceń, czy komentarz może być opublikowany na platformie konsultacyjnej.

Zasady:
- Jeśli komentarz zawiera groźby, nawoływanie do przemocy, życzenie śmierci, poważną mowę nienawiści → BLOCK.
- Jeśli komentarz jest wulgarny, chamski, obraźliwy, ale nie grozi i nie nawołuje → REVIEW.
- Jeśli komentarz jest neutralny lub merytoryczny → OK.

Zwróć odpowiedź JSON:
{"decyzja": "...", "uzasadnienie": "..."}
"""

POLITYKA_MERYTORYCZNOŚCI = """
Oceń, czy komentarz jest merytoryczny w kontekście konsultacji publicznych nad projektem ustawy.

Komentarz merytoryczny:
- odnosi się do regulacji,
- opisuje problem,
- wnosi propozycje lub argumenty,
- ma sens na tle ustawy.

Komentarz niemerytoryczny:
- wulgarny bez treści,
- mem,
- czysty hejt,
- off-topic.

Zwróć JSON:
{"merytorycznosc":"TAK|NIE","uzasadnienie":"..."}
"""


# -------------------------------------------------------
# FUNKCJA: moderacja jednego komentarza
# -------------------------------------------------------

def moderate_text(komentarz: str) -> str:

    # 1. API Moderation
    response = client.moderations.create(
        model="omni-moderation-latest",
        input=komentarz
    )

    categories = response.results[0].categories

    decision_api = "OK"
    BLOCK = [
        "violence", "violence_graphic",
        "harassment_threatening",
        "hate_threatening",
        "self_harm"
    ]

    for cat in BLOCK:
        if getattr(categories, cat, False):
            decision_api = "BLOCK"
            break

    # 2. Wulgaryzmy
    decision_wulgary = "REVIEW" if any(w in komentarz.lower() for w in WULGARYZMY) else "OK"

    # 3. LLM — kultura
    kultura_prompt = f"""
    {POLITYKA_MODERACJI}

    Komentarz:
    \"\"\"{komentarz}\"\"\" 
    """

    kultura_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Moduł kultury wypowiedzi."},
            {"role": "user", "content": kultura_prompt}
        ]
    )

    try:
        kultura_json = json.loads(kultura_resp.choices[0].message.content)
        decision_llm = kultura_json.get("decyzja", "REVIEW")
    except:
        decision_llm = "REVIEW"

    # 4. LLM — merytoryczność
    mery_prompt = f"""
    {POLITYKA_MERYTORYCZNOŚCI}

    Komentarz:
    \"\"\"{komentarz}\"\"\" 
    """

    mery_resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Moduł oceny merytoryczności komentarza."},
            {"role": "user", "content": mery_prompt}
        ]
    )

    try:
        mery_json = json.loads(mery_resp.choices[0].message.content)
        mery = mery_json.get("merytorycznosc", "NIE")
    except:
        mery = "NIE"

    # 5. FINAL LOGIC
    final = "OK"

    if decision_api == "BLOCK":
        final = "BLOCK"
    elif decision_llm == "BLOCK":
        final = "BLOCK"
    elif mery == "NIE":
        final = "REVIEW"
    elif decision_wulgary == "REVIEW":
        final = "REVIEW"
    elif decision_llm == "REVIEW":
        final = "REVIEW"

    return final


# -------------------------------------------------------
# 6. ODPALANIE WSZYSTKICH TESTÓW Z KATALOGU
# -------------------------------------------------------

def run_all_tests():
    if not os.path.exists(TEST_DIR):
        print(f"\n❌ Brak folderu: {TEST_DIR}\n")
        return

    test_files = [f for f in os.listdir(TEST_DIR) if f.endswith(".txt")]

    if not test_files:
        print(f"\n❌ Brak plików *.txt w katalogu {TEST_DIR}\n")
        return

    print("\n============================================")
    print("🚀 START TESTÓW MODERATORA")
    print("============================================\n")

    for file in test_files:
        full_path = os.path.join(TEST_DIR, file)

        print("➡️ TEST:", file)
        print("--------------------------------------------")

        with open(full_path, "r", encoding="utf-8") as f:
            text = f.read()

        decision = moderate_text(text)

        print(f"📌 Decyzja: {decision}\n")




if __name__ == "__main__":
    run_all_tests()
