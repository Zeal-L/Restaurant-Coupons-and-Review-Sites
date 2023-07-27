from sqlalchemy import Column, Integer, Text, Boolean, Date, ForeignKey, Float
from sqlalchemy.orm import relationship

from . import db
from app import models


class VoucherTemplate(db.Model):
    __tablename__ = "VoucherTemplate"

    template_id = Column(Integer, primary_key=True)
    restaurant_id = Column(
        Integer, ForeignKey("Restaurants.restaurant_id"), nullable=False
    )
    type = Column(Text, nullable=False)
    discount = Column(Text, nullable=False)
    condition = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    expire = Column(Float, nullable=False)
    shareable = Column(Boolean, nullable=False)
    remain_amount = Column(Integer, nullable=False)
    total_amount = Column(Integer, nullable=False)

    restaurant = relationship(models.Restaurants)

    ############################################################

    def set_type(self, voucher_type: str) -> None:
        self.type = voucher_type
        db.session.commit()

    def set_discount(self, discount: str) -> None:
        self.discount = discount
        db.session.commit()

    def set_condition(self, condition: str) -> None:
        self.condition = condition
        db.session.commit()

    def set_description(self, description: str) -> None:
        self.description = description
        db.session.commit()

    def set_expire(self, expire: float) -> None:
        self.expire = expire
        db.session.commit()

    def set_shareable(self, shareable: bool) -> None:
        self.shareable = shareable
        db.session.commit()

    def set_remain_amount(self, remain_amount: int) -> None:
        self.remain_amount = remain_amount
        db.session.commit()

    def set_total_amount(self, total_amount: int) -> None:
        self.total_amount = total_amount
        db.session.commit()

    ############################################################

    @staticmethod
    def create_voucher_template(
        restaurant_id: int,
        voucher_type: str,
        discount: str,
        condition: str,
        description: str,
        expire: float,
        shareable: bool,
        remain_amount: int,
        total_amount: int,
    ) -> "VoucherTemplate":
        voucher_template = VoucherTemplate(
            restaurant_id=restaurant_id,
            type=voucher_type,
            discount=discount,
            condition=condition,
            description=description,
            expire=expire,
            shareable=shareable,
            remain_amount=remain_amount,
            total_amount=total_amount,
        )
        db.session.add(voucher_template)
        db.session.commit()
        return voucher_template

    @staticmethod
    def get_voucher_template_by_id(template_id: int) -> "VoucherTemplate" or None:
        return VoucherTemplate.query.filter_by(template_id=template_id).one_or_none()

    @staticmethod
    def get_voucher_templates_by_restaurant(
        restaurant_id: int,
    ) -> list["VoucherTemplate"]:
        return VoucherTemplate.query.filter_by(restaurant_id=restaurant_id).all()

    @staticmethod
    def delete_voucher_template(template_id: int) -> None:
        voucher_template = VoucherTemplate.get_voucher_template_by_id(template_id)
        db.session.delete(voucher_template)
        db.session.commit()
