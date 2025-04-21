home_price = int(input("home price: "))
try:
    years = int(input("years (default 30): "))
except:
    years = 30
try:
    down_payment = home_price * float(input("down payment (default 20%): "))
except:
    down_payment = .2 * home_price

try:
    stocks_growth = 1 + (int(input("stocks growth (default 7%, enter integer): ")) / 100)
except:
    stocks_growth = 1.07

try:
    mortgage_int = float(input("mortgage interest (default 7.25%, enter integer): ")) / 100
except:
    mortgage_int = 0.0725

principle = home_price - down_payment

n = years * 12
int_month = mortgage_int / 12
num = int_month * ((1 + int_month) ** n)
denom = (1 + int_month) ** n - 1
mortgage_payment = round(principle * (num / denom), 2)

principle_schedule = []
interest_schedule = []

for i in range(n):
    interest = round(min(750_000, principle) * int_month, 2)
    p_payment = round(min(mortgage_payment - interest, principle), 2)
    principle_schedule.append(p_payment)
    interest_schedule.append(interest)
    principle -= p_payment

principle_acc = [0]
interest_acc = [0]

for i in range(n):
    principle_acc.append(principle_acc[-1] + principle_schedule[i])
    interest_acc.append(interest_acc[-1] + interest_schedule[i])


for idx, (p, i) in enumerate(zip(principle_schedule, interest_schedule)):
    print(f"month {idx + 1} -- {p:.2f} + {i:.2f}")
