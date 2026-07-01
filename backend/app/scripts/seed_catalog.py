from app.core.database import SessionLocal
from app.models.catalog import Brand, Category, Product, ProductOffer, Seller


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
            "logo_url": "https://dummyimage.com/160x160/ffffff/0f766e.png&text=MIANMI",
            "slug": "mianmi",
            "phone": "0900000000",
            "zalo": "0900000000",
            "city": "TP.HCM",
            "address": "TP.HCM",
            "is_verified": True,
        },
        {
            "shop_name": "Kho Lạnh Sài Gòn",
            "logo_url": "https://dummyimage.com/160x160/ffffff/0f766e.png&text=KHO+LANH",
            "slug": "kho-lanh-sai-gon",
            "phone": "0911111111",
            "zalo": "0911111111",
            "city": "TP.HCM",
            "address": "Bình Tân, TP.HCM",
            "is_verified": True,
        },
        {
            "shop_name": "Điện Lạnh Hà Nội",
            "logo_url": "https://dummyimage.com/160x160/0f4ca8/ffffff.png&text=HA+NOI",
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

    c_compressor = db.query(Category).filter_by(slug="may-nen-lanh").first()
    c_gas = db.query(Category).filter_by(slug="gas-lanh").first()

    b_kulthorn = db.query(Brand).filter_by(slug="kulthorn").first()
    b_copeland = db.query(Brand).filter_by(slug="copeland").first()
    b_danfoss = db.query(Brand).filter_by(slug="danfoss").first()

    p1 = get_or_create(
        db,
        Product,
        slug="kulthorn-wj9460ek-sa",
        defaults={
            "category_id": c_compressor.id,
            "brand_id": b_kulthorn.id,
            "name": "Kulthorn WJ9460EK-SA",
            "image_url": "https://dummyimage.com/600x600/e5e7eb/111827.png&text=Kulthorn+Compressor",
            "model_code": "WJ9460EK-SA",
            "refrigerant": "R22",
            "horsepower": "1HP",
            "voltage": "220V/50Hz",
            "short_description": "Máy nén Kulthorn model WJ9460EK-SA, dùng gas R22, điện 220V/50Hz.",
        },
    )

    p2 = get_or_create(
        db,
        Product,
        slug="copeland-zr72kc-tfd",
        defaults={
            "category_id": c_compressor.id,
            "brand_id": b_copeland.id,
            "name": "Copeland ZR72KC-TFD",
            "image_url": "https://dummyimage.com/600x600/e5e7eb/111827.png&text=Kulthorn+Compressor",
            "model_code": "ZR72KC-TFD",
            "refrigerant": "R22",
            "horsepower": "6HP",
            "voltage": "380V/50Hz",
            "short_description": "Máy nén scroll Copeland dùng cho hệ thống lạnh thương mại.",
        },
    )

    p3 = get_or_create(
        db,
        Product,
        slug="danfoss-maneurop-mt64",
        defaults={
            "category_id": c_compressor.id,
            "brand_id": b_danfoss.id,
            "name": "Danfoss Maneurop MT64",
            "image_url": "https://dummyimage.com/600x600/e5e7eb/111827.png&text=Kulthorn+Compressor",
            "model_code": "MT64",
            "refrigerant": "R22",
            "horsepower": "5HP",
            "voltage": "380V/50Hz",
            "short_description": "Máy nén piston Danfoss Maneurop dùng cho hệ thống lạnh thương mại.",
        },
    )

    p4 = get_or_create(
        db,
        Product,
        slug="gas-r32-binh-95kg",
        defaults={
            "category_id": c_gas.id,
            "brand_id": None,
            "name": "Gas lạnh R32 bình 9.5kg",
            "image_url": "https://dummyimage.com/600x600/e5e7eb/111827.png&text=Kulthorn+Compressor",
            "model_code": "R32-9.5KG",
            "refrigerant": "R32",
            "horsepower": None,
            "voltage": None,
            "short_description": "Gas lạnh R32 dùng cho máy lạnh dân dụng đời mới.",
        },
    )

    s_mianmi = db.query(Seller).filter_by(slug="mianmi").first()
    s_sg = db.query(Seller).filter_by(slug="kho-lanh-sai-gon").first()
    s_hn = db.query(Seller).filter_by(slug="dien-lanh-ha-noi").first()

    offers = [
        (p1, s_mianmi, 4200000, 71, "TP.HCM", "new", "7 ngày", "Hàng có sẵn tại kho."),
        (p1, s_sg, 4350000, 10, "TP.HCM", "new", "7 ngày", "Có hỗ trợ giao nội thành."),
        (p1, s_hn, 4550000, 6, "Hà Nội", "new", "7 ngày", "Gửi hàng toàn quốc."),
        (p2, s_sg, 18500000, 2, "TP.HCM", "new", "1 tháng", "Cần xác nhận tồn trước khi lấy."),
        (p3, s_mianmi, 16500000, 3, "TP.HCM", "new", "1 tháng", "Hàng nhập khẩu."),
        (p4, s_sg, 1450000, 20, "TP.HCM", "new", None, "Giá tham khảo theo bình."),
    ]

    for product, seller, price, stock_qty, city, condition, warranty, note in offers:
        exists = (
            db.query(ProductOffer)
            .filter_by(product_id=product.id, seller_id=seller.id)
            .first()
        )
        if exists:
            continue

        db.add(
            ProductOffer(
                product_id=product.id,
                seller_id=seller.id,
                price=price,
                stock_qty=stock_qty,
                city=city,
                condition=condition,
                warranty=warranty,
                note=note,
                unit="cái" if product != p4 else "bình",
            )
        )

    db.commit()
    db.close()
    print("Seed catalog data completed with product + offers model.")


if __name__ == "__main__":
    seed()
