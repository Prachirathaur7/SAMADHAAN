from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
import re
import math
import speech_recognition as sr
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="SAMADHAAN AI Engine",
    description="AI, ML, Prediction and Responsible AI APIs for SAMADHAAN",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# DATA MODELS
# ============================================================

class ComplaintRequest(BaseModel):
    complaint: str
    language: Optional[str] = "auto"
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class TranslationRequest(BaseModel):
    text: str
    target_language: str


class SimilarityRequest(BaseModel):
    complaint: str
    previous_complaints: List[str]

class ComplaintClusterRequest(BaseModel):
    complaints: List[str]


class LocationSimilarityRequest(BaseModel):
    complaint: str
    latitude: float
    longitude: float
    previous_complaints: List[dict]


class TimeSimilarityRequest(BaseModel):
    complaint: str
    complaint_time: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    previous_complaints: List[dict]

class PredictionRequest(BaseModel):
    complaints: List[dict]


class OfficerCopilotRequest(BaseModel):
    complaint: str
    department: Optional[str] = None
    priority: Optional[str] = None


class CitizenAssistantRequest(BaseModel):
    question: str
    language: Optional[str] = "English"


class SecurityRequest(BaseModel):
    text: str

# ============================================================
# KEYWORD DATABASE
# ============================================================

DEPARTMENT_KEYWORDS = {

    "Roads & Transport": [
        "road", "pothole", "street", "traffic", "footpath",
        "highway", "divider", "road damage", "damaged road",
        "accident", "speed breaker"
    ],

    "Sanitation": [
        "garbage", "waste", "dustbin", "dirty", "cleaning",
        "litter", "trash", "sanitation", "dead animal"
    ],

    "Water Supply": [
        "water", "pipeline", "tap", "leakage", "drinking water",
        "water supply", "no water", "dirty water"
    ],

    "Drainage": [
        "drain", "sewer", "sewage", "waterlogging", "flood",
        "overflow", "blocked drain", "drainage"
    ],

    "Electricity": [
        "electricity", "power", "light", "streetlight",
        "street light", "transformer", "wire", "current"
    ],

    "Public Health": [
        "hospital", "health", "medicine", "doctor", "disease",
        "clinic", "mosquito", "fever"
    ],

    "Public Infrastructure": [
        "building", "park", "bench", "bridge", "infrastructure",
        "public toilet", "damaged structure"
    ]
}


CATEGORY_KEYWORDS = {

    "Pothole": [
        "pothole", "hole in road", "road hole"
    ],

    "Garbage": [
        "garbage", "waste", "trash", "litter", "dustbin"
    ],

    "Waterlogging": [
        "waterlogging", "water logged", "flooded", "flood",
        "standing water"
    ],

    "Streetlight": [
        "streetlight", "street light", "lamp", "light not working"
    ],

    "Water Leakage": [
        "water leakage", "pipeline leakage", "pipe leak",
        "leaking pipe"
    ],

    "Drain Overflow": [
    "drain overflow",
    "overflowing drain",
    "sewer overflow",
    "drain is overflowing",
    "drain overflowing",
    "overflowing drain water"
],

    "Damaged Road": [
        "damaged road", "broken road", "road damage"
    ],

    "Electricity": [
        "power cut", "electricity", "power outage",
        "transformer", "electric wire"
    ]
}


# ============================================================
# BASIC NLP FUNCTIONS
# ============================================================

