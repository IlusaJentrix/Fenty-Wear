from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime

db = SQLAlchemy()
bcrypt = Bcrypt()

class SerializerMixin:
    def serialize(self):
        columns = {column.key: getattr(self, column.key) for column in self.__table__.columns}
        relationships = {}
        
        # Handle relationships
        for relationship in self.__mapper__.relationships:
            if hasattr(self, relationship.key):
                value = getattr(self, relationship.key)
                if value is not None:
                    if isinstance(value, list):
                        relationships[relationship.key] = [item.serialize() for item in value]
                    else:
                        relationships[relationship.key] = value.serialize()

        return {**columns, **relationships}

class Category(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    products = db.relationship('Product', backref='category', lazy=True)

    def serialize(self):
        serialized = super().serialize()
        serialized['products'] = [product.serialize() for product in self.products]
        return serialized

class User(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(50), default='Registered')  # Possible values: 'Registered', 'Admin'
    cart = db.relationship('Cart', back_populates='user_association', uselist=False)

    def serialize(self):
        serialized = super().serialize()
        if 'cart' in serialized:
            serialized['cart']['products'] = [product.serialize() for product in self.cart.products]
        return serialized

class Product(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)  # Add this line

class Cart(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    user_association = db.relationship('User', back_populates='cart', foreign_keys=[user_id])
    products = db.relationship('Product', secondary='cart_product', backref='carts')

    def serialize(self):
        serialized = super().serialize()
        serialized['products'] = [product.serialize() for product in self.products]
        return serialized
    
#   For Logout JWT Block List
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti =  db.Column(db.String(100),nullable=True)
    created_at = db.Column(db.DateTime(), default=datetime.utcnow)

# Association table for Cart and Product many-to-many relationship
cart_product = db.Table('cart_product',
    db.Column('cart_id', db.Integer, db.ForeignKey('cart.id'), primary_key=True),
    db.Column('product_id', db.Integer, db.ForeignKey('product.id'), primary_key=True)
)
