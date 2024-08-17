# Bank Application

Welcome to the Bank Application!

**Important Note:** This application is a simulated bank application and does not manage real money or connect to real banking systems. It is intended for educational and demonstration purposes only.

## Features

### User Authentication

- **Log in:** Access your account by entering your username and password.
  - Default Users:
    - Username: Sara, Password: 1111
    - Username: Kate, Password: 2222
- **Sign up:** Create a new account:
  1. Enter your name.
  2. Setting and confirm the password.
  3. Сhoose a country from following options:
     - UK
     - USA
     - Russia
     - Japan
     - Switzerland
     - China
The selected country will automatically set your account’s currency, time zone, and date/time format according to its conventions.


### Banking operations
- Transfers: Send money to other accounts or recive money from them.
- Request a loan: Apply for a loan.
- Close account: Delete your account if you no longer wish to use it.

### Transaction Tracking
- Transaction History: View all your transactions, including sent and received money.
- Incomes and expenses: View your incomes, outcomes, and interest earned.

### User interface
- Current Balance: Your current account balance.
- Activity Timer: A timer counts down from 2 minutes. If no actions are performed within this period, you will be automatically logged out.

## Installation and Setup

- Clone the repository
```bash
git clone https://github.com/dkaspiarovich/bank-app.git
```

- Navigate to the Project
```bash
cd bank-app
```

- Open the index.html file in your browser
  - On Windows:
  ```bash
  start index.html
  ```
  - On macOS:
  ```bash
  open index.html
  ```
  - On Linux:
  ```bash
  xdg-open index.html
  ```