def clean_text(text: str) -> str:
    text = text.lower()

    # Normalize common civic synonyms
    synonym_map = {
        "huge": "large",
        "big": "large",
        "massive": "large",

        "close": "near",
        "nearby": "near",
        "beside": "near",
        "around": "near",

        "street": "road",
        "highway": "road",

        "garbage": "waste",
        "trash": "waste",
        "rubbish": "waste",

        "broken": "damaged",
        "destroyed": "damaged",

        "light": "streetlight",
        "street light": "streetlight",

        "potholes": "pothole",
        "holes": "pothole",

        "leaking": "leakage",
        "leak": "leakage",

        "overflowing": "overflow",
        "flooded": "waterlogging"
    }

    for old, new in sorted(
        synonym_map.items(),
        key=lambda x: len(x[0]),
        reverse=True
    ):
        text = re.sub(
            rf"\b{re.escape(old)}\b",
            new,
            text
        )

    text = re.sub(
        r"[^a-zA-Z0-9\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def detect_language(text: str) -> str:

    # Bengali
    if any("\u0980" <= char <= "\u09FF" for char in text):
        return "Bengali"

    # Hindi / Devanagari
    if any("\u0900" <= char <= "\u097F" for char in text):
        return "Hindi"

    # Punjabi / Gurmukhi
    if any("\u0A00" <= char <= "\u0A7F" for char in text):
        return "Punjabi"

    # Gujarati
    if any("\u0A80" <= char <= "\u0AFF" for char in text):
        return "Gujarati"

    # Odia
    if any("\u0B00" <= char <= "\u0B7F" for char in text):
        return "Odia"

    # Tamil
    if any("\u0B80" <= char <= "\u0BFF" for char in text):
        return "Tamil"

    # Telugu
    if any("\u0C00" <= char <= "\u0C7F" for char in text):
        return "Telugu"

    # Kannada
    if any("\u0C80" <= char <= "\u0CFF" for char in text):
        return "Kannada"

    # Malayalam
    if any("\u0D00" <= char <= "\u0D7F" for char in text):
        return "Malayalam"

    # English
    if re.search(r"[a-zA-Z]", text):
        return "English"

    return "Unknown"

def extract_keywords(text: str):

    words = clean_text(text).split()

    stopwords = {
        "the", "is", "a", "an", "and", "of", "to", "in",
        "on", "for", "this", "that", "there", "are", "my",
        "has", "have", "been", "with", "from"
    }

    keywords = [
        word for word in words
        if word not in stopwords and len(word) > 3
    ]

    return list(dict.fromkeys(keywords))[:15]


def classify_department(text: str):

    text = clean_text(text)

    scores = {}

    for department, keywords in DEPARTMENT_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1

        scores[department] = score

    department = max(scores, key=scores.get)

    if scores[department] == 0:
        department = "General Administration"
        confidence = 0.40
    else:
        total = sum(scores.values())
        confidence = min(
            0.98,
            0.50 + (scores[department] / max(total, 1)) * 0.48
        )

    return department, round(confidence, 2)


def classify_category(text: str):

    text = clean_text(text)

    scores = {}

    for category, keywords in CATEGORY_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1

        scores[category] = score

    category = max(scores, key=scores.get)

    if scores[category] == 0:
        return "General Complaint", 0.40

    confidence = min(
        0.98,
        0.55 + scores[category] * 0.15
    )

    return category, round(confidence, 2)


# ============================================================
# PRIORITY / SEVERITY / URGENCY
# ============================================================

HIGH_PRIORITY_WORDS = [
    "emergency",
    "urgent",
    "danger",
    "accident",
    "fire",
    "flood",
    "hospital",
    "injury",
    "life threatening",
    "electric wire",
    "open manhole",
    "major accident",
    "severe flooding"
]

MEDIUM_PRIORITY_WORDS = [
    "leakage",
    "overflow",
    "broken",
    "damaged",
    "blocked",
    "problem",
    "not working",
    "pothole",
    "large pothole",
    "deep pothole",
    "damaged road",
    "water leakage",
    "drain overflow"
]


def predict_priority(text: str):

    text = clean_text(text)

    high = sum(
        word in text
        for word in HIGH_PRIORITY_WORDS
    )

    medium = sum(
        word in text
        for word in MEDIUM_PRIORITY_WORDS
    )

    # Critical/high-risk situations
    if high > 0:
        return "HIGH"

    # Civic infrastructure problems requiring action
    if medium > 0:
        return "MEDIUM"

    return "LOW"


def predict_severity(text: str):

    text = clean_text(text)

    if any(word in text for word in [
        "death", "fire", "accident", "danger",
        "electric wire", "flood", "injury"
    ]):
        return "CRITICAL"

    if any(word in text for word in [
        "major", "severe", "large", "overflow",
        "hospital", "emergency"
    ]):
        return "HIGH"

    if any(word in text for word in [
        "broken", "damaged", "leakage", "blocked"
    ]):
        return "MEDIUM"

    return "LOW"


def predict_urgency(text: str):

    text = clean_text(text)

    urgent_words = [
        "urgent",
        "immediately",
        "emergency",
        "danger",
        "as soon as possible",
        "critical"
    ]

    if any(word in text for word in urgent_words):
        return "HIGH"

    if any(word in text for word in [
        "soon", "quickly", "problem"
    ]):
        return "MEDIUM"

    return "LOW"


# ============================================================
# SENTIMENT ANALYSIS
# ============================================================

NEGATIVE_WORDS = [
    "bad", "worst", "angry", "frustrated", "terrible",
    "dirty", "dangerous", "problem", "failed", "broken",
    "unacceptable", "horrible", "poor"
]

POSITIVE_WORDS = [
    "good", "great", "thanks", "thank", "helpful",
    "excellent", "solved", "happy"
]


def sentiment_analysis(text: str):

    text = clean_text(text)

    positive = sum(word in text for word in POSITIVE_WORDS)
    negative = sum(word in text for word in NEGATIVE_WORDS)

    if negative > positive:
        return "Negative"

    if positive > negative:
        return "Positive"

    return "Neutral"


# ============================================================
# ENTITY EXTRACTION
# ============================================================
def extract_entities(text: str):

    entities = {
        "locations": [],
        "dates": [],
        "phone_numbers": [],
        "emails": []
    }

    # --------------------------------------------------------
    # LOCATION EXTRACTION
    # --------------------------------------------------------

    location_patterns = [
        r"\b(?:near|at|in|around|beside|behind|opposite)\s+(?:the\s+)?([A-Za-z]+(?:\s+[A-Za-z]+){0,4})",

        r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b"
    ]

    locations = []

    for pattern in location_patterns:

        matches = re.findall(
            pattern,
            text
        )

        for match in matches:

            location = (
                match.strip()
                if isinstance(match, str)
                else match[0].strip()
            )

            if len(location) > 2:
                locations.append(location)

    entities["locations"] = list(
        dict.fromkeys(locations)
    )[:10]

    # --------------------------------------------------------
    # DATE EXTRACTION
    # --------------------------------------------------------

    dates = re.findall(
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        text
    )

    entities["dates"] = list(
        dict.fromkeys(dates)
    )[:10]

    # --------------------------------------------------------
    # PHONE NUMBER EXTRACTION
    # --------------------------------------------------------

    phones = re.findall(
        r"\b(?:\+91[-\s]?)?[6-9]\d{9}\b",
        text
    )

    entities["phone_numbers"] = list(
        dict.fromkeys(phones)
    )[:10]

    # --------------------------------------------------------
    # EMAIL EXTRACTION
    # --------------------------------------------------------

    emails = re.findall(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        text
    )

    entities["emails"] = list(
        dict.fromkeys(emails)
    )[:10]

    return entities


def speech_to_text(audio_file, language="auto"):

    recognizer = sr.Recognizer()

    try:

        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)

        language_codes = {
            "English": "en-IN",
            "Hindi": "hi-IN",
            "Tamil": "ta-IN",
            "Bengali": "bn-IN",
            "Telugu": "te-IN"
        }

        if language.lower() == "auto":
            text = recognizer.recognize_google(audio)
        else:
            recognition_language = language_codes.get(
                language.title(),
                "en-IN"
            )

            text = recognizer.recognize_google(
                audio,
                language=recognition_language
            )

        detected_language = detect_language(text)

        return {
            "success": True,
            "text": text,
            "language": detected_language,
            "confidence": 0.90
        }

    except sr.UnknownValueError:

        return {
            "success": False,
            "text": "",
            "language": "Unknown",
            "confidence": 0.0,
            "error": "Speech could not be understood"
        }

    except sr.RequestError:

        return {
            "success": False,
            "text": "",
            "language": "Unknown",
            "confidence": 0.0,
            "error": "Speech recognition service unavailable"
        }

    except Exception as e:

        return {
            "success": False,
            "text": "",
            "language": "Unknown",
            "confidence": 0.0,
            "error": str(e)
        }


# ============================================================
# PROBLEM IDENTIFICATION
# ============================================================

def identify_problem(text: str):

    text = text.lower().strip()

    problem_patterns = {
        "Pothole": [
            "pothole",
            "road hole",
            "hole in road"
        ],

        "Garbage Accumulation": [
            "garbage",
            "waste",
            "trash",
            "rubbish",
            "litter"
        ],

        "Waterlogging": [
            "waterlogging",
            "water logged",
            "standing water",
            "flooded",
            "flood"
        ],

        "Streetlight Failure": [
            "streetlight",
            "street light",
            "lamp",
            "light not working"
        ],

        "Water Leakage": [
            "water leakage",
            "pipeline leakage",
            "pipe leak",
            "leaking pipe"
        ],

        "Drain Overflow": [
    "drain overflow",
    "overflowing drain",
    "sewer overflow",
    "drain is overflowing",
    "drain overflowing",
    "overflowing drain water"
],

        "Damaged Road": [
            "damaged road",
            "broken road",
            "road damage"
        ],

        "Electricity Problem": [
            "power cut",
            "electricity",
            "power outage",
            "transformer",
            "electric wire"
        ]
    }

    detected_problems = []

    for problem, keywords in problem_patterns.items():

        for keyword in keywords:

            if keyword in text:
                detected_problems.append(problem)
                break

    if not detected_problems:

        return {
            "problem": "General Civic Problem",
            "problem_type": "Unclassified",
            "confidence": 0.40
        }

    # Use the first detected problem as the primary problem
    primary_problem = detected_problems[0]

    return {
        "problem": primary_problem,
        "problem_type": primary_problem,
        "confidence": round(
            min(0.95, 0.60 + len(detected_problems) * 0.10),
            2
        )
    }

