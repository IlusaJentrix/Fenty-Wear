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
            {"name": "Dresses"},
            {"name": "Tops"},
            {"name": "Bottoms"},
            {"name": "Outerwear"},
            {"name": "Accessories"},
        ]

        for category_data in categories_data:
            category = Category(name=category_data["name"])
            db.session.add(category)

        # Commit changes to save categories
        db.session.commit()

        # Seed products
        products_data = [
            {"name": "Elegant Evening Dress", "description": "Floor-length evening dress with intricate detailing", "price": 89.99, "image_url": "https://images.unsplash.com/photo-1499939667766-4afceb292d05?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 1, "quantity": 10},
            {"name": "Casual Floral Top", "description": "Comfortable top with a vibrant floral pattern", "price": 29.99, "image_url": "https://images.unsplash.com/photo-1613891737415-be7670d21c19?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 2, "quantity": 20},
            {"name": "Denim Skinny Jeans", "description": "Classic denim jeans for a stylish look", "price": 39.99, "image_url": "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 3, "quantity": 15},
            {"name": "Warm Wool Coat", "description": "Cozy wool coat for chilly days", "price": 79.99, "image_url": "https://images.unsplash.com/photo-1515434126000-961d90ff09db?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 4, "quantity": 25},
            {"name": "Statement Necklace", "description": "Bold and trendy necklace to accessorize any outfit", "price": 19.99, "image_url": "https://images.unsplash.com/photo-1636103952204-0b738c225264?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 5, "quantity": 18},
            {"name": "Stylish Handbag", "description": "Chic handbag with multiple compartments", "price": 49.99, "image_url": "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 5, "quantity": 22},
            {"name": "Printed Maxi Skirt", "description": "Long and flowy skirt with a stylish print", "price": 34.99, "image_url": "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 3, "quantity": 12},
            {"name": "Embroidered Blouse", "description": "Blouse with delicate embroidery for a feminine touch", "price": 45.99, "image_url": "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 2, "quantity": 30},
            {"name": "Classic Trench Coat", "description": "Timeless trench coat for a sophisticated look", "price": 69.99, "image_url": "https://images.unsplash.com/photo-1603223792130-d4a3587ae6d3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 4, "quantity": 17},
            {"name": "Knit Infinity Scarf", "description": "Soft and cozy scarf to keep you warm", "price": 24.99, "image_url": "https://images.unsplash.com/photo-1652904875657-783c4e2c04e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "category_id": 5, "quantity": 24},
        ]

        for product_data in products_data:
            category = Category.query.get(product_data["category_id"])
            if not category:
                print(f"Category with ID {product_data['category_id']} not found. Skipping product {product_data['name']}.")
                continue

            product = Product(
                name=product_data["name"],
                description=product_data["description"],
                price=product_data["price"],
                image_url=product_data["image_url"],
                category=category,
                quantity=product_data["quantity"]
            )
            db.session.add(product)

        # Commit changes to save products
        db.session.commit()

if __name__ == '__main__':
    seed_data()
    print("Database seeded successfully.")
