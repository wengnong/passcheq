import random
import string
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def create_password(length, include_digits, include_uppercase, include_lowercase, include_special_chars):
    password = ""
    if include_digits:
        password += string.digits
    if include_uppercase:
        password += string.ascii_uppercase
    if include_lowercase:
        password += string.ascii_lowercase
    if include_special_chars:
        password += string.punctuation

    if not password:  
        return ""

    return ''.join(random.choices(password, k=length))

def check_password_strength(password):
    length = len(password)
    has_digit = re.search(r"\d", password) is not None
    has_uppercase = re.search(r"[A-Z]", password) is not None
    has_lowercase = re.search(r"[a-z]", password) is not None
    has_special = re.search(r"\W", password) is not None

    entropy = 0
    char_set_size = 0
    if has_digit:
        char_set_size += 10
    if has_uppercase:
        char_set_size += 26
    if has_lowercase:
        char_set_size += 26
    if has_special:
        char_set_size += len(string.punctuation)
    entropy = length * (char_set_size ** 0.5)

    score = 0
    if length >= 12:
        score += 2
    elif length >= 8:
        score += 1
    if has_digit:
        score += 1
    if has_uppercase:
        score += 1
    if has_lowercase:
        score += 1
    if has_special:
        score += 1
    if entropy > 50:
        score += 1

    return min(score, 5)

@app.route('/generate-password', methods=['POST'])
def generate_password():
    if request.content_type != 'application/json':
        return jsonify({'error': 'Unsupported Media Type. Use application/json'}), 415

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'error': 'Invalid JSON format'}), 400

    length = data.get('length', 12)
    include_digits = data.get('include_digits', False)
    include_uppercase = data.get('include_uppercase', False)
    include_lowercase = data.get('include_lowercase', True)
    include_special_chars = data.get('include_special_chars', False)

    if length < 4:
        return jsonify({'error': 'Invalid input parameters'}), 400

    if not (include_digits or include_uppercase or include_lowercase or include_special_chars):
        return jsonify({'error': 'At least one character type must be selected.'}), 400

    password = create_password(length, include_digits, include_uppercase, include_lowercase, include_special_chars)
    strength_score = check_password_strength(password)

    return jsonify({'password': password, 'strength_score': strength_score})

if __name__ == '__main__':
    app.run(debug=True)