# ============================================================
# MULTILINGUAL CIVIC TEXT NORMALIZATION
# ============================================================

def normalize_multilingual_complaint(text: str, language: str) -> str:

    language = language.lower().strip()

    # ============================================================
    # BENGALI
    # ============================================================

    bengali_patterns = {
        "রাস্তায় অনেক বড় গর্ত আছে": "there is a large pothole on the road",
        "রাস্তায় গর্ত আছে": "there is a pothole on the road",
        "রাস্তায় কচরা আছে": "there is garbage on the road",
        "রাস্তায় কচরা পড়ে আছে": "there is garbage on the road",
        "রাস্তায় পানি জমে আছে": "there is waterlogging on the road",
        "নালা উপচে পড়ছে": "the drain is overflowing",
        "স্ট্রিট লাইট কাজ করছে না": "the streetlight is not working",
        "পানির পাইপে লিক হয়েছে": "there is a water pipeline leakage"
    }

    # ============================================================
    # HINDI
    # ============================================================

    hindi_patterns = {
        "सड़क पर बड़ा गड्ढा है": "there is a large pothole on the road",
        "सड़क पर गड्ढा है": "there is a pothole on the road",
        "सड़क पर कचरा है": "there is garbage on the road",
        "सड़क पर पानी भरा हुआ है": "there is waterlogging on the road",
        "नाला भर गया है": "the drain is overflowing",
        "स्ट्रीट लाइट काम नहीं कर रही है": "the streetlight is not working",
        "पानी की पाइपलाइन में रिसाव है": "there is a water pipeline leakage"
    }

    # ============================================================
    # TAMIL
    # ============================================================

    tamil_patterns = {
        "சாலையில் பெரிய பள்ளம் உள்ளது": "there is a large pothole on the road",
        "சாலையில் பள்ளம் உள்ளது": "there is a pothole on the road",
        "சாலையில் குப்பை உள்ளது": "there is garbage on the road",
        "சாலையில் தண்ணீர் தேங்கியுள்ளது": "there is waterlogging on the road",
        "தெருவிளக்கு வேலை செய்யவில்லை": "the streetlight is not working"
    }

    # ============================================================
    # TELUGU
    # ============================================================

    telugu_patterns = {
        "రోడ్డుపై పెద్ద గుంత ఉంది": "there is a large pothole on the road",
        "రోడ్డుపై గుంత ఉంది": "there is a pothole on the road",
        "రోడ్డుపై చెత్త ఉంది": "there is garbage on the road",
        "రోడ్డుపై నీరు నిలిచిపోయింది": "there is waterlogging on the road",
        "వీధి దీపం పనిచేయడం లేదు": "the streetlight is not working"
    }

    patterns = {}

    if language == "bengali":
        patterns = bengali_patterns

    elif language == "hindi":
        patterns = hindi_patterns

    elif language == "tamil":
        patterns = tamil_patterns

    elif language == "telugu":
        patterns = telugu_patterns

    # Exact civic phrase matching
    for regional_text, english_text in patterns.items():

        if regional_text in text:
            return english_text

    # English complaints don't need normalization
    return text

# ============================================================
# SPEECH TO TEXT
# ============================================================
def speech_to_text(audio_file, language="auto"):
    recognizer = sr.Recognizer()

    language_codes = {
        "English": "en-IN",
        "Hindi": "hi-IN",
        "Bengali": "bn-IN",
        "Tamil": "ta-IN",
        "Telugu": "te-IN"
    }

    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)

        if language == "auto":
            recognition_languages = [
                "en-IN",
                "hi-IN",
                "bn-IN",
                "ta-IN",
                "te-IN"
            ]
        else:
            recognition_languages = [
                language_codes.get(language, "en-IN")
            ]

        text = ""

        for lang_code in recognition_languages:
            try:
                text = recognizer.recognize_google(
                    audio,
                    language=lang_code
                )

                if text:
                    break

            except sr.UnknownValueError:
                continue

        if not text:
            return {
                "success": False,
                "text": "",
                "language": "Unknown",
                "confidence": 0.0,
                "error": "Speech could not be understood"
            }

        detected_language = detect_language(text)

        return {
            "success": True,
            "text": text,
            "language": detected_language,
            "confidence": 0.90
        }

    except sr.RequestError:
        return {
            "success": False,
            "text": "",
            "language": "Unknown",
            "confidence": 0.0,
            "error": "Speech recognition service unavailable"
        }

    except Exception as e:
        return {
            "success": False,
            "text": "",
            "language": "Unknown",
            "confidence": 0.0,
            "error": str(e)
        }
# ============================================================
# COMPLAINT SUMMARY
# ============================================================

def summarize_complaint(text: str):

    sentences = re.split(r"[.!?]", text)

    sentences = [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

    if len(sentences) <= 2:
        return text.strip()

    keywords = extract_keywords(text)

    scored = []

    for sentence in sentences:

        score = sum(
            word in clean_text(sentence)
            for word in keywords
        )

        scored.append((score, sentence))

    scored.sort(reverse=True)

    summary = ". ".join(
        sentence for _, sentence in scored[:2]
    )

    return summary + "."


# ============================================================
# MULTILINGUAL AI RESPONSE
# ============================================================

def generate_multilingual_response(
    problem: str,
    department: str,
    language: str
):

    responses = {

        "English": (
            f"Your complaint has been identified as {problem}. "
            f"It should be handled by the {department} department."
        ),

        "Hindi": (
            f"आपकी शिकायत की पहचान {problem} के रूप में हुई है। "
            f"इसे {department} विभाग द्वारा संभाला जाना चाहिए।"
        ),

        "Bengali": (
            f"আপনার অভিযোগটি {problem} হিসেবে শনাক্ত করা হয়েছে। "
            f"এটি {department} বিভাগ দ্বারা সমাধান করা উচিত।"
        ),

        "Tamil": (
            f"உங்கள் புகார் {problem} என அடையாளம் காணப்பட்டுள்ளது. "
            f"இது {department} துறையால் கையாளப்பட வேண்டும்."
        ),

        "Telugu": (
            f"మీ ఫిర్యాదు {problem}గా గుర్తించబడింది. "
            f"దీనిని {department} శాఖ పరిష్కరించాలి."
        )
    }

    return responses.get(
        language,
        responses["English"]
    )

# ============================================================
# DUPLICATE / SIMILARITY
# ============================================================

def text_similarity(text1: str, text2: str):
    """
    Calculate semantic text similarity using
    TF-IDF vectors and cosine similarity.
    """

    text1 = clean_text(text1)
    text2 = clean_text(text2)

    if not text1 or not text2:
        return 0.0

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words="english"
    )

    try:
        vectors = vectorizer.fit_transform(
            [text1, text2]
        )

        similarity = cosine_similarity(
            vectors[0:1],
            vectors[1:2]
        )[0][0]

        return round(float(similarity), 3)

    except ValueError:
        return 0.0


