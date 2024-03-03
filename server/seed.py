# seed.py
from app import app
from models import db, User, Product, Cart, bcrypt

def seed_data():
    with app.app_context():
        # Drop all tables
        db.drop_all()
        # Create tables
        db.create_all()

        # Seed users
        hashed_password = bcrypt.generate_password_hash("password123").decode('utf-8')
        user1 = User(username="user1", phone="1234567890", email="user1@example.com", password=hashed_password)
        db.session.add(user1)

        # Seed products
        products = [
            Product(name="Lipstick", description="Long-lasting lipstick with vibrant colors", price=12.99, image_url="lipstick.jpg"),
            Product(name="Facial Cleanser", description="Gentle cleanser for daily skincare routine", price=19.99, image_url="cleanser.jpg"),
            Product(name="Eye Shadow Palette", description="Palette with a variety of eyeshadow shades", price=24.99, image_url="eyeshadow.jpg"),
            Product(name="Moisturizing Cream", description="Hydrating cream for soft and supple skin", price=15.99, image_url="moisturizer.jpg"),
            Product(name="Hair Conditioner", description="Nourishing conditioner for silky smooth hair", price=14.99, image_url="conditioner.jpg"),
            Product(name="Perfume", description="Fragrance with floral and fruity notes", price=29.99, image_url="perfume.jpg"),
            Product(name="Nail Polish Set", description="Set of trendy and vibrant nail polish colors", price=10.99, image_url="nail_polish.jpg"),
            Product(name="Hair Styling Gel", description="Gel for creating stylish and sleek hairstyles", price=8.99, image_url="hair_gel.jpg"),
            Product(name="Blush Palette", description="Palette with blush shades for a rosy glow", price=17.99, image_url="blush.jpg"),
            Product(name="Sunscreen Lotion", description="SPF lotion for sun protection", price=13.99, image_url="sunscreen.jpg"),
        ]

        for product in products:
            db.session.add(product)

        # Commit changes
        db.session.commit()

if __name__ == '__main__':
    seed_data()
    print("Database seeded successfully.")
