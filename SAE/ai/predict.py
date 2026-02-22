import sys
import joblib
from sentence_transformers import SentenceTransformer
import os
import logging
import warnings

# Désactiver les logs pour n'avoir que le résultat 0 ou 1
os.environ['TRANSFORMERS_VERBOSITY'] = 'error'
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
os.environ['HF_HUB_DISABLE_SYMLINKS_WARNING'] = '1'
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)
warnings.filterwarnings("ignore")

def predict():
    # 1. Ce script doit pouvoir être appelé en ligne de commande : python predict.py "votre message"
    # 2. Récupérer l'argument texte via sys.argv[1].
    if len(sys.argv) < 2:
        return

    message = sys.argv[1]

    # Déterminer le chemin du modèle (relativement au script)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'spam_model.joblib')

    # 3. Charger le modèle 'spam_model.joblib' via joblib.load().
    if not os.path.exists(model_path):
        return

    data = joblib.load(model_path)
    clf = data['classifier']
    transformer_name = data['transformer_name']

    # 4. Charger le modèle SentenceTransformer multilingue.
    import contextlib
    with contextlib.redirect_stderr(open(os.devnull, 'w')):
        model = SentenceTransformer(transformer_name, device='cpu')

    # 5. Transformer le texte d'entrée en vecteur (embedding).
    embedding = model.encode([message], show_progress_bar=False)

    # 6. Faire la prédiction avec le modèle chargé.
    if hasattr(clf, "predict_proba"):
        probabilities = clf.predict_proba(embedding)[0]
        # On récupère le score de spam (probabilité de la classe 1)
        spam_score = probabilities[1]
        
        # RÈGLE D'INDULGENCE :
        # Si le message est très court (ex: moins de 60 caractères), 
        # on augmente drastiquement le seuil pour ne pas bloquer les "Hello", "Salut", etc.
        threshold = 0.85 if len(message) < 60 else 0.7
        
        prediction = 1 if spam_score > threshold else 0
    else:
        prediction = clf.predict(embedding)[0]

    # 7. Afficher "1" si c'est un spam, "0" sinon (ce résultat sera lu par Symfony).
    print(prediction)

if __name__ == "__main__":
    predict()