def find_similar_complaints(
    complaint: str,
    previous_complaints: List[str]
):
    """
    Find duplicate and similar complaints using
    TF-IDF + cosine similarity.
    """

    results = []

    for index, previous in enumerate(previous_complaints):

        similarity = text_similarity(
            complaint,
            previous
        )

        if similarity >= 0.70:
            match_type = "DUPLICATE"

        elif similarity >= 0.35:
            match_type = "SIMILAR"

        else:
            match_type = "UNRELATED"

        results.append({
            "index": index,
            "complaint": previous,
            "similarity": similarity,
            "match_type": match_type,
            "is_duplicate": similarity >= 0.70
        })

    results.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return results

def cluster_complaints(complaints: List[str]):

    if not complaints:
        return []

    if len(complaints) == 1:
        return [{
            "cluster_id": 1,
            "complaints": complaints,
            "cluster_size": 1
        }]

    cleaned_complaints = [
        clean_text(complaint)
        for complaint in complaints
    ]

    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        stop_words="english"
    )

    try:
        vectors = vectorizer.fit_transform(
            cleaned_complaints
        )

        similarity_matrix = cosine_similarity(vectors)

    except ValueError:
        return [{
            "cluster_id": index + 1,
            "complaints": [complaint],
            "cluster_size": 1
        } for index, complaint in enumerate(complaints)]

    clusters = []
    assigned = set()

    similarity_threshold = 0.35

    for i in range(len(complaints)):

        if i in assigned:
            continue

        cluster = [i]
        assigned.add(i)

        for j in range(i + 1, len(complaints)):

            if j in assigned:
                continue

            if similarity_matrix[i][j] >= similarity_threshold:
                cluster.append(j)
                assigned.add(j)

        clusters.append(cluster)

    results = []

    for cluster_id, cluster_indices in enumerate(
        clusters,
        start=1
    ):

        cluster_complaints_list = [
            complaints[index]
            for index in cluster_indices
        ]

        categories = [
            classify_category(complaints[index])[0]
            for index in cluster_indices
        ]

        category = Counter(categories).most_common(1)[0][0]

        results.append({
            "cluster_id": cluster_id,
            "category": category,
            "complaints": cluster_complaints_list,
            "cluster_size": len(cluster_complaints_list),
            "representative_complaint":
                cluster_complaints_list[0]
        })

    return results
# ============================================================
# LOCATION-BASED SIMILARITY
# ============================================================

def calculate_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float
):
    """
    Calculate distance between two GPS coordinates
    using the Haversine formula.
    Returns distance in kilometers.
    """

    R = 6371.0

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)

    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return round(R * c, 3)


def location_based_similarity(
    complaint: str,
    latitude: float,
    longitude: float,
    previous_complaints: List[dict]
):

    results = []

    current_category, _ = classify_category(
        complaint
    )

    for index, previous in enumerate(
        previous_complaints
    ):

        previous_text = previous.get(
            "complaint",
            ""
        )

        previous_lat = previous.get(
            "latitude"
        )

        previous_lon = previous.get(
            "longitude"
        )

        

        # Text similarity
        text_score = text_similarity(
            complaint,
            previous_text
        )

        # Location similarity
        location_score = 0.0
        distance_km = None

        if (
            previous_lat is not None
            and previous_lon is not None
        ):

            distance_km = calculate_distance(
                latitude,
                longitude,
                previous_lat,
                previous_lon
            )

            if distance_km <= 0.1:
                location_score = 1.0

            elif distance_km <= 0.5:
                location_score = 0.8

            elif distance_km <= 1.0:
                location_score = 0.5

            elif distance_km <= 2.0:
                location_score = 0.2

        # Category similarity
        previous_category, _ = classify_category(
            previous_text
        )

        category_score = (
            1.0
            if current_category == previous_category
            else 0.0
        )

        # Combined similarity
        combined_score = (
            (text_score * 0.60)
            + (location_score * 0.25)
            + (category_score * 0.15)
        )

        combined_score = round(
            combined_score,
            3
        )

        if combined_score >= 0.70:
            match_type = "DUPLICATE"

        elif combined_score >= 0.45:
            match_type = "SIMILAR"

        else:
            match_type = "UNRELATED"

        results.append({
            "index": index,
            "complaint": previous_text,
            "text_similarity": text_score,
            "location_distance_km": distance_km,
            "location_similarity": location_score,
            "category": previous_category,
            "category_match": category_score == 1.0,
            "combined_similarity": combined_score,
            "match_type": match_type,
            "is_duplicate": combined_score >= 0.70
        })

    results.sort(
        key=lambda x: x["combined_similarity"],
        reverse=True
    )

    return results


# ============================================================
# TIME-BASED SIMILARITY
# ============================================================

def calculate_time_similarity(
    time1: str,
    time2: str
):
    """
    Calculate similarity based on time difference.

    Same day       -> 1.0
    Within 3 days  -> 0.8
    Within 7 days  -> 0.5
    Within 30 days -> 0.2
    Older          -> 0.0
    """

    try:
        date1 = datetime.fromisoformat(time1)
        date2 = datetime.fromisoformat(time2)

        difference = abs(
            (date1 - date2).total_seconds()
        )

        days = difference / (24 * 60 * 60)

        if days <= 1:
            return 1.0

        elif days <= 3:
            return 0.8

        elif days <= 7:
            return 0.5

        elif days <= 30:
            return 0.2

        else:
            return 0.0

    except (ValueError, TypeError):
        return 0.0

