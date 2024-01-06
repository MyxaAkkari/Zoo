from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from icecream import ic

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///zoo.db'
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure value
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

class Animal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    species = db.Column(db.String(80), nullable=False)
    average_age = db.Column(db.Float, nullable=False)

@app.route('/api/check-auth')
def check_auth():
    if 'user_id' in session:
        ic("success")
        return jsonify({'authenticated': True}), 200
    else:
        ic("not logged")
        return jsonify({'authenticated': False}), 401

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Invalid input'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password_hash=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create user'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password_hash, password):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout')
def logout():
    if 'user_id' in session:
        session.pop('user_id', None)
        return jsonify({'message': 'Logout successful'}), 200
    else:
        return jsonify({'message': 'User not logged in'}), 401

# CRUD endpoints for Animals
@app.route('/api/animals', methods=['GET'])
def get_animals():
    animals = Animal.query.all()
    animals_data = [{'id': animal.id, 'name': animal.name, 'species': animal.species, 'average_age': animal.average_age} for animal in animals]
    return jsonify({'animals': animals_data})

@app.route('/api/animals/<int:animal_id>', methods=['GET'])
def get_animal(animal_id):
    animal = Animal.query.get(animal_id)
    if animal:
        animal_data = {'id': animal.id, 'name': animal.name, 'species': animal.species, 'average_age': animal.average_age}
        return jsonify({'animal': animal_data})
    return jsonify({'error': 'Animal not found'}), 404

@app.route('/api/animals', methods=['POST'])
def create_animal():
    data = request.get_json()
    name = data.get('name')
    species = data.get('species')
    average_age = data.get('average_age')

    if not name or not species or not average_age:
        return jsonify({'error': 'Invalid input'}), 400

    new_animal = Animal(name=name, species=species, average_age=average_age)

    try:
        db.session.add(new_animal)
        db.session.commit()
        return jsonify({'message': 'Animal created successfully'}), 201
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to create animal'}), 500

@app.route('/api/animals/<int:animal_id>', methods=['PUT'])
def update_animal(animal_id):
    data = request.get_json()
    name = data.get('name')
    species = data.get('species')
    average_age = data.get('average_age')

    animal = Animal.query.get(animal_id)
    if not animal:
        return jsonify({'error': 'Animal not found'}), 404

    animal.name = name if name else animal.name
    animal.species = species if species else animal.species
    animal.average_age = average_age if average_age else animal.average_age

    try:
        db.session.commit()
        return jsonify({'message': 'Animal updated successfully'}), 200
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to update animal'}), 500

@app.route('/api/animals/<int:animal_id>', methods=['DELETE'])
def delete_animal(animal_id):
    animal = Animal.query.get(animal_id)
    if not animal:
        return jsonify({'error': 'Animal not found'}), 404

    try:
        db.session.delete(animal)
        db.session.commit()
        return jsonify({'message': 'Animal deleted successfully'}), 200
    except Exception as e:
        print(str(e))
        db.session.rollback()
        return jsonify({'error': 'Failed to delete animal'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=8000)
