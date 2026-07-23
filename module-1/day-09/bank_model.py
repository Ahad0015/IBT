from __future__ import annotations
from collections import deque
from bank import AccountFactory


class Branch:
    def __init__(self, name: str):
        self.name = name
        self.children: list[Branch] = []
        self.accounts: list = []

    def add_child(self, branch: "Branch") -> None:
        self.children.append(branch)

    def add_account(self, account) -> None:
        self.accounts.append(account)

    def total_balance(self) -> float:
        total = sum(a.balance for a in self.accounts)
        for child in self.children:
            total += child.total_balance()
        return total

    def __repr__(self) -> str:
        return f"Branch({self.name!r})"


def bfs(graph: dict[str, list[str]], start: str) -> set[str]:
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for neighbor in graph[node]:
            if neighbor not in seen:
                seen.add(neighbor)
                q.append(neighbor)
    return seen


if __name__ == "__main__":
    head_office = Branch("Head Office")
    bole = Branch("Bole")
    piassa = Branch("Piassa")
    head_office.add_child(bole)
    head_office.add_child(piassa)

    cbe1 = AccountFactory.create("savings", "Almaz", "CBE-1", 1500)
    cbe2 = AccountFactory.create("current", "Bereket", "CBE-2", 200)
    cbe3 = AccountFactory.create("savings", "Chaltu", "CBE-3", 4200)
    cbe4 = AccountFactory.create("current", "Dawit", "CBE-4", 900)

    bole.add_account(cbe1)
    bole.add_account(cbe2)
    piassa.add_account(cbe3)
    piassa.add_account(cbe4)

    print("Bole total:", bole.total_balance())
    print("Piassa total:", piassa.total_balance())
    print("Bank total (Head Office):", head_office.total_balance())

    transfers = {
        "CBE-1": ["CBE-2", "CBE-3"],
        "CBE-2": ["CBE-4"],
        "CBE-3": ["CBE-4"],
        "CBE-4": [],
    }

    reachable = bfs(transfers, "CBE-1")
    print("\nAccounts CBE-1 can reach:", reachable)