def time_based_similarity(
    complaint: str,
    complaint_time: str,
    latitude: Optional[float],
    longitude: Optional[float],
    previous_complaints: List[dict]
):

    results = []

    current_category, _ = classify_category(complaint)

    try:
        current_time = datetime.fromisoformat(
            complaint_time.replace("Z", "+00:00")
        )
    except Exception:
        current_time = None

    for index, previous in enumerate(previous_complaints):

        previous_text = previous.get("complaint", "")
        previous_time = previous.get("complaint_time")

        # TEXT SIMILARITY
        text_score = text_similarity(
            complaint,
            previous_text
        )

        # CATEGORY SIMILARITY
        previous_category, _ = classify_category(
            previous_text
        )

        category_score = (
            1.0
            if current_category == previous_category
            else 0.0
        )

        # TIME SIMILARITY
        time_score = 0.0

        if current_time and previous_time:

            try:
                previous_datetime = datetime.fromisoformat(
                    previous_time.replace("Z", "+00:00")
                )

                difference_hours = abs(
                    (
                        current_time - previous_datetime
                    ).total_seconds()
                ) / 3600

                if difference_hours <= 24:
                    time_score = 1.0

                elif difference_hours <= 72:
                    time_score = 0.8

                elif difference_hours <= 168:
                    time_score = 0.5

                elif difference_hours <= 720:
                    time_score = 0.2

            except Exception:
                time_score = 0.0

        # LOCATION SIMILARITY
        location_score = 0.0

        previous_latitude = previous.get("latitude")
        previous_longitude = previous.get("longitude")

        if (
            latitude is not None
            and longitude is not None
            and previous_latitude is not None
            and previous_longitude is not None
        ):

            lat_difference = abs(
                latitude - previous_latitude
            )

            lon_difference = abs(
                longitude - previous_longitude
            )

            if (
                lat_difference <= 0.01
                and lon_difference <= 0.01
            ):
                location_score = 1.0

            elif (
                lat_difference <= 0.05
                and lon_difference <= 0.05
            ):
                location_score = 0.5

        # FINAL SCORE
        similarity = (
            text_score * 0.50
            + category_score * 0.20
            + time_score * 0.15
            + location_score * 0.15
        )

        if similarity >= 0.70:
            match_type = "DUPLICATE"
            is_duplicate = True

        elif similarity >= 0.40:
            match_type = "SIMILAR"
            is_duplicate = False

        else:
            match_type = "UNRELATED"
            is_duplicate = False

        results.append({
            "index": index,
            "complaint": previous_text,
            "text_similarity": round(text_score, 3),
            "category_similarity": round(category_score, 3),
            "time_similarity": round(time_score, 3),
            "location_similarity": round(location_score, 3),
            "similarity": round(similarity, 3),
            "match_type": match_type,
            "is_duplicate": is_duplicate
        })

    results.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return results


# ===========================================================
# LOCATION-BASED SIMILARITY
# ============================================================

def calculate_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float
):
    """
    Calculate distance between two GPS coordinates
    using the Haversine formula.
    Returns distance in kilometers.
    """

    R = 6371.0

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)

    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return round(R * c, 3)


def location_based_similarity(
    complaint: str,
    latitude: float,
    longitude: float,
    previous_complaints: List[dict]
):

    results = []

    current_category, _ = classify_category(
        complaint
    )

    for index, previous in enumerate(
        previous_complaints
    ):

        previous_text = previous.get(
            "complaint",
            ""
        )

        previous_lat = previous.get(
            "latitude"
        )

        previous_lon = previous.get(
            "longitude"
        )

        # Text similarity
        text_score = text_similarity(
            complaint,
            previous_text
        )

        # Location similarity
        location_score = 0.0
        distance_km = None

        if (
            previous_lat is not None
            and previous_lon is not None
        ):

            distance_km = calculate_distance(
                latitude,
                longitude,
                previous_lat,
                previous_lon
            )

            if distance_km <= 0.1:
                location_score = 1.0

            elif distance_km <= 0.5:
                location_score = 0.8

            elif distance_km <= 1.0:
                location_score = 0.5

            elif distance_km <= 2.0:
                location_score = 0.2

            else:
                location_score = 0.0

        # Category similarity
        previous_category, _ = classify_category(
            previous_text
        )

        category_score = (
            1.0
            if current_category == previous_category
            else 0.0
        )

        # Combined score
        combined_score = (
            (text_score * 0.60)
            +
            (location_score * 0.25)
            +
            (category_score * 0.15)
        )

        combined_score = round(
            combined_score,
            3
        )

        if combined_score >= 0.70:
            match_type = "DUPLICATE"

        elif combined_score >= 0.45:
            match_type = "SIMILAR"

        else:
            match_type = "UNRELATED"

        results.append({
            "index": index,
            "complaint": previous_text,
            "text_similarity": text_score,
            "location_distance_km": distance_km,
            "location_similarity": location_score,
            "category": previous_category,
            "category_match": category_score == 1.0,
            "combined_similarity": combined_score,
            "match_type": match_type,
            "is_duplicate": combined_score >= 0.70
        })

    results.sort(
        key=lambda x: x["combined_similarity"],
        reverse=True
    )

    return results
