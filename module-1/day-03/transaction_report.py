TRANSACTIONS_FILE = "transactions.txt"
REPORT_FILE = "report.txt"


def read_transactions(filename):
    totals = {}
    try:
        with open(filename) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                name, amount = line.split(",")
                amount = float(amount)
                totals[name] = totals.get(name, 0) + amount
    except FileNotFoundError:
        print(f"'{filename}' not found — starting with an empty report.")
    return totals


def build_summary_lines(totals):
    sorted_totals = sorted(totals.items(), key=lambda item: item[1], reverse=True)
    lines = []
    for name, total in sorted_totals:
        lines.append(f"{name}: {total:.2f} ETB")
    return lines


def write_report(lines, filename):
    with open(filename, "w") as f:
        f.write("Transaction Summary Report\n")
        f.write("=" * 30 + "\n")
        for line in lines:
            f.write(line + "\n")


def main():
    totals = read_transactions(TRANSACTIONS_FILE)
    summary_lines = build_summary_lines(totals)

    print("Transaction Summary")
    print("=" * 30)
    for line in summary_lines:
        print(line)

    write_report(summary_lines, REPORT_FILE)
    print(f"\nReport written to {REPORT_FILE}")


if __name__ == "__main__":
    main()