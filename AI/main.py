from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import json

# -------------------------------------------------------
# 1. KONFIGURACJA
# -------------------------------------------------------

OPENAI_API_KEY = "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"

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="LegisAI", version="1.0")

# -------------------------------------------------------
# 2. MODELE WEJŚCIA
# -------------------------------------------------------

class Comment(BaseModel):
    comment: str

class SummaryRequest(BaseModel):
    type: str   # "eks", "osr", "ust", "zmiana"
    text: str

# -------------------------------------------------------
# 3. MODERATOR — STAŁE I PROMPTY
# -------------------------------------------------------

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

Odpowiedz tylko w JSON z kluczem "decyzja".
"""

POLITYKA_MERYTORYCZNOŚCI = """
Oceń, czy komentarz jest merytoryczny na tle konsultacji publicznych nad projektem ustawy.

Komentarz merytoryczny:
- odnosi się do obszaru regulacji,
- opisuje problem lub skutki regulacji,
- wnosi argumenty, propozycje zmian lub analizę.

Komentarz niemerytoryczny:
- mem, żart, pusty emocjonalnie, offtopic.

Odpowiedz tylko JSON.
"""

# -------------------------------------------------------
# 4. SUMMARIZER — ORYGINALNE PROMPTY (1:1)
# -------------------------------------------------------

PROMPT_EKS = """
Przedstaw poniższą ekspertyzę lub opinię prawną w prostym i zrozumiałym dla obywatela języku.
Skup się wyłącznie na treści merytorycznej: jakie wnioski, oceny i argumenty przedstawia autor.
Przedstaw treść w ujednoliconym formacie:

1. Jaki jest główny temat ekspertyzy?
2. Jakie najważniejsze wnioski lub oceny przedstawia autor?
3. Jakie argumenty lub fakty uzasadniają te wnioski?
4. Jakie praktyczne znaczenie ma ta opinia (dla kogo i dlaczego?)? jeśli opinia ma znaczenie dla każdego to to zaakcentuj

Unikaj terminologii typowej dla prawniczych analiz. Nie interpretuj poza treścią dokumentu.
Nic nie bolduj.

Odpowiedź ma być w formacie:
1. Pytanie?
Odpowiedź
2. Pytanie?
Odpowiedź
3. Pytanie?
Odpowiedź
4. Pytanie?
Odpowiedź 

Oto treść ekspertyzy:

{TXT}
"""

PROMPT_OSR = """
Przedstaw poniższą Ocenę Skutków Regulacji w prostym i zrozumiałym dla obywatela języku.
Skup się wyłącznie na tym, jakie skutki, efekty i konsekwencje opisano w OSR.
Przedstaw treść w ujednoliconym formacie:

1. Jaki problem ma rozwiązać projekt?
2. Jakie rozwiązania wprowadza regulacja?
3. Kogo dotyczą przewidywane skutki?
4. Jakie będą praktyczne skutki regulacji (koszty, korzyści, zmiany w działaniu podmiotów)?

Unikaj żargonu administracyjnego i ekonomicznego. Nie interpretuj poza tym, co wynika z dokumentu.
Nic nie bolduj.

Odpowiedź ma być w formacie:
1. Pytanie?
Odpowiedź
2. Pytanie?
Odpowiedź
3. Pytanie?
Odpowiedź
4. Pytanie?
Odpowiedź 

Oto treść OSR:

{TXT}
"""

PROMPT_UST = """
Przedstaw poniższy fragment ustawy w prostym i zrozumiałym dla obywatela języku.
Skup się wyłącznie na konkretnych zmianach lub zasadach wynikających z przepisu.
Przedstaw treść w ujednoliconym formacie:

1. Co zmienia przepis? — krótko i rzeczowo.
2. Jak działa ta zmiana w praktyce?
3. Kogo dotyczy?
4. Jakie obowiązki lub ułatwienia wprowadza?

Unikaj żargonu prawnego. Nie interpretuj poza tym, co wynika wprost z tekstu. 
Nic nie bolduj.

Odpowiedź ma być w formacie:
1. Pytanie?
Odpowiedź
2. Pytanie?
Odpowiedź
3. Pytanie?
Odpowiedź
4. Pytanie?
Odpowiedź 

Oto treść ustawy:

{TXT}
"""

PROMPT_ZMIANA = """
Przedstaw poniższą fragment ustawy w prostym i zrozumiałym dla obywatela języku.
Skup się wyłącznie na konkretnych zmianach lub zasadach wynikających z przepisu.
Przedstaw treść w ujednoliconym formacie:

1. Co zmienia przepis? — krótko i rzeczowo.
2. Jak działa ta zmiana w praktyce?
3. Kogo dotyczy?
4. Jakie obowiązki lub ułatwienia wprowadza?

Unikaj żargonu prawnego. Nie interpretuj poza tym, co wynika wprost z tekstu. 
Nic nie bolduj.

Odpowiedź ma być w formacie:
1. Pytanie?
Odpowiedź
2. Pytanie?
Odpowiedź
3. Pytanie?
Odpowiedź
4. Pytanie?
Odpowiedź 

Oto fragment do opracowania:

Oto treść ustawy:

{TXT}
"""

# wybór promptu 

def build_prompt(doc_type: str, text: str) -> str:
    if doc_type == "eks":
        return PROMPT_EKS.replace("{TXT}", text)
    if doc_type == "osr":
        return PROMPT_OSR.replace("{TXT}", text)
    if doc_type == "ust":
        return PROMPT_UST.replace("{TXT}", text)
    if doc_type == "zmiana":
        return PROMPT_ZMIANA.replace("{TXT}", text)
    raise ValueError("Zły typ dokumentu (eks|osr|ust|zmiana)")





# puszczasz /summarize z jsonem typ: osr | ust | eks | zmiana + tekst do streszczenia -> tekst streszczony  

@app.post("/summarize")
async def summarize(req: SummaryRequest):

    prompt = build_prompt(req.type, req.text)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4000
    )

    summary = response.choices[0].message.content

    return {"summary": summary}

# puszczasz /moderate comment: komentarz użytkownika -> BLOCK | OK | REVIEW 

@app.post("/moderate")
async def moderate(data: Comment):

    komentarz = data.comment

    # MODERATION API
    response = client.moderations.create(
        model="omni-moderation-latest",
        input=komentarz
    )
    categories = response.results[0].categories

    decision_api = "OK"
    BLOCK = ["violence", "violence_graphic",
             "harassment_threatening", "hate_threatening",
             "self_harm"]

    for cat in BLOCK:
        if getattr(categories, cat, False):
            decision_api = "BLOCK"
            break

    # WULGARYZMY
    decision_wulgary = "REVIEW" if any(w in komentarz.lower() for w in WULGARYZMY) else "OK"

    # LLM: kultura
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
        decision_llm = kultura_json.get("decyzja", "OK")
    except:
        decision_llm = "REVIEW"

    # LLM: merytoryczność
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
        mery = mery_json.get("merytorycznosc", "TAK")
    except:
        mery = "NIE"




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

    return {"decision": final}