# ============================================================
# TRANSLATION
# ============================================================
def simple_translation(text: str, target_language: str):

    target_language = target_language.lower().strip()
    text = text.strip()

    # ============================================================
    # COMMON CIVIC COMPLAINT TRANSLATIONS
    # ============================================================

    hindi_to_english_phrases = {
        "कचरा सड़क पर है": "Garbage is on the road.",
        "सड़क पर कचरा है": "There is garbage on the road.",
        "कचरा नहीं उठाया गया है": "Garbage has not been collected.",
        "कचरा कई दिनों से नहीं उठाया गया है": "Garbage has not been collected for several days.",

        "सड़क पर गड्ढा है": "There is a pothole on the road.",
        "सड़क पर बड़ा गड्ढा है": "There is a large pothole on the road.",
        "मुख्य सड़क पर गड्ढा है": "There is a pothole on the main road.",

        "सड़क पर पानी भरा हुआ है": "There is waterlogging on the road.",
        "बारिश के कारण सड़क पर पानी भर गया है": "The road is waterlogged due to rain.",

        "स्ट्रीट लाइट काम नहीं कर रही है": "The streetlight is not working.",
        "सड़क की लाइट खराब है": "The streetlight is not working.",

        "पानी की पाइपलाइन में रिसाव है": "There is a water pipeline leakage.",
        "पाइप से पानी लीक हो रहा है": "Water is leaking from the pipe.",

        "नाला भर गया है": "The drain is overflowing.",
        "नाला ओवरफ्लो हो रहा है": "The drain is overflowing.",
        "नाला पानी से भर गया है": "The drain is filled with water.",

        "बिजली नहीं है": "There is no electricity.",
        "बिजली चली गई है": "The power has gone out."
    }

    english_to_hindi_phrases = {
        "garbage is on the road": "सड़क पर कचरा है",
        "there is garbage on the road": "सड़क पर कचरा है",
        "garbage has not been collected": "कचरा नहीं उठाया गया है",

        "there is a pothole on the road": "सड़क पर गड्ढा है",
        "there is a large pothole on the road": "सड़क पर बड़ा गड्ढा है",

        "there is waterlogging on the road": "सड़क पर पानी भरा हुआ है",
        "the road is waterlogged due to rain": "बारिश के कारण सड़क पर पानी भर गया है",

        "the streetlight is not working": "स्ट्रीट लाइट काम नहीं कर रही है",

        "there is a water pipeline leakage": "पानी की पाइपलाइन में रिसाव है",
        "water is leaking from the pipe": "पाइप से पानी लीक हो रहा है",

        "the drain is overflowing": "नाला भर गया है",

        "there is no electricity": "बिजली नहीं है",
        "the power has gone out": "बिजली चली गई है"
    }

    # ============================================================
    # HINDI → ENGLISH
    # ============================================================

    if target_language == "english":

        normalized_text = re.sub(r"\s+", " ", text).strip()

        # Exact phrase match
        if normalized_text in hindi_to_english_phrases:
            return hindi_to_english_phrases[normalized_text]

        # Existing individual civic words as fallback
        hindi_to_english_words = {
            "सड़क": "road",
            "कचरा": "garbage",
            "पानी": "water",
            "नाला": "drain",
            "बिजली": "electricity",
            "शिकायत": "complaint",
            "समस्या": "problem",
            "मदद": "help",
            "गड्ढा": "pothole",
            "बारिश": "rain",
            "रोशनी": "light",
            "रिसाव": "leakage"
        }

        result = normalized_text

        for hindi, english in hindi_to_english_words.items():
            result = result.replace(hindi, english)

        return result

    # ============================================================
    # ENGLISH → HINDI
    # ============================================================

    if target_language == "hindi":

        normalized_text = re.sub(r"[.!?,]", "", text)
        normalized_text = re.sub(r"\s+", " ", normalized_text).strip().lower()

        # Exact phrase match
        if normalized_text in english_to_hindi_phrases:
            return english_to_hindi_phrases[normalized_text]

        english_to_hindi_words = {
            "road": "सड़क",
            "garbage": "कचरा",
            "water": "पानी",
            "drain": "नाला",
            "electricity": "बिजली",
            "complaint": "शिकायत",
            "problem": "समस्या",
            "help": "मदद",
            "pothole": "गड्ढा",
            "rain": "बारिश",
            "streetlight": "स्ट्रीट लाइट",
            "leakage": "रिसाव"
        }

        result = text

        for english, hindi in english_to_hindi_words.items():
            result = re.sub(
                rf"\b{re.escape(english)}\b",
                hindi,
                result,
                flags=re.IGNORECASE
            )

        return result

    return text
# ============================================================
# PREDICTIVE INTELLIGENCE
# ============================================================

def predict_complaint_volume(complaints):

    if not complaints:
        return {
            "current_volume": 0,
            "predicted_volume": 0,
            "trend": "STABLE"
        }

    current_volume = len(complaints)

    # Lightweight forecasting model.
    predicted_volume = round(
        current_volume * 1.10
    )

    if predicted_volume > current_volume:
        trend = "INCREASING"
    elif predicted_volume < current_volume:
        trend = "DECREASING"
    else:
        trend = "STABLE"

    return {
        "current_volume": current_volume,
        "predicted_volume_next_period": predicted_volume,
        "trend": trend,
        "model": "baseline_forecasting"
    }


def predict_hotspots(complaints):

    location_counter = Counter()

    for complaint in complaints:

        location = (
            complaint.get("location")
            or complaint.get("area")
            or complaint.get("ward")
            or "Unknown"
        )

        location_counter[location] += 1

    hotspots = []

    for location, count in location_counter.most_common():

        hotspots.append({
            "location": location,
            "complaint_count": count,
            "risk_level":
                "HIGH" if count >= 5
                else "MEDIUM" if count >= 3
                else "LOW"
        })

    return hotspots


def predict_sla(complaint: str, priority: str):

    priority = priority.upper()

    text = clean_text(complaint)

    if priority == "HIGH":
        sla_hours = 4
    elif priority == "MEDIUM":
        sla_hours = 24
    else:
        sla_hours = 72

    if any(word in text for word in [
        "flood",
        "fire",
        "accident",
        "danger",
        "electric wire"
    ]):
        breach_risk = "HIGH"

    else:
        breach_risk = "LOW"

    return {
        "recommended_sla_hours": sla_hours,
        "sla_breach_risk": breach_risk
    }


def predict_eta(complaint: str, priority: str):

    category, _ = classify_category(complaint)

    base_times = {
        "Pothole": 48,
        "Garbage": 12,
        "Waterlogging": 8,
        "Streetlight": 24,
        "Water Leakage": 18,
        "Drain Overflow": 12,
        "Damaged Road": 72,
        "Electricity": 8,
        "General Complaint": 48
    }

    eta = base_times.get(category, 48)

    if priority.upper() == "HIGH":
        eta *= 0.5

    return {
        "category": category,
        "estimated_resolution_hours": round(eta, 1)
    }
def predict_complaint_volume(
    complaints: List[dict]
):

    total_complaints = len(complaints)

    if total_complaints == 0:
        return {
            "current_volume": 0,
            "predicted_volume": 0,
            "trend": "STABLE"
        }

    # Simple baseline prediction
    # Uses current complaint count to estimate
    # the next period's volume.

    predicted_volume = round(
        total_complaints * 1.10
    )

    if predicted_volume > total_complaints:
        trend = "INCREASING"

    elif predicted_volume < total_complaints:
        trend = "DECREASING"

    else:
        trend = "STABLE"

    return {
        "current_volume": total_complaints,
        "predicted_volume": predicted_volume,
        "trend": trend
    }

def predict_recurrence(complaints):

    if len(complaints) < 2:
        return {
            "recurring": False,
            "confidence": 0.30
        }

    categories = []

    for complaint in complaints:

        category, _ = classify_category(
            complaint.get("complaint", "")
        )

        categories.append(category)

    counts = Counter(categories)

    category, count = counts.most_common(1)[0]

    recurring = count >= 3

    return {
        "recurring": recurring,
        "recurring_category": category,
        "occurrences": count,
        "confidence": round(
            min(0.95, count / len(complaints)),
            2
        )
    }


# ============================================================
# AI COPILOT
# ============================================================

