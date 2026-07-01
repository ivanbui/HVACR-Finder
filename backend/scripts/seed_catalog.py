from app.core.database import SessionLocal
from app.models.catalog import Brand, Category, Product, Seller


def get_or_create(db, model, defaults=None, **kwargs):
    item = db.query(model).filter_by(**kwargs).first()
    if item:
        return item
    data = {**kwargs, **(defaults or {})}
    item = model(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def seed():
    db = SessionLocal()

    categories = [
        ("Máy nén lạnh", "may-nen-lanh"),
        ("Gas lạnh", "gas-lanh"),
        ("Ống đồng", "ong-dong"),
        ("Dàn nóng", "dan-nong"),
        ("Dàn lạnh", "dan-lanh"),
        ("Van điện từ", "van-dien-tu"),
        ("Phin lọc", "phin-loc"),
        ("Dầu lạnh", "dau-lanh"),
        ("Linh kiện kho lạnh", "linh-kien-kho-lanh"),
        ("Dụng cụ điện lạnh", "dung-cu-dien-lanh"),
    ]

    brands = [
        ("Kulthorn", "kulthorn", "Thailand"),
        ("Copeland", "copeland", "USA"),
        ("Danfoss", "danfoss", "Denmark"),
        ("Panasonic", "panasonic", "Japan"),
        ("LG", "lg", "Korea"),
        ("Embraco", "embraco", "Brazil"),
        ("Secop", "secop", "Germany"),
        ("Bitzer", "bitzer", "Germany"),
    ]

    sellers = [
        {
            "shop_name": "MIANMI",
            "slug": "mianmi",
            "phone": "0900000000",
            "zalo": "0900000000",
            "city": "TP.HCM",
            "address": "TP.HCM",
            "is_verified": True,
        },
        {
            "shop_name": "Kho Lạnh Sài Gòn",
            "slug": "kho-lanh-sai-gon",
            "phone": "0911111111",
            "zalo": "0911111111",
            "city": "TP.HCM",
            "address": "Bình Tân, TP.HCM",
            "is_verified": True,
        },
        {
            "shop_name": "Điện Lạnh Hà Nội",
            "slug": "dien-lanh-ha-noi",
            "phone": "0922222222",
            "zalo": "0922222222",
            "city": "Hà Nội",
            "address": "Hoàng Mai, Hà Nội",
            "is_verified": False,
        },
    ]

    for name, slug in categories:
        get_or_create(db, Category, name=name, slug=slug)

    for name, slug, country in brands:
        get_or_create(db, Brand, name=name, slug=slug, defaults={"country": country})

    for seller in sellers:
        get_or_create(db, Seller, slug=seller["slug"], defaults=seller)

    compressor = db.query(Category).filter_by(slug="may-nen-lanh").first()
    gas = db.query(Category).filter_by(slug="gas-lanh").first()
    kulthorn = db.query(Brand).filter_by(slug="kulthorn").first()
    copeland = db.query(Brand).filter_by(slug="copeland").first()
    danfoss = db.query(Brand).filter_by(slug="danfoss").first()
    seller_mianmi = db.query(Seller).filter_by(slug="mianmi").first()
    seller_sg = db.query(Seller).filter_by(slug="kho-lanh-sai-gon").first()

    products = [
        {
            "seller": seller_mianmi,
            "category": compressor,
            "brand": kulthorn,
            "name": "Máy nén Kulthorn WJ9460EK-SA R22 220V",
            "slug": "may-nen-kulthorn-wj9460ek-sa-r22-220v",
            "model_code": "WJ9460EK-SA",
            "refrigerant": "R22",
            "horsepower": "1HP",
            "voltage": "220V/50Hz",
            "condition": "new",
            "price_reference": 4200000,
            "unit": "cái",
            "short_description": "Máy nén Kulthorn dùng gas R22, điện 220V, phù hợp sửa chữa thay thế.",
        },
        {
            "seller": seller_sg,
            "category": compressor,
            "brand": copeland,
            "name": "Máy nén Copeland ZR72KC-TFD",
            "slug": "may-nen-copeland-zr72kc-tfd",
            "model_code": "ZR72KC-TFD",
            "refrigerant": "R22",
            "horsepower": "6HP",
            "voltage": "380V/50Hz",
            "condition": "new",
            "price_reference": 18500000,
            "unit": "cái",
            "short_description": "Máy nén scroll Copeland cho điều hòa trung tâm và hệ thống lạnh.",
        },
        {
            "seller": seller_mianmi,
            "category": compressor,
            "brand": danfoss,
            "name": "Máy nén Danfoss Maneurop MT64",
            "slug": "may-nen-danfoss-maneurop-mt64",
            "model_code": "MT64",
            "refrigerant": "R22",
            "horsepower": "5HP",
            "voltage": "380V/50Hz",
            "condition": "new",
            "price_reference": 16500000,
            "unit": "cái",
            "short_description": "Máy nén piston Danfoss Maneurop dùng cho hệ thống lạnh thương mại.",
        },
        {
            "seller": seller_sg,
            "category": gas,
            "brand": None,
            "name": "Gas lạnh R32 bình 9.5kg",
            "slug": "gas-lanh-r32-binh-95kg",
            "model_code": "R32-9.5KG",
            "refrigerant": "R32",
            "horsepower": None,
            "voltage": None,
            "condition": "new",
            "price_reference": 1450000,
            "unit": "bình",
            "short_description": "Gas lạnh R32 dùng cho máy lạnh dân dụng đời mới.",
        },
    ]

    for item in products:
        exists = db.query(Product).filter_by(slug=item["slug"]).first()
        if exists:
            continue

        product = Product(
            seller_id=item["seller"].id,
            category_id=item["category"].id,
            brand_id=item["brand"].id if item["brand"] else None,
            name=item["name"],
            slug=item["slug"],
            model_code=item["model_code"],
            refrigerant=item["refrigerant"],
            horsepower=item["horsepower"],
            voltage=item["voltage"],
            condition=item["condition"],
            price_reference=item["price_reference"],
            unit=item["unit"],
            short_description=item["short_description"],
        )
        db.add(product)

    db.commit()
    db.close()
    print("Seed catalog data completed.")


if __name__ == "__main__":
    seed()