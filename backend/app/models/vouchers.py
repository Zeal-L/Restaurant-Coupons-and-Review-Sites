from sqlalchemy import Column, Integer, Boolean, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from . import db
from app import models


class Vouchers(db.Model):
    __tablename__ = "Vouchers"

    voucher_id = Column(Integer, primary_key=True)
    voucher_template_id = Column(
        Integer, ForeignKey("VoucherTemplate.voucher_id"), nullable=False
    )
    owner_id = Column(Integer, ForeignKey("Users.user_id"), nullable=False)
    is_used = Column(Boolean, nullable=False)
    used_time = Column(Date)
    code = Column(Text, nullable=False)
    code_time = Column(Date)

    voucher_template = relationship(models.VoucherTemplate)
    owner = relationship(models.Users)

    ############################################################

    def set_is_used(self, is_used: bool) -> None:
        self.is_used = is_used
        db.session.commit()

    def set_used_time(self, used_time: Date) -> None:
        self.used_time = used_time
        db.session.commit()

    def set_code(self, code: str) -> None:
        self.code = code
        db.session.commit()

    def set_code_time(self, code_time: Date) -> None:
        self.code_time = code_time
        db.session.commit()

    ############################################################

    @staticmethod
    def create_voucher(
        voucher_template_id: int, owner_id: int, is_used: bool, code: str
    ) -> "Vouchers":
        voucher = Vouchers(
            voucher_template_id=voucher_template_id,
            owner_id=owner_id,
            is_used=is_used,
            code=code,
        )
        db.session.add(voucher)
        db.session.commit()
        return voucher

    @staticmethod
    def get_voucher_by_id(voucher_id: int) -> "Vouchers" or None:
        return Vouchers.query.filter_by(voucher_id=voucher_id).one_or_none()

    @staticmethod
    def get_vouchers_by_owner(owner_id: int) -> "Vouchers" or None:
        return Vouchers.query.filter_by(owner_id=owner_id).all()

    @staticmethod
    def get_vouchers_by_voucher_template(
        voucher_template_id: int,
    ) -> "Vouchers" or None:
        return Vouchers.query.filter_by(voucher_template_id=voucher_template_id).all()

    @staticmethod
    def delete_voucher(voucher_id: int) -> None:
        voucher = Vouchers.get_voucher_by_id(voucher_id)
        db.session.delete(voucher)
        db.session.commit()
