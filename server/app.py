# app.py
from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, Product, bcrypt, Cart

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///beauty_store.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a120f689-b263-4d4a-b853-9e463e2904fb'
jwt = JWTManager(app)
CORS(app)

db.init_app(app)
bcrypt.init_app(app)

migrate = Migrate(app, db)

# Routes
@app.route('/')
def index():
    return render_template('welcome.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        phone=data['phone'],
        email=data['email'],
        password=hashed_password,
    )
    
    # Create a new cart and associate it with the user
    new_user.cart = Cart()

    db.session.add(new_user)
    db.session.commit()

    return jsonify(message='User created successfully'), 201





@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify(message='Invalid credentials'), 401

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [{'id': product.id, 'name': product.name, 'description': product.description, 'price': product.price, 'image_url': product.image_url} for product in products]
    return jsonify(products=product_list)

@app.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(id=user.id, username=user.username, phone=user.phone, email=user.email), 200
    else:
        return jsonify(message='User not found'), 404

@app.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.phone = data.get('phone', user.phone)
        user.email = data.get('email', user.email)
        db.session.commit()
        return jsonify(message='User updated successfully'), 200
    else:
        return jsonify(message='User not found'), 404

@app.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify(message='User deleted successfully'), 200
    else:
        return jsonify(message='User not found'), 404



# Protected route to add a product to the cart
@app.route('/add_to_cart/<int:product_id>', methods=['POST'])
@jwt_required()
def add_to_cart(product_id):
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user ID using the username
    user = User.query.filter_by(username=current_username).first()

    if not user:
        print("User not found")
        return jsonify({"message": "User not found"}), 404
    
    if not user.cart:
        print("User's cart not found, creating a new cart")
        new_cart = Cart()
        db.session.add(new_cart)
        db.session.commit()
        user.cart = new_cart

    # Ensure that user.cart.products is initialized to an empty list
    if user.cart.products is None:
        user.cart.products = []

    # Check if the product and user exist
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    # Check if the product is already in the user's cart
    if product in user.cart.products:
        return jsonify({"message": "Product already in the cart"}), 400
    
    # Add the product to the user's cart
    user.cart.products.append(product)
    db.session.commit()
    
    return jsonify({"message": "Product added to the cart successfully"}), 200


# Protected route to remove a product from the cart
@app.route('/remove_from_cart/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(product_id):
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user ID using the username
    user = User.query.filter_by(username=current_username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if the product and user exist
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({"message": "Product not found"}), 404
    
    # Check if the product is in the user's cart
    if product not in user.cart.products:
        return jsonify({"message": "Product not in the cart"}), 400
    
    # Remove the product from the user's cart
    user.cart.products.remove(product)
    db.session.commit()
    
    return jsonify({"message": "Product removed from the cart successfully"}), 200
@app.route('/cart/items', methods=['GET'])
@jwt_required()
def get_cart_items():
    current_username = get_jwt_identity()
    current_user = User.query.filter_by(username=current_username).first()

    if not current_user:
        return jsonify(message='User not found'), 404

    cart_items = current_user.cart.products
    items_list = [{'id': item.id, 'name': item.name, 'description': item.description, 'price': item.price, 'image_url': item.image_url} for item in cart_items]

    return jsonify(cart_items=items_list)



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
