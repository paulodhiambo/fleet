import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import async_session
from app.models.vehicle import Vehicle
from app.models.contact import Contact
from app.models.role import Role, Permission

async def clear_data(db: AsyncSession):
    # Optional: Clear existing seed data if necessary, or just rely on the script being run once.
    # Be careful with Foreign keys; simple deletes might fail without CASCADE.
    pass

async def seed_data():
    async with async_session() as db:
        # Check if already seeded to prevent unique constraint failures
        existing_roles = await db.execute(select(Role))
        if existing_roles.scalars().first():
            print("Database already contains roles. Skipping seeding to prevent duplicates.")
            return

        print("Seeding database...")
        # 1. Seed Permissions
        permissions = [
            Permission(name="view_vehicles", description="Can view vehicle records", module="vehicles"),
            Permission(name="edit_vehicles", description="Can create/update vehicles", module="vehicles"),
            Permission(name="delete_vehicles", description="Can delete vehicles", module="vehicles"),
            Permission(name="view_contacts", description="Can view contacts", module="contacts"),
            Permission(name="edit_contacts", description="Can manage contacts", module="contacts"),
        ]
        db.add_all(permissions)
        await db.commit()
        
        for p in permissions:
            await db.refresh(p)
            
        # 2. Seed Roles
        admin_role = Role(name="Administrator", description="Full system access", is_active=True)
        admin_role.permissions = permissions
        
        viewer_role = Role(name="Viewer", description="Read-only access to system", is_active=True)
        viewer_role.permissions = [p for p in permissions if "view" in p.name]
        
        db.add_all([admin_role, viewer_role])
        
        # 3. Seed Contacts
        contacts = [
            Contact(name="Paul Odhiambo", role="Fleet Manager", email="paul@example.com", phone="+254700000000", status="active"),
            Contact(name="Jane Logistics", role="Port Agent", email="jane.agent@example.com", phone="+254711111111", status="active", company="Mombasa Freight"),
        ]
        db.add_all(contacts)
        
        # 4. Seed Vehicles
        vehicles = [
            Vehicle(vin="1HGCM82633A004351", make="Honda", model="Accord", year=2020, origin_country="Japan", status="pending", purchase_price=12000.0),
            Vehicle(vin="JT2BG22R330054322", make="Toyota", model="Camry", year=2019, origin_country="Singapore", status="in-transit", purchase_price=15000.0),
            Vehicle(vin="WBA3C11055F098763", make="BMW", model="3 Series", year=2021, origin_country="UK", status="cleared", purchase_price=25000.0),
            Vehicle(vin="JHMZP58461C023454", make="Honda", model="Civic", year=2022, origin_country="Japan", status="post-inspection", purchase_price=14500.0),
            Vehicle(vin="WVWZZZ1TZ8W054325", make="Volkswagen", model="Tiguan", year=2018, origin_country="UK", status="rejected", purchase_price=11000.0, notes="Damaged in transit.")
        ]
        db.add_all(vehicles)
        
        await db.commit()
        print("✅ Successfully seeded database with Roles, Permissions, Contacts, and Vehicles!")

if __name__ == "__main__":
    asyncio.run(seed_data())
