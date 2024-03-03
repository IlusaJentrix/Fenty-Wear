# seed.py
from app import app
from models import db, User, Product, Category, bcrypt

def seed_data():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Create tables
        db.create_all()

        # Seed users
        hashed_password = bcrypt.generate_password_hash("password").decode('utf-8')
        admin = User(username="Admin", phone="1234567890", email="admin@example.com", password=hashed_password, role="Admin")
        db.session.add(admin)

        # Seed categories
        categories_data = [
            {"name": "Makeup"},
            {"name": "Skincare"},
            {"name": "Haircare"},
            {"name": "Fragrance"},
            {"name": "Nailcare"},
        ]

        for category_data in categories_data:
            category = Category(name=category_data["name"])
            db.session.add(category)

        # Commit changes to save categories
        db.session.commit()

        # Seed products
        products_data = [
            {"name": "Lipstick", "description": "Long-lasting lipstick with vibrant colors", "price": 12.99, "image_url": "lipstick.jpg", "category_id": 1},
            {"name": "Facial Cleanser", "description": "Gentle cleanser for daily skincare routine", "price": 19.99, "image_url": "cleanser.jpg", "category_id": 2},
            {"name": "Eye Shadow Palette", "description": "Palette with a variety of eyeshadow shades", "price": 24.99, "image_url": "eyeshadow.jpg", "category_id": 1},
            {"name": "Moisturizing Cream", "description": "Hydrating cream for soft and supple skin", "price": 15.99, "image_url": "moisturizer.jpg", "category_id": 2},
            {"name": "Hair Conditioner", "description": "Nourishing conditioner for silky smooth hair", "price": 14.99, "image_url": "conditioner.jpg", "category_id": 3},
            {"name": "Perfume", "description": "Fragrance with floral and fruity notes", "price": 29.99, "image_url": "perfume.jpg", "category_id": 4},
            {"name": "Nail Polish Set", "description": "Set of trendy and vibrant nail polish colors", "price": 10.99, "image_url": "nail_polish.jpg", "category_id": 5},
            {"name": "Hair Styling Gel", "description": "Gel for creating stylish and sleek hairstyles", "price": 8.99, "image_url": "hair_gel.jpg", "category_id": 3},
            {"name": "Blush Palette", "description": "Palette with blush shades for a rosy glow", "price": 17.99, "image_url": "blush.jpg", "category_id": 1},
            {"name": "Sunscreen Lotion", "description": "SPF lotion for sun protection", "price": 13.99, "image_url": "sunscreen.jpg", "category_id": 2},
        ]

        for product_data in products_data:
            # Find the associated category by ID
            category = Category.query.get(product_data["category_id"])
            if not category:
                print(f"Category with ID {product_data['category_id']} not found. Skipping product {product_data['name']}.")
                continue

            product = Product(name=product_data["name"], description=product_data["description"], price=product_data["price"], image_url=product_data["image_url"], category=category)
            db.session.add(product)

        # Commit changes to save products
        db.session.commit()

if __name__ == '__main__':
    seed_data()
    print("Database seeded successfully.")
