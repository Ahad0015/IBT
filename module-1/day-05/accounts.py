class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount

    def statement(self):
        print(f"[Account] {self.owner} | #{self.account_number} | Balance: {self._balance:.2f} ETB")


class SavingsAccount(Account):
    def __init__(self, owner, account_number, balance=0, rate=0.05):
        super().__init__(owner, account_number, balance)
        self.rate = rate

    def add_interest(self):
        self.deposit(self._balance * self.rate)

    def statement(self):
        print(f"[Savings] {self.owner} | #{self.account_number} | Balance: {self._balance:.2f} ETB | Rate: {self.rate * 100:.1f}%")


class CurrentAccount(Account):
    def __init__(self, owner, account_number, balance=0, overdraft=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft = overdraft

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self._balance + self.overdraft:
            raise ValueError("Overdraft limit exceeded")
        self._balance -= amount

    def statement(self):
        print(f"[Current] {self.owner} | #{self.account_number} | Balance: {self._balance:.2f} ETB | Overdraft: {self.overdraft:.2f} ETB")


def main():
    accounts = [
        Account("Hanna Girma", "2001", 1500),
        SavingsAccount("Almaz Bekele", "2002", 1500, rate=0.05),
        CurrentAccount("Dawit Tesfaye", "2003", 800, overdraft=1000),
    ]

    accounts[1].add_interest()
    accounts[2].withdraw(1500)

    try:
        accounts[2].withdraw(10000)
    except ValueError as e:
        print(f"Transaction failed: {e}")

    for acc in accounts:
        acc.statement()


if __name__ == "__main__":
    main()
