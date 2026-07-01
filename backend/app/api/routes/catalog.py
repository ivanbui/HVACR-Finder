from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.catalog import Brand, Category, Product, ProductOffer, Seller
from app.schemas.catalog import BrandOut, CategoryOut, ProductOut, SellerOut


router = APIRouter(prefix="/catalog", tags=["Catalog"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).order_by(Category.name.asc()).all()


@router.get("/brands", response_model=list[BrandOut])
def list_brands(db: Session = Depends(get_db)):
    return db.query(Brand).filter(Brand.is_active == True).order_by(Brand.name.asc()).all()


@router.get("/sellers", response_model=list[SellerOut])
def list_sellers(db: Session = Depends(get_db)):
    return db.query(Seller).filter(Seller.is_active == True).order_by(Seller.shop_name.asc()).all()


@router.get("/products", response_model=list[ProductOut])
def list_products(
    q: str | None = Query(default=None),
    category: str | None = Query(default=None),
    brand: str | None = Query(default=None),
    refrigerant: str | None = Query(default=None),
    city: str | None = Query(default=None),
    limit: int = Query(default=30, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.brand),
            joinedload(Product.offers).joinedload(ProductOffer.seller),
        )
        .join(Product.category)
        .outerjoin(Product.brand)
        .filter(Product.is_active == True)
    )

    if q:
        keyword = f"%{q.strip()}%"
        query = query.filter(
            (Product.name.ilike(keyword))
            | (Product.model_code.ilike(keyword))
            | (Product.short_description.ilike(keyword))
        )

    if category:
        query = query.filter(Category.slug == category)

    if brand:
        query = query.filter(Brand.slug == brand)

    if refrigerant:
        query = query.filter(Product.refrigerant == refrigerant)

    if city:
        query = (
            query.join(Product.offers)
            .join(ProductOffer.seller)
            .filter(ProductOffer.city.ilike(f"%{city.strip()}%"))
        )

    return query.order_by(Product.created_at.desc()).limit(limit).all()


@router.get("/products/{slug}", response_model=ProductOut)
def product_detail(slug: str, db: Session = Depends(get_db)):
    return (
        db.query(Product)
        .options(
            joinedload(Product.category),
            joinedload(Product.brand),
            joinedload(Product.offers).joinedload(ProductOffer.seller),
        )
        .filter(Product.slug == slug, Product.is_active == True)
        .first()
    )