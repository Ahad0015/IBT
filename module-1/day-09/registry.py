from __future__ import annotations
from bank import Account


class DuplicateAccountError(Exception):
    pass


def binary_search(items: list, target) -> int:
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        elif items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


class AccountRegistry:
    def __init__(self) -> None:
        self.by_number: dict[str, Account] = {}
        self.order: list[str] = []

    def add(self, account: Account) -> None:
        if account.number in self.by_number:
            raise DuplicateAccountError(f"Account {account.number} already registered")
        self.by_number[account.number] = account
        self.order.append(account.number)

    def find(self, number: str) -> Account | None:
        return self.by_number.get(number)

    def list_all(self) -> list[Account]:
        return [self.by_number[number] for number in self.order]

    def undo_last(self, number: str) -> dict:
        account = self.find(number)
        if account is None:
            raise KeyError(f"No account found for {number}")
        return account.undo_last()

    def top_by_balance(self, n: int = 5) -> list[Account]:
        accounts = sorted(self.by_number.values(), key=lambda a: a.balance, reverse=True)
        return accounts[:n]

    def find_by_number(self, number: str) -> Account | None:
        numbers = sorted(self.by_number)
        i = binary_search(numbers, number)
        return self.by_number[numbers[i]] if i >= 0 else None

    def total_transactions(self, number: str) -> float:
        account = self.find(number)
        if account is None:
            return 0
        return self._sum_history(account.history)

    @staticmethod
    def _sum_history(history: list[dict], index: int = 0) -> float:
        if index >= len(history):
            return 0
        return history[index]["amount"] + AccountRegistry._sum_history(history, index + 1)


if __name__ == "__main__":
    from bank import AccountFactory, SMSAlert, AuditLog

    registry = AccountRegistry()

    for kind, owner, number, balance in [
        ("savings", "Almaz", "CBE-1", 1500),
        ("current", "Bereket", "CBE-2", 200),
        ("savings", "Chaltu", "CBE-3", 4200),
        ("current", "Dawit", "CBE-4", 900),
    ]:
        acc = AccountFactory.create(kind, owner, number, balance)
        acc.subscribe(SMSAlert())
        acc.subscribe(AuditLog())
        registry.add(acc)

    print("top_by_balance(2):")
    for acc in registry.top_by_balance(2):
        print(" ", acc)

    print("\nfind_by_number('CBE-3'):", registry.find_by_number("CBE-3"))
    print("find_by_number('CBE-9'):", registry.find_by_number("CBE-9"))

    print("\ntransactions on CBE-1:")
    registry.find("CBE-1").deposit(300)
    registry.find("CBE-1").withdraw(500)
    print("total_transactions('CBE-1'):", registry.total_transactions("CBE-1"))
