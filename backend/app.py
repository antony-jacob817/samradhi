import os
import logging
from flask import Flask, request, jsonify
from pymongo import MongoClient
import bcrypt
from flask_cors import CORS
import re
from bson import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection
MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["mydatabase"]  # Replace with your actual database name
users_collection = db["users"]
products_collection = db["products"]  # New collection for storing products

# ======================= USER AUTHENTICATION ========================== #

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    logger.info("Received registration data: %s", data)

    # Validate data
    errors = {}
    if not data.get('name'):
        errors['name'] = 'Name is required'
    if not data.get('email'):
        errors['email'] = 'Email is required'
    elif not re.match(r'\S+@\S+\.\S+', data['email']):
        errors['email'] = 'Please enter a valid email'
    if data.get('phone') and not re.match(r'^\d{10}$', data['phone']):
        errors['phone'] = 'Please enter a valid 10-digit phone number'
    if not data.get('password'):
        errors['password'] = 'Password is required'
    elif len(data['password']) < 8:
        errors['password'] = 'Password must be at least 8 characters'

    if errors:
        logger.error("Validation errors: %s", errors)
        return jsonify({'errors': errors}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    # Store data in MongoDB
    user = {
        'name': data['name'],
        'email': data['email'],
        'phone': data.get('phone'),
        'address': data.get('address'),
        'pincode': data.get('pincode'),
        'password': hashed_password,
        'role': data['role']
    }
    users_collection.insert_one(user)
    logger.info("User registered successfully: %s", user)

    return jsonify({'message': 'User registered successfully', 'id': str(user['_id'])}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    logger.info("Received login data: %s", data)

    # Validate data
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    # Find user in MongoDB
    user = users_collection.find_one({'email': data['email']})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Check password
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Return user data
    user_data = {
        'id': str(user['_id']),
        'email': user['email'],
        'name': user['name'],
        'phone': user['phone'],
        'address': user['address'],
        'pincode': user['pincode'],
        'role': user['role']
    }
    logger.info("User logged in successfully: %s", user_data)
    return jsonify(user_data), 200

# ========================== PRODUCT MANAGEMENT ========================== #

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    logger.info("Received product data: %s", data)

    # Validate input
    if not data.get('name') or not data.get('price') or not data.get('category'):
        return jsonify({'error': 'Product name, price, and category are required'}), 400

    product = {
        "name": data['name'],
        "description": data.get('description', ''),
        "price": float(data['price']),
        "stock": int(data.get('stock', 0)),
        "category": data['category'],
        "krishiBhavan": data.get('krishiBhavan', ''),
        "imageUrl": data.get('imageUrl', '')
    }
    result = products_collection.insert_one(product)
    logger.info("Product added: %s", product)

    return jsonify({'message': 'Product added successfully', 'id': str(result.inserted_id)}), 201


@app.route('/products', methods=['GET'])
def get_products():
    products = list(products_collection.find())
    products_list = [
        {
            'id': str(product['_id']),
            'name': product['name'],
            'description': product.get('description', ''),
            'price': product['price'],
            'stock': product.get('stock', 0),
            'category': product['category'],
            'krishiBhavan': product.get('krishiBhavan', ''),
            'imageUrl': product.get('imageUrl', '')
        }
        for product in products
    ]
    return jsonify(products_list), 200


@app.route('/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    logger.info(f"Updating product {product_id} with data: {data}")

    if not ObjectId.is_valid(product_id):
        return jsonify({'error': 'Invalid product ID'}), 400

    update_data = {key: value for key, value in data.items() if value is not None}

    result = products_collection.update_one({'_id': ObjectId(product_id)}, {'$set': update_data})
    if result.matched_count == 0:
        return jsonify({'error': 'Product not found'}), 404

    return jsonify({'message': 'Product updated successfully'}), 200


@app.route('/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    logger.info(f"Deleting product with ID: {product_id}")

    if not ObjectId.is_valid(product_id):
        return jsonify({'error': 'Invalid product ID'}), 400

    result = products_collection.delete_one({'_id': ObjectId(product_id)})
    if result.deleted_count == 0:
        return jsonify({'error': 'Product not found'}), 404

    return jsonify({'message': 'Product deleted successfully'}), 200

# ===================================================================== #
# Configure Gemini API
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

# Cache for storing product details
cache = {}

# Product data (same as frontend)
products = [
    {"id": 1, "name": "Moovandan", "type": "Mango", "image": "https://www.fortheloveofnature.in/cdn/shop/products/Mangiferaindica-Moovandan_Mango_1_823x.jpg?v=1640246605", "description": "A Popular Early-Bearing Variety"},
    {"id": 2, "name": "Kilichundan Mango", "type": "Mango", "image": "https://www.greensofkerala.com/wp-content/uploads/2021/04/kilichundan-manga-2.gif", "description": "The Parrot-Beak Mango with a Tangy-Sweet Flavor"},
    {"id": 3, "name": "Neelum", "type": "Mango", "image": "https://tropicaltreeguide.com/wp-content/uploads/2023/04/Mango_Neelum_Fruit_IG_Botanical_Diversity_3-1024x1014.jpg", "description": "A High-Yielding and Disease-Resistant Variety of Mango"},
    {"id": 4, "name": "Alphonso", "type": "Mango", "image": "https://seed2plant.in/cdn/shop/files/AlphonsoMangoGraftedLivePlant.jpg?v=1689071379&width=1100", "description": "The King of Mangoes"},
    {"id": 5, "name": "Cowpea", "type": "Bean", "image": "https://seed2plant.in/cdn/shop/products/cowpeaseeds.jpg?v=1603962956&width=1780", "description": "Drought-tolerant legume"},
    {"id": 6, "name": "Yardlong Bean", "type": "Bean", "image": "https://m.media-amazon.com/images/I/61GCtRXQUNL.jpg", "description": "Locally known as Achinga Payar is a popular vegetable characterized by its slender, elongated pods"},
    {"id": 7, "name": "Winged Bean", "type": "Bean", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyx8m47r2uid8bsBjhInQs9nlpFmuBXKfT6w&s", "description": "Locally known as Kaippayar, this nutrient-rich bean is characterized by its winged edges and high protein content."},
    {"id": 8, "name": "Sword Bean", "type": "Bean", "image": "https://goldenhillsfarm.in/media/product_images/sward-beans.jpg", "description": "Known as Valpayar, this variety has thick, broad pods and is often used in traditional Kerala dishes."},
    {"id": 9, "name": "Nendran", "type": "Banana", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqNbKet5tI1Uh_bAZgjTNB0RPSInNnPKkN8A&s", "description": "A prominent variety in Kerala, Nendran bananas are large, firm, and slightly sweet"},
    {"id": 10, "name": "Chengalikodan Nendran",  "type": "Banana", "image": "https://www.gikerala.in/images/products/Chengalikkodan_Nendran-Banana-4.webp", "description": "Originating from the Chengazhikodu village in Thrissur District, this variety is renowned for its unique taste and vibrant color."},
    {"id": 11, "name": "Matti Pazham", "type": "Banana", "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9r6XZqXhdCNS3xpTSTkoVXHbo38K_Q1K__g&s", "description": "Known for its fragrant aroma and honey-like taste, this small-sized banana is cherished for its unique flavor profile."},
    {"id": 12, "name": "Poovan", "type": "Banana", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Kerala_Banana_-_Poovan_Pazham-1.jpg/1200px-Kerala_Banana_-_Poovan_Pazham-1.jpg?20110717070644", "description": "A popular dessert banana, Poovan is medium-sized with a thin skin and sweet flesh."}
]

@app.route('/get_product_details', methods=['GET'])
def get_product_details():
    try:
        product_id = request.args.get('id', type=int)  # Convert ID to integer
        product = next((p for p in products if p["id"] == product_id), None)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Check cache to prevent multiple responses
        if product_id in cache:
            return jsonify(cache[product_id])

        # Generate AI description (only if not cached)
        prompt = f"""
                Provide a structured description of {product['name']} ({product['type']}) including:
                - **Origin and History**
                - **Climate and Growth Conditions**
                - **Nutritional Value & Benefits**
                - **Uses in Cooking & Daily Life**
                Keep it clear, detailed, and informative.
                """
        response = gemini_model.generate_content(prompt)

        product_data = {
            "id": product["id"],
            "name": product["name"],
            "image": product["image"],
            "description": product["description"],
            "detailed_info": response.text  # AI-generated text
        }

        # Store response in cache
        cache[product_id] = product_data

        return jsonify(product_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)