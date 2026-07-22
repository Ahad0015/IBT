def split_bill(total, people, tip_rate=0.10):
    tip_amount = total * tip_rate
    total_with_tip = total + tip_amount
    per_person = total_with_tip / people
    return per_person


def main():
    bill_total = 500.00  # ETB
    num_people = 4
    friends = ["Abebe", "Birtukan", "Chala", "Desta"]
    
    tip_rate = 0.10  # 10%
    share = split_bill(bill_total, num_people, tip_rate)
    
    print("=" * 40)
    print("TeleBirr Tip Calculator")
    print("=" * 40)
    print()
    
    print(f"Total Bill: {bill_total:.2f} ETB")
    print(f"Tip Rate: {tip_rate * 100:.0f}%")
    print(f"Number of People: {num_people}")
    print(f"Per Person Share: {share:.2f} ETB (including tip)")
    print("-" * 40)
    print("Each person's share:")
    
    for friend in friends:
        print(f"  {friend}: {share:.2f} ETB")
        print()
       
    
    print("=" * 40)
    print()
    print("✅ Bill split successfully! Use TeleBirr to send your share.")

if __name__ == "__main__":
    main()