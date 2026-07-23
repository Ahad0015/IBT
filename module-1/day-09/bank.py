from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Protocol, runtime_checkable


class InsufficientFundsError(Exception):
    pass


class EmptyHistoryError(Exception):
    pass


class BankConfig:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


@runtime_checkable
class Notifier(Protocol):
    def update(self, event: str) -> None:
        ...


class SMSAlert:
    def update(self, event: str) -> None:
        print(f"[TeleBirr SMS] {event}")


class AuditLog:
    def update(self, event: str) -> None:
        print(f"[Log] {event}")


class AlertService:
    def __init__(self) -> None:
        self._observers: list[Notifier] = []

    def subscribe(self, observer: Notifier) -> None:
        self._observers.append(observer)

    def unsubscribe(self, observer: Notifier) -> None:
        self._observers.remove(observer)

    def notify(self, event: str) -> None:
        for observer in self._observers:
            observer.update(event)


class InterestBearing(ABC):
    @abstractmethod
    def calculate_interest(self) -> float:
        ...


class Account(ABC):
    def __init__(self, owner: str, number: str, balance: float = 0):
        self.owner = owner
        self.number = number
        self.balance = balance
        self._alerts = AlertService()
        self.history: list[dict] = []

    def subscribe(self, observer: Notifier) -> None:
        self._alerts.subscribe(observer)

    def _notify(self, event: str) -> None:
        self._alerts.notify(event)

    def _max_overdraft(self) -> float:
        return 0

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.history.append({"type": "deposit", "amount": amount})
        self._notify(f"+{amount} ETB deposited (balance: {self.balance})")

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if self.balance - amount < -self._max_overdraft():
            raise InsufficientFundsError(
                f"Cannot withdraw {amount} ETB from {self.number}: "
                f"balance {self.balance}, overdraft limit {self._max_overdraft()}"
            )
        self.balance -= amount
        self.history.append({"type": "withdraw", "amount": amount})
        self._notify(f"-{amount} ETB withdrawn (balance: {self.balance})")

    def undo_last(self) -> dict:
        if not self.history:
            raise EmptyHistoryError(f"No transactions to undo for {self.number}")
        record = self.history.pop()
        if record["type"] == "deposit":
            self.balance -= record["amount"]
            self._notify(f"undo: reversed deposit of {record['amount']} ETB (balance: {self.balance})")
        elif record["type"] == "withdraw":
            self.balance += record["amount"]
            self._notify(f"undo: reversed withdrawal of {record['amount']} ETB (balance: {self.balance})")
        return record

    def __repr__(self) -> str:
        return f"{type(self).__name__}(owner={self.owner!r}, number={self.number!r}, balance={self.balance})"


class SavingsAccount(Account, InterestBearing):
    def calculate_interest(self) -> float:
        return self.balance * BankConfig().interest_rate


class CurrentAccount(Account):
    def _max_overdraft(self) -> float:
        return BankConfig().overdraft_limit


class AccountFactory:
    _registry = {
        "savings": SavingsAccount,
        "current": CurrentAccount,
    }

    @staticmethod
    def create(kind: str, owner: str, number: str, balance: float = 0) -> Account:
        try:
            account_cls = AccountFactory._registry[kind]
        except KeyError:
            raise ValueError(f"Unknown account type: {kind}")
        return account_cls(owner, number, balance)