def officer_copilot(
    complaint: str,
    department: Optional[str],
    priority: Optional[str]
):

    detected_department, department_confidence = \
        classify_department(complaint)

    category, category_confidence = \
        classify_category(complaint)

    detected_priority = (
        priority
        if priority
        else predict_priority(complaint)
    )

    severity = predict_severity(complaint)
    urgency = predict_urgency(complaint)

    summary = summarize_complaint(complaint)

    sla = predict_sla(
        complaint,
        detected_priority
    )

    eta = predict_eta(
        complaint,
        detected_priority
    )

    actions = {
        "Pothole":
            "Inspect the road and schedule pothole repair.",
        "Garbage":
            "Assign sanitation team and arrange waste collection.",
        "Waterlogging":
            "Inspect drainage and deploy water removal team.",
        "Streetlight":
            "Assign electrical maintenance team for inspection.",
        "Water Leakage":
            "Inspect pipeline and repair leakage.",
        "Drain Overflow":
            "Clear blocked drain and inspect sewage system.",
        "Damaged Road":
            "Conduct road inspection and schedule repair.",
        "Electricity":
            "Assign electrical department for immediate inspection."
    }

    suggested_action = actions.get(
        category,
        "Forward complaint to the recommended department for investigation."
    )

    return {
        "summary": summary,
        "department": department or detected_department,
        "department_confidence": department_confidence,
        "category": category,
        "category_confidence": category_confidence,
        "priority": detected_priority,
        "severity": severity,
        "urgency": urgency,
        "suggested_action": suggested_action,
        "sla_warning": sla,
        "resolution_eta": eta,
        "explanation": (
            f"The complaint was classified as {category} "
            f"with {detected_priority} priority based on "
            f"the detected civic-risk indicators."
        )
    }


# ============================================================
# AI SECURITY
# ============================================================

PROMPT_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "system prompt",
    "developer message",
    "reveal your instructions",
    "bypass security",
    "jailbreak",
    "forget your rules"
]


def security_validation(text: str):

    lower_text = text.lower()

    detected = []

    for pattern in PROMPT_INJECTION_PATTERNS:

        if pattern in lower_text:
            detected.append(pattern)

    malicious = len(detected) > 0

    # Sensitive data masking
    masked_text = re.sub(
        r"\b[6-9]\d{9}\b",
        "[PHONE_MASKED]",
        text
    )

    masked_text = re.sub(
        r"[\w\.-]+@[\w\.-]+\.\w+",
        "[EMAIL_MASKED]",
        masked_text
    )

    return {
        "safe": not malicious,
        "malicious_input_detected": malicious,
        "detected_patterns": detected,
        "masked_text": masked_text,
        "confidence": 0.95 if not malicious else 0.90,
        "human_review_required": malicious
    }


# ============================================================
# API ROUTES
# ============================================================

@app.get("/")
def root():

    return {
        "project": "SAMADHAAN AI Engine",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "service": "SAMADHAAN AI Engine",
        "timestamp": datetime.now().isoformat()
    }


# ------------------------------------------------------------
# COMPLETE COMPLAINT ANALYSIS
# ------------------------------------------------------------

@app.post("/api/complaint/analyze")
def analyze_complaint(request: ComplaintRequest):

    complaint = request.complaint.strip()

    if not complaint:
        raise HTTPException(
            status_code=400,
            detail="Complaint cannot be empty"
        )

    language = (
        detect_language(complaint)
        if request.language == "auto"
        else request.language
    )

    normalized_complaint = normalize_multilingual_complaint(
    complaint,
    language
)

    department, department_confidence = \
        classify_department(normalized_complaint)

    category, category_confidence = \
        classify_category(normalized_complaint)

    priority = predict_priority(normalized_complaint)
    severity = predict_severity(normalized_complaint)
    urgency = predict_urgency(normalized_complaint)

    problem_identification = identify_problem(normalized_complaint)

    return {
        "success": True,
        "complaint": complaint,
        "language": language,
        "department": department,
        "department_confidence": department_confidence,
        "category": category,
        "category_confidence": category_confidence,
        "priority": priority,
        "severity": severity,
        "urgency": urgency,
        "problem_identification": problem_identification,
        "ai_response": generate_multilingual_response(
    problem_identification["problem"],
    department,
    language
),
        "sentiment": sentiment_analysis(complaint),
        "keywords": extract_keywords(complaint),
        "entities": extract_entities(complaint),
        "summary": summarize_complaint(complaint),
        "sla": predict_sla(complaint, priority),
        "eta": predict_eta(complaint, priority),
        "security": security_validation(complaint)
    }
@app.post("/api/complaint/predict-volume")
def predict_volume_endpoint(
    request: PredictionRequest
):

    result = predict_complaint_volume(
        request.complaints
    )

    return {
        "success": True,
        "prediction": result
    }

