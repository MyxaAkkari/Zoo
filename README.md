# Zoo Management System

This is a simple Zoo Management System implemented using Flask, SQLAlchemy, Flask-Bcrypt, Flask-Cors, and other related technologies. The system allows users to sign up, log in, and perform CRUD (Create, Read, Update, Delete) operations on zoo animals.

## Features

- **User Authentication:** Users can sign up, log in, and log out. Passwords are securely hashed using bcrypt for enhanced security.

- **Animal Management:** The system provides endpoints for managing zoo animals, including adding, updating, deleting, and retrieving animal information.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/MyxaAkkari/Zoo.git
    ```

2. Navigate to the project directory:
    ```bash
    cd Zoo
    ```

3. Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    ```

4. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```

5. Install the required dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Set up the database:
    ```bash
    flask db upgrade
    ```

## Usage

1. Run the Flask application:
    ```bash
    python app.py
    ```

2. Access the application in your web browser at [http://127.0.0.1:8000](http://127.0.0.1:8000).

3. Create an account, log in, and start managing zoo animals.

## API Endpoints

### Authentication

- `POST /api/signup`: Create a new user account.
  - Required JSON payload: `{ "email": "user@example.com", "password": "securepassword" }`

- `POST /api/login`: Log in with an existing user account.
  - Required JSON payload: `{ "email": "user@example.com", "password": "securepassword" }`

- `GET /api/logout`: Log out the currently authenticated user.

- `GET /api/check-auth`: Check if the user is authenticated.

### Animal Management

- `GET /api/animals`: Retrieve a list of all animals.

- `GET /api/animals/{animal_id}`: Retrieve information about a specific animal.

- `POST /api/animals`: Create a new animal.
  - Required JSON payload: `{ "name": "Lion", "species": "Panthera leo", "average_age": 8.5 }`

- `PUT /api/animals/{animal_id}`: Update information about a specific animal.
  - Required JSON payload: `{ "name": "New Lion Name", "species": "Updated Species", "average_age": 9.0 }`

- `DELETE /api/animals/{animal_id}`: Delete a specific animal.

## Contributing

If you'd like to contribute to the project, please follow the standard GitHub flow: fork the repository, create a new branch for your changes, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the developers of Flask, SQLAlchemy, and other open-source libraries used in this project.

