import random
import string
import re
import math
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

    return min(score, 5), has_digit, has_uppercase, has_lowercase, has_special, entropy, length

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
    strength_score, _, _, _, _, _, _ = check_password_strength(password)

    return jsonify({'password': password, 'strength_score': strength_score})

common_patterns = [
    (r"^123456", "Uses a very common sequence (123456)"),
    (r"^123456789", "Uses a very common sequence (123456789)"),
    (r"^password", "Uses the word 'password'"),
    (r"^qwerty", "Uses keyboard pattern (qwerty)"),
    (r"^admin", "Uses common default word (admin)"),
    (r"^secret", "Uses common phrase (secret)"),
    (r"^password1", "Uses the word 'password1'"),
    (r"^abc123", "Uses common alpha-numeric pattern (abc123)"),
    (r"^iloveyou", "Uses common phrase (iloveyou)"),
    (r"^monkey", "Uses common password word (monkey)"),
]

common_passwords = [
    "123456", "password", "123456789", "12345678", "12345", "qwerty", "1234567", "111111", "1234567890", "123123", "admin", "000000", "welcome", "monkey", "1234", "abc123", "iloveyou"
]

@app.route('/check-password', methods=['POST'])
def check_password():
    if request.content_type != 'application/json':
        return jsonify({'error': 'Unsupported Media Type. Use application/json'}), 415

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({'error': 'Invalid JSON format'}), 400

    password = data.get('password', '')
    
    if not password:
        return jsonify({'error': 'Password is required'}), 400

    score, has_digits, has_uppercase, has_lowercase, has_special, entropy, length = check_password_strength(password)

    has_repetition = bool(re.search(r'(.)\1{2,}', password))
    if has_repetition:
        score = max(score - 1, 0)

    found_pattern = None
    for pattern, message in common_patterns:
        if re.search(pattern, password, re.IGNORECASE):
            found_pattern = message
            score = max(score - 2, 0)
            break
    
    warnings = []
    suggestions = []
    
    if length < 8:
        warnings.append("Your password is too short")
        suggestions.append("Use at least 8 characters")
    
    if not has_uppercase:
        suggestions.append("Add uppercase letters")
    if not has_lowercase:
        suggestions.append("Add lowercase letters")
    if not has_digits:
        suggestions.append("Add numbers")
    if not has_special:
        suggestions.append("Add special characters")
    
    if has_repetition:
        warnings.append("Your password contains repeating characters")
        suggestions.append("Avoid sequences of repeating characters")
    
    if found_pattern:
        warnings.append(found_pattern)
        suggestions.append("Avoid common words and patterns")

    possible_chars = 0
    if has_lowercase:
        possible_chars += 26
    if has_uppercase:
        possible_chars += 26
    if has_digits:
        possible_chars += 10
    if has_special:
        possible_chars += len(string.punctuation)
    
    combinations = possible_chars ** length if possible_chars > 0 else 1
    guesses_per_second = 1000000000  
    seconds_to_crack = combinations / guesses_per_second

    if seconds_to_crack < 60:
        time_to_crack = "instantly"
    elif seconds_to_crack < 3600:
        time_to_crack = f"{math.ceil(seconds_to_crack / 60)} minutes"
    elif seconds_to_crack < 86400:
        time_to_crack = f"{math.ceil(seconds_to_crack / 3600)} hours"
    elif seconds_to_crack < 31536000:
        time_to_crack = f"{math.ceil(seconds_to_crack / 86400)} days"
    elif seconds_to_crack < 3153600000:
        time_to_crack = f"{math.ceil(seconds_to_crack / 31536000)} years"
    else:
        time_to_crack = "millions of years"

    has_been_breached = (
        password.lower() in [p.lower() for p in common_passwords] or
        length < 6 or
        any(re.search(pattern, password, re.IGNORECASE) for pattern, _ in common_patterns)
    )

    return jsonify({
        'score': round(score),
        'feedback': {
            'warning': warnings[0] if warnings else "",
            'suggestions': suggestions
        },
        'time_to_crack': time_to_crack,
        'has_been_breached': has_been_breached
    })

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)