import joblib
from sentence_transformers import SentenceTransformer
import os

def diagnose():
    data = joblib.load('ai/spam_model.joblib')
    clf = data['classifier']
    transformer_name = data['transformer_name']
    model = SentenceTransformer(transformer_name, device='cpu')

    tests = [
        ("Subject: enron methanol ; meter # : 988291. this is a follow up to the note i gave you on monday.", "PRO ENRON (HAM TYPIQUE)"),
        ("Hello how are you my friend ?", "AMICAL COURT (VOTRE ERREUR)"),
        ("Please find the attached report for the weekly meeting.", "PRO MODERNE (HAM)"),
        ("WIN A FREE IPHONE NOW CLICK HERE TO CLAIM YOUR PRIZE !!!", "SPAM ÉVIDENT"),
        ("Salut comment ça va mon ami ?", "AMICAL FRANÇAIS")
    ]

    print(f"{'MESSAGE':<60} | {'TYPE':<25} | {'PROBA SPAM':<10} | {'PREDICT'}")
    print("-" * 110)

    for msg, label in tests:
        embedding = model.encode([msg], show_progress_bar=False)
        proba = clf.predict_proba(embedding)[0][1] # Probabilité de la classe 1 (Spam)
        pred = "SPAM" if proba > 0.5 else "HAM"
        print(f"{msg[:58]:<60} | {label:<25} | {proba:.4f}     | {pred}")

if __name__ == "__main__":
    diagnose()
