# CONSIGNES D'IMPLÉMENTATION :

# 1. Importer : pandas, joblib, SentenceTransformer de sentence_transformers, et SVC de sklearn.svm
from sentence_transformers import SentenceTransformer
import pandas as pd
import joblib
from sklearn.svm import SVC

# 2. Charger votre dataset (ex: Enron Spam) avec pandas.
dataset = pd.read_csv("./spam_ham_dataset.csv")

# 3. Initialiser le modèle multilingue : SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
model=SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

# 4. Transformer la colonne texte du dataset en vecteurs (embeddings) via model.encode()
X_embeddings = model.encode(dataset['text'].tolist(), show_progress_bar=True)

# 5. Entraîner le classifieur (SVC ou LogisticRegression) en utilisant les vecteurs comme X et le label (spam/ham) comme y.
clf = SVC(kernel='linear', C=1.0, probability=True)
clf.fit(X_embeddings, dataset['label_num'])

# 6. Sauvegarder le modèle entraîné ET le nom du modèle transformer utilisé via joblib.dump() dans 'spam_model.joblib'.
data_to_save = {
    'classifier': clf,
    'transformer_name': 'paraphrase-multilingual-MiniLM-L12-v2'
}
joblib.dump(data_to_save, 'spam_model.joblib')
print("Modèle sauvegardé dans 'spam_model.joblib'")