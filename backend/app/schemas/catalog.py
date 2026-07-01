from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str | None = None

    model_config = ConfigDict(from_attributes=True)


class BrandOut(BaseModel):
    id: int
    name: str
    slug: str
    country: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SellerOut(BaseModel):
    id: int
    logo_url: str | None = None
    shop_name: str
    slug: str
    phone: str | None = None
    zalo: str | None = None
    city: str | None = None
    is_verified: bool

    model_config = ConfigDict(from_attributes=True)


class ProductOfferOut(BaseModel):
    id: int
    price: float | None = None
    stock_qty: int | None = None
    unit: str
    condition: str
    city: str | None = None
    warranty: str | None = None
    note: str | None = None
    created_at: datetime
    seller: SellerOut

    model_config = ConfigDict(from_attributes=True)


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    model_code: str | None = None
    refrigerant: str | None = None
    horsepower: str | None = None
    voltage: str | None = None
    short_description: str | None = None
    image_url: str | None = None
    created_at: datetime

    category: CategoryOut
    brand: BrandOut | None = None
    offers: list[ProductOfferOut] = []

    model_config = ConfigDict(from_attributes=True)