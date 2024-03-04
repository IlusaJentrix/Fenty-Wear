# app.py
from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, get_jwt
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User, Product, bcrypt, Cart, Category, TokenBlocklist
from datetime import timedelta

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://fenty_wear_o6s5_user:8ikbbmTds7WWkMvhzNInQSFQ5WzmJlig@dpg-cnim585jm4es738o0840-a.oregon-postgres.render.com/fenty_wear_o6s5'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'a120f689-b263-4d4a-b853-9e463e2904fb'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=3)
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
    # Check if the user already exists based on username, email, or phone
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first() or User.query.filter_by(phone=data['phone']).first():
        return jsonify(message='User already exists'), 409

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        phone=data['phone'],
        email=data['email'],
        role = data['role'],
        password=hashed_password,
    )
    
    # Create a new cart and associate it with the user
    new_user.cart = Cart()

    db.session.add(new_user)
    db.session.commit()

    return jsonify(success='User created successfully'), 201





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
    product_list = [{'id': product.id, 'name': product.name, 'description': product.description, 'price': product.price, 'image_url': product.image_url, 'category_id': product.category_id, 'quantity': product.quantity} for product in products]
    return jsonify(products=product_list)

# Endpoint to fetch all categories
@app.route('/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    category_data = [{'id': category.id, 'name': category.name} for category in categories]

    return jsonify(categories=category_data), 200

@app.route('/products_by_category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    # Query the database to get products for a specific category
    category = Category.query.get(category_id)

    if not category:
        return jsonify({"message": "Category not found"}), 404

    # Fetch products for the specified category
    products = Product.query.filter_by(category=category).all()

    # Serialize the products and return the response
    product_list = [{
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'image_url': product.image_url,
        'quantity': product.quantity
    } for product in products]

    return jsonify(products=product_list), 200

@app.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify(id=user.id, username=user.username, phone=user.phone, email=user.email), 200
    else:
        return jsonify(message='User not found'), 404

@app.route('/user/update', methods=['PUT'])
@jwt_required()
def update_user():
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    user = User.query.filter_by(username=current_username).first()
    if user:
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.phone = data.get('phone', user.phone)
        user.email = data.get('email', user.email)
        db.session.commit()
        return jsonify(message='User updated successfully'), 200
    else:
        return jsonify(message='User not found'), 404

@app.route('/user/delete', methods=['DELETE'])
@jwt_required()
def delete_user():
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    user = User.query.filter_by(username=current_username).first()
    if user:
        # Assuming you have a relationship between User and Cart
        if user.cart:
            db.session.delete(user.cart)  # Delete associated cart
            db.session.delete(user)
            db.session.commit()
            return jsonify(message='User deleted successfully'), 200
    else:
        return jsonify(message='User not found'), 404


# Protected route to add a new product
@app.route('/products/add', methods=['POST'])
@jwt_required()
def add_product():
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    user = User.query.filter_by(username=current_username).first()


    if user and user.role != 'Admin':
        return jsonify({'message': 'Access denied: Requires admin privileges'}), 403


    data = request.get_json()
    new_product = Product(
        name=data['name'],
        description=data.get('description', ''),
        price=data['price'],
        image_url=data.get('image_url', ''),
        quantity=data.get('quantity', 1),
        category_id=data['category_id'],
    )

    if new_product.category_id:
        category = Category.query.get(new_product.category_id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404
    # Check if the product already exists in the database
    existing_product = Product.query.filter_by(name=new_product.name).first()
    if existing_product:
        return jsonify({'message': 'Product already exists'}), 400

    db.session.add(new_product)
    db.session.commit()

    return jsonify(success='Product added successfully'), 201


# Protected route to update a product
@app.route('/products/update/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    user = User.query.filter_by(username=current_username).first()


    if user and user.role != 'Admin':
        return jsonify({'message': 'Access denied: Requires admin privileges'}), 403

    product = Product.query.get(product_id)
    if not product:
        return jsonify(message='Product not found'), 404

    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.image_url = data.get('image_url', product.image_url)
    product.category_id = data.get('category_id', product.category_id)
    product.quantity = data.get('quantity', product.quantity)

    if product.category_id:
        category = Category.query.get(product.category_id)
        if not category:
            return jsonify({'message': 'Category not found'}), 404

    db.session.commit()

    return jsonify(success='Product updated successfully'), 200


# Protected route to delete a product
@app.route('/products/delete/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    user = User.query.filter_by(username=current_username).first()


    if user and user.role != 'Admin':
        return jsonify({'message': 'Access denied: Requires admin privileges'}), 403
    product = Product.query.get(product_id)
    if not product:
        return jsonify(message='Product not found'), 404

    db.session.delete(product)
    db.session.commit()

    return jsonify(message='Product deleted successfully'), 200

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
    items_list = [{'id': item.id, 'name': item.name, 'description': item.description, 'price': item.price, 'image_url': item.image_url, 'quantity': item.quantity} for item in cart_items]

    return jsonify(cart_items=items_list)
# Example route for fetching all users (Admin only)
@app.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    current_user = User.query.filter_by(username=current_username).first()

    # Check if the user has the "Admin" role
    if current_user and current_user.role == 'Admin':
        # Fetch all users from the database
        all_users = User.query.all()

        # Serialize the user data
        users_data = [{'id': user.id, 'username': user.username, 'email': user.email, 'phone': user.phone, 'role': user.role} for user in all_users]

        return jsonify(users=users_data), 200
    else:
        return jsonify(message='Unauthorized access'), 403
    

@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_by_id(user_id):
    # Access the identity of the current user with get_jwt_identity
    current_username = get_jwt_identity()

    # Query the database to get the user based on the username
    current_user = User.query.filter_by(username=current_username).first()

    # Check if the user has the "Admin" role
    if current_user and current_user.role == 'Admin':
        user = User.query.get(user_id)
        if user:
            # Assuming you have a relationship between User and Cart
            if user.cart:
                db.session.delete(user.cart)  # Delete associated cart
            db.session.delete(user)
            db.session.commit()
            return jsonify(message='User deleted successfully'), 200
        else:
            return jsonify(message='User not found'), 404
    else:
        return jsonify(message='Unauthorized access'), 403
    
@app.route("/authenticated_user", methods=["GET"])
@jwt_required()
def authenticated_user():
    current_user = get_jwt_identity() #geeting current user id
    user = User.query.filter_by(username=current_user).first()

    if user:
        user_data = {
            'id': user.id,
            'username':user.username,
            'email': user.email,
            'phone': user.phone,
            'role': user.role
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404
# Logout user
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jwt = get_jwt()

    jti = jwt['jti']

    token_b = TokenBlocklist(jti=jti)
    db.session.add(token_b)
    db.session.commit()

    return jsonify({"success": "Logged out successfully!"}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
