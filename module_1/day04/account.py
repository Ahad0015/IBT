class Account:
    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self.__balance = balance

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.__balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount

    def statement(self):
        print(f"{self.owner} | Account #{self.account_number} | Balance: {self.__balance:.2f} ETB")


def main():
    almaz = Account("Almaz Bekele", "1001", 1500)
    dawit = Account("Dawit Tesfaye", "1002", 800)

    almaz.deposit(500)
    almaz.withdraw(200)

    dawit.deposit(300)

    try:
        dawit.withdraw(5000)
    except ValueError as e:
        print(f"Transaction failed: {e}")

    try:
        almaz.deposit(-100)
    except ValueError as e:
        print(f"Transaction failed: {e}")

    almaz.statement()
    dawit.statement()


if __name__ == "__main__":
    main()
