from __future__ import annotations
from bank import Account


class DuplicateAccountError(Exception):
    pass


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


if __name__ == "__main__":
    from bank import AccountFactory, SMSAlert, AuditLog

    registry = AccountRegistry()

    savings = AccountFactory.create("savings", "Almaz", "CBE-1", 1500)
    current = AccountFactory.create("current", "Bereket", "CBE-2", 200)

    for acc in (savings, current):
        acc.subscribe(SMSAlert())
        acc.subscribe(AuditLog())
        registry.add(acc)

    print("find('CBE-1'):", registry.find("CBE-1"))
    print("find('missing'):", registry.find("missing"))

    print("\nlist_all() in insertion order:")
    for acc in registry.list_all():
        print(" ", acc)

    print("\ntransactions:")
    savings.deposit(300)
    savings.withdraw(500)
    current.withdraw(800)

    print("\nundo_last on CBE-1:")
    undone = registry.undo_last("CBE-1")
    print("  reversed:", undone, "-> balance:", savings.balance)

    try:
        registry.add(savings)
    except DuplicateAccountError as e:
        print("\nCaught expected error:", e)