import joblib

# Load and inspect the model
model_data = joblib.load('backend/app/credit_scoring_model.pkl')
print("Keys in model file:", model_data.keys())
print("Model type:", type(model_data.get('model', model_data)))