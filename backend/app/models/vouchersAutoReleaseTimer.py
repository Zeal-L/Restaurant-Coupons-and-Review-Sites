from sqlalchemy import Column, Integer, Date, ForeignKey, Float
from sqlalchemy.orm import relationship

from . import db
from app import models


class VouchersAutoReleaseTimer(db.Model):
    __tablename__ = "VouchersAutoReleaseTimer"

    timer_id = Column(Integer, primary_key=True)
    restaurant_id = Column(
        Integer, ForeignKey("Restaurants.restaurant_id"), nullable=False
    )
    template_id = Column(
        Integer, ForeignKey("VoucherTemplate.template_id"), nullable=False
    )
    amount = Column(Integer, nullable=False)
    start_date = Column(Float, nullable=False)
    end_date = Column(Float, nullable=False)
    interval = Column(Integer, nullable=False)

    restaurant = relationship(models.Restaurants)
    template = relationship(models.VoucherTemplate)

    ############################################################

    def set_amount(self, amount: int) -> None:
        self.amount = amount
        db.session.commit()

    def set_start_date(self, start_date: float) -> None:
        self.start_date = start_date
        db.session.commit()

    def set_end_date(self, end_date: float) -> None:
        self.end_date = end_date
        db.session.commit()

    def set_interval(self, interval: int) -> None:
        self.interval = interval
        db.session.commit()

    ############################################################

    @staticmethod
    def create_vouchers_auto_release_timer(
        restaurant_id: int,
        template_id: int,
        amount: int,
        start_date: float,
        end_date: float,
        interval: int,
    ) -> "VouchersAutoReleaseTimer":
        vouchers_auto_release_timer = VouchersAutoReleaseTimer(
            restaurant_id=restaurant_id,
            template_id=template_id,
            amount=amount,
            start_date=start_date,
            end_date=end_date,
            interval=interval,
        )
        db.session.add(vouchers_auto_release_timer)
        db.session.commit()
        return vouchers_auto_release_timer

    @staticmethod
    def get_timer_by_id(
        timer_id: int,
    ) -> "VouchersAutoReleaseTimer" or None:
        return VouchersAutoReleaseTimer.query.filter_by(timer_id=timer_id).one_or_none()

    @staticmethod
    def get_all_timers_by_restaurant(
        restaurant_id: int,
    ) -> list["VouchersAutoReleaseTimer"] or None:
        return VouchersAutoReleaseTimer.query.filter_by(
            restaurant_id=restaurant_id
        ).all()

    @staticmethod
    def get_by_template_id(
        template_id: int,
    ) -> "VouchersAutoReleaseTimer" or None:
        return VouchersAutoReleaseTimer.query.filter_by(
            template_id=template_id
        ).one_or_none()

    @staticmethod
    def delete_timer_by_id(timer_id: int) -> None:
        timer = VouchersAutoReleaseTimer.get_timer_by_id(timer_id)
        db.session.delete(timer)
        db.session.commit()