@app.post("/api/complaint/speech-to-text")
async def speech_to_text_endpoint(
    audio: UploadFile = File(...),
    language: str = "auto"
):

    try:
        result = speech_to_text(
            audio.file,
            language
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/api/complaint/voice-process")
async def voice_process_endpoint(
    audio: UploadFile = File(...),
    language: str = Form("auto")
):

    try:
        # Step 1: Convert voice to text
        speech_result = speech_to_text(
            audio.file,
            language
        )

        # Stop if speech recognition failed
        if not speech_result.get("success"):
            return {
                "success": False,
                "stage": "speech_to_text",
                "error": speech_result.get(
                    "error",
                    "Speech recognition failed"
                )
            }

        recognized_text = speech_result.get(
            "text",
            ""
        )

        # Step 2: Run normal complaint analysis
        complaint_request = ComplaintRequest(
            complaint=recognized_text,
            language="auto"
        )

        analysis_result = analyze_complaint(
            complaint_request
        )

        # Step 3: Return complete voice complaint result
        return {
            "success": True,
            "voice": {
                "text": recognized_text,
                "language": speech_result.get(
                    "language",
                    "Unknown"
                ),
                "confidence": speech_result.get(
                    "confidence",
                    0.0
                )
            },
            "analysis": analysis_result
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.post("/api/complaint/voice")
async def analyze_voice_complaint(file: UploadFile = File(...)):

    temp_file = "temp_voice.wav"

    try:
        audio_data = await file.read()

        with open(temp_file, "wb") as f:
            f.write(audio_data)

        # Speech-to-text
        speech_result = speech_to_text(temp_file,"auto")

        if not speech_result["success"]:
            return speech_result

        complaint = speech_result["text"]
        language = speech_result["language"]

        # Run the same AI analysis as normal complaints
        normalized_complaint = normalize_multilingual_complaint(
            complaint,
            language
        )

        department, department_confidence = classify_department(
            normalized_complaint
        )

        category, category_confidence = classify_category(
            normalized_complaint
        )

        priority = predict_priority(normalized_complaint)
        severity = predict_severity(normalized_complaint)
        urgency = predict_urgency(normalized_complaint)

        problem_identification = identify_problem(
            normalized_complaint
        )

        return {
            "success": True,
            "input_type": "voice",
            "transcribed_text": complaint,
            "language": language,
            "department": department,
            "department_confidence": department_confidence,
            "category": category,
            "category_confidence": category_confidence,
            "priority": priority,
            "severity": severity,
            "urgency": urgency,
            "problem_identification": problem_identification,
            "summary": summarize_complaint(complaint),
            "ai_response": f"Your complaint has been identified as {category}. It should be handled by the {department} department."
        }

    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

# ============================================================
# VOICE — SPEECH TO TEXT API
# ============================================================

@app.post("/api/voice/transcribe")
async def transcribe_voice(file: UploadFile = File(...)):

    try:
        audio_data = await file.read()

        temp_file = "temp_voice.wav"

        with open(temp_file, "wb") as f:
            f.write(audio_data)

        result = speech_to_text(temp_file)

        os.remove(temp_file)

        return {
            "success": result["success"],
            "filename": file.filename,
            "text": result["text"],
            "confidence": result["confidence"]
        }

    except Exception as e:

        if os.path.exists("temp_voice.wav"):
            os.remove("temp_voice.wav")

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# ------------------------------------------------------------
# CLASSIFICATION
# ------------------------------------------------------------

@app.post("/api/complaint/classify")
def classify_complaint(request: ComplaintRequest):

    department, department_confidence = \
        classify_department(request.complaint)

    category, category_confidence = \
        classify_category(request.complaint)

    return {
        "department": department,
        "department_confidence": department_confidence,
        "category": category,
        "category_confidence": category_confidence,
        "priority": predict_priority(request.complaint),
        "severity": predict_severity(request.complaint),
        "urgency": predict_urgency(request.complaint)
    }


# ------------------------------------------------------------
# SUMMARY
# ------------------------------------------------------------

@app.post("/api/complaint/summarize")
def summarize(request: ComplaintRequest):

    return {
        "summary": summarize_complaint(
            request.complaint
        )
    }


# ------------------------------------------------------------
# SIMILARITY
# ------------------------------------------------------------

@app.post("/api/complaint/similarity")
def similarity(request: SimilarityRequest):

    return {
        "results": find_similar_complaints(
            request.complaint,
            request.previous_complaints
        )
    }


@app.post("/api/complaint/cluster")
def complaint_cluster(request: ComplaintClusterRequest):

    return {
        "clusters": cluster_complaints(
            request.complaints
        )
    }

# ------------------------------------------------------------
# LOCATION-BASED SIMILARITY
# ------------------------------------------------------------

@app.post("/api/complaint/location-similarity")
def location_similarity(
    request: LocationSimilarityRequest
):

    results = location_based_similarity(
        request.complaint,
        request.latitude,
        request.longitude,
        request.previous_complaints
    )

    return {
        "results": results
    }


# ------------------------------------------------------------
# TIME-BASED SIMILARITY
# ------------------------------------------------------------

@app.post("/api/complaint/time-similarity")
def time_similarity(
    request: TimeSimilarityRequest
):

    results = time_based_similarity(
        request.complaint,
        request.complaint_time,
        request.latitude,
        request.longitude,
        request.previous_complaints
    )

    return {
        "results": results
    }
# ------------------------------------------------------------
# LANGUAGE DETECTION
# ------------------------------------------------------------

@app.post("/api/language/detect")
def language_detect(request: ComplaintRequest):

    return {
        "language": detect_language(
            request.complaint
        )
    }


# ------------------------------------------------------------
# TRANSLATION
# ------------------------------------------------------------

@app.post("/api/translate")
def translate(request: TranslationRequest):

    return {
        "original_text": request.text,
        "target_language": request.target_language,
        "translated_text": simple_translation(
            request.text,
            request.target_language
        )
    }


# ------------------------------------------------------------
# PREDICTIVE INTELLIGENCE
# ------------------------------------------------------------

@app.post("/api/predict/volume")
def volume_prediction(request: PredictionRequest):

    return predict_complaint_volume(
        request.complaints
    )


@app.post("/api/predict/hotspot")
def hotspot_prediction(request: PredictionRequest):

    return {
        "hotspots": predict_hotspots(
            request.complaints
        )
    }


@app.post("/api/predict/sla")
def sla_prediction(request: ComplaintRequest):

    priority = predict_priority(
        request.complaint
    )

    return predict_sla(
        request.complaint,
        priority
    )


@app.post("/api/predict/eta")
def eta_prediction(request: ComplaintRequest):

    priority = predict_priority(
        request.complaint
    )

    return predict_eta(
        request.complaint,
        priority
    )


@app.post("/api/predict/recurrence")
def recurrence_prediction(
    request: PredictionRequest
):

    return predict_recurrence(
        request.complaints
    )


# ------------------------------------------------------------
# OFFICER COPILOT
# ------------------------------------------------------------

@app.post("/api/copilot/officer")
def officer_ai(
    request: OfficerCopilotRequest
):

    return officer_copilot(
        request.complaint,
        request.department,
        request.priority
    )


# ------------------------------------------------------------
# CITIZEN AI ASSISTANT
# ------------------------------------------------------------

@app.post("/api/copilot/citizen")
def citizen_ai(
    request: CitizenAssistantRequest
):

    question = request.question.lower()

    if "status" in question:
        response = (
            "You can check your complaint status using "
            "the complaint ID provided after submission."
        )

    elif "department" in question:
        response = (
            "SAMADHAAN AI can analyze your complaint "
            "and recommend the appropriate department."
        )

    elif "complaint" in question:
        response = (
            "Please describe the civic problem clearly, "
            "including the location and relevant details."
        )

    else:
        response = (
            "I can help you write a complaint, "
            "understand complaint status, and identify "
            "the appropriate government department."
        )

    return {
        "language": request.language,
        "response": response
    }


# ------------------------------------------------------------
# SECURITY
# ------------------------------------------------------------

@app.post("/api/security/validate")
def security(request: SecurityRequest):

    return security_validation(
        request.text
    )


# ------------------------------------------------------------
# IMAGE / COMPUTER VISION
# ------------------------------------------------------------

@app.post("/api/vision/detect")
async def vision_detect(
    file: UploadFile = File(...)
):

    filename = file.filename.lower()

    allowed_extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]

    if not any(
        filename.endswith(ext)
        for ext in allowed_extensions
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image files are supported"
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    contents = await file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    # Initial vision API.
    # Real trained detection model can be plugged here.
    detected_category = "Infrastructure Damage"

    lower_name = filename

    if "pothole" in lower_name:
        detected_category = "Pothole"

    elif "garbage" in lower_name:
        detected_category = "Garbage"

    elif "water" in lower_name:
        detected_category = "Waterlogging"

    elif "street" in lower_name:
        detected_category = "Broken Streetlight"

    elif "drain" in lower_name:
        detected_category = "Overflowing Drain"

    return {
        "success": True,
        "filename": file.filename,
        "detected_issue": detected_category,
        "confidence": 0.70,
        "model": "vision_pipeline_placeholder",
        "message": (
            "Image successfully received. "
            "Connect a trained YOLO/vision model "
            "for production detection."
        )
    }


# ============================================================
# ERROR HANDLER
# ============================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    return {
        "success": False,
        "error": str(exc)
    }


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )