const country_list = {
  USA: ["USD", "en-US", "1"],
  UK: ["GBP", "en-GB", "0.78"],
  Russia: ["RUB", "ru-RU", "89.05"],
  Japan: ["JPY", "ja-JP", "156.12"],
  Switzerland: ["CHF", "en-CH", "0.89"],
  China: ["CNY", "zh-CN", "7.25"],
};

const account1 = {
  name: "Sara",
  pin: 1111,

  transactions: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  transactionsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-05-27T17:01:17.194Z",
    "2024-06-04T23:36:17.929Z",
    "2024-06-05T10:51:36.790Z",
  ],
  interestRate: 1.2,
  currency: "USD",
  currencyValue: "1",
  localization: "en-US",
};

const account2 = {
  name: "Kate",
  pin: 2222,

  transactions: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  transactionsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2023-05-27T17:01:17.194Z",
    "2024-04-11T23:36:17.929Z",
    "2024-04-12T10:51:36.790Z",
  ],

  interestRate: 1.5,
  currency: "GBP",
  currencyValue: "0.78",
  localization: "en-GB",
};

const accounts = [account1, account2];

/////////////////////////////////////////////
// ELEMENTS

const welcomeWindow = document.querySelector(".welcome");
const appWindow = document.querySelector(".application");
const registrationWindow = document.querySelector(".registration");
const errorWindow = document.querySelector(".error");
const messageWindow = document.querySelector(".message");
const transactions = document.querySelector(".transactions");
const transactionEmpty = document.querySelector(".transaction__empty");

// account information
const accountName = document.querySelector(".name");
const accountDate = document.querySelector(".information__welcome--date");
const accountBalance = document.querySelector(".information__balance--value");
const accountIncomes = document.querySelector(".summary__incomes--value");
const accountOutcomes = document.querySelector(".summary__outcomes--value");
const accountInterest = document.querySelector(".summary__interest--value");
const accountTimer = document.querySelector(".timer");

// inputs
const inputLoginUsername = document.querySelector(".welcome__input--user");
const inputLoginPassword = document.querySelector(".welcome__input--password");
const inputTransferTo = document.querySelector(".form__input--transfer-to");
const inputTransferAmount = document.querySelector(
  ".form__input--transfer-amount"
);
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseAccount = document.querySelector(".form__input--close-account");
const inputClosePin = document.querySelector(".form__input--close-pin");
const inputRegistrationUser = document.querySelector(
  ".registration__input--user"
);
const inputRegistrationPassword = document.querySelector(
  ".registration__input--password"
);
const inputRegistrationConfirm = document.querySelector(
  ".registration__input--confirm-password"
);

// buttons
const btnWelcomeLogin = document.querySelector(".welcome__btn--log-in");
const btnLogout = document.querySelector(".btn__logout");
const btnWelcomeSignup = document.querySelector(".welcome__btn--sign-up");
const btnRegistrationLogin = document.querySelector(
  ".registration__btn--log-in"
);
const btnRegistrationSignup = document.querySelector(
  ".registration__btn--sign-up"
);
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");

const country = document.getElementById("country");

/////////////////////////////////////////////
// APPLICATION

let currentAccount, timer;

// FUNCTIONS
const convertUsername = function (username) {
  const capitalize = (name) => name[0].toUpperCase() + name.slice(1);
  const name = username.toLowerCase();
  return capitalize(name);
};

const formatedDate = function (date, localization) {
  const calcPassedDays = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const passedDays = calcPassedDays(new Date(), date);

  if (passedDays === 0) return `Today`;
  if (passedDays === 1) return `Yesterday`;
  if (passedDays <= 7) return `${passedDays} days ago`;
  return new Intl.DateTimeFormat(localization).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const showError = function (value) {
  errorWindow.textContent = value;
  errorWindow.style.opacity = 100;
  setTimeout(() => {
    errorWindow.style.opacity = 0;
  }, 2000);
};

const showMessage = function (value) {
  messageWindow.textContent = value;
  messageWindow.style.opacity = 100;
  setTimeout(() => {
    messageWindow.style.opacity = 0;
  }, 2000);
};

const hideError = function () {
  errorWindow.style.opacity = 0;
};

const displayTransactions = function (account) {
  if (account.transactions.length === 0) {
    transactions.innerHTML = "";
    const html = `<p class="transaction__empty">Your transactions will appear here</p>`;
    transactions.insertAdjacentHTML("afterbegin", html);
  } else {
    transactions.innerHTML = "";

    account.transactions.forEach(function (transaction, i) {
      const type = transaction > 0 ? "incomes" : "outcomes";

      const formatedTransaction = Intl.NumberFormat(account.localization, {
        style: "currency",
        currency: account.currency,
      }).format(transaction);

      const date = new Date(account.transactionsDates[i]);
      const displayDate = formatedDate(date, currentAccount.localization);

      const html = `<div class="transaction__item">
            <div class=
                "transaction__date">${displayDate}</div>
            <div class=
                "transaction__value transaction__value--${type}">${formatedTransaction}
            </div>
        </div>`;
      transactions.insertAdjacentHTML("afterbegin", html);
    });
  }
};

const displaySelections = function () {
  country.innerHTML = "";

  Object.entries(country_list).forEach(([key, value]) => {
    const html = `<select id="country">
    <option currency="${value[0]}" localization="${value[1]}" currencyValue="${value[2]}">${key}</option>
  </select>`;

    country.insertAdjacentHTML("afterbegin", html);
  });
};

const displayBalance = function (account) {
  account.balance = account.transactions.reduce(
    (acc, transaction) => acc + transaction,
    0
  );

  accountBalance.textContent = Intl.NumberFormat(account.localization, {
    style: "currency",
    currency: account.currency,
  }).format(account.balance);
};

const displaySummary = function (account) {
  const incomes = account.transactions
    .filter((transaction) => transaction > 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  accountIncomes.textContent = Intl.NumberFormat(account.localization, {
    style: "currency",
    currency: account.currency,
  }).format(incomes);

  const outcomes = account.transactions
    .filter((transaction) => transaction < 0)
    .reduce((acc, transaction) => acc + transaction, 0);
  accountOutcomes.textContent = Intl.NumberFormat(account.localization, {
    style: "currency",
    currency: account.currency,
  }).format(Math.abs(outcomes));

  // interest
  const interest = account.transactions
    .filter((transaction) => transaction > 0)
    .map((incomes) => (incomes * account.interestRate) / 100)
    .reduce((acc, incomes) => acc + incomes, 0);
  accountInterest.textContent = Intl.NumberFormat(account.localization, {
    style: "currency",
    currency: account.currency,
  }).format(interest);
};

const startTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    accountTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);

      welcomeWindow.style.display = "inline-block";
      appWindow.style.display = "none";
      showMessage("You have been logged out");
    }
    time--;
  };

  let time = 120;

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const resetTimer = function () {
  clearInterval(timer);
  timer = startTimer();
};

// LOG IN WELCOME BUTTON
btnWelcomeLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // username and password check
  currentAccount = accounts.find(
    (account) => account.name === convertUsername(inputLoginUsername.value)
  );

  if (
    currentAccount &&
    currentAccount.pin &&
    currentAccount.pin === Number(inputLoginPassword.value)
  ) {
    const date = new Date();
    const output = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    accountDate.textContent = new Intl.DateTimeFormat(
      currentAccount.localization,
      output
    ).format(date);

    inputLoginUsername.value = inputLoginPassword.value = "";

    // display welcome text
    accountName.textContent = currentAccount.name;
    displayTransactions(currentAccount);

    resetTimer();
    displayTransactions(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);
    // log in
    welcomeWindow.style.display = "none";
    appWindow.style.display = "flex";

    hideError();
  } else if (
    inputLoginUsername.value === "" ||
    inputLoginPassword.value === ""
  ) {
    showError("input username and password");
  } else if (currentAccount) {
    showError("incorrect password");
  } else {
    showError("user does not exists");
  }
  inputLoginUsername.value = inputLoginPassword.value = "";
});

// SIGN UP WELCOME BUTTON
btnWelcomeSignup.addEventListener("click", function (e) {
  e.preventDefault();

  welcomeWindow.style.display = "none";
  registrationWindow.style.display = "inline-block";

  displaySelections();
  inputLoginUsername.value = inputLoginPassword.value = "";
});

// LOG IN REGISTRATION BUTTON
btnRegistrationLogin.addEventListener("click", function (e) {
  e.preventDefault();

  welcomeWindow.style.display = "inline-block";
  registrationWindow.style.display = "none";

  inputRegistrationUser.value =
    inputRegistrationPassword.value =
    inputRegistrationConfirm.value =
      "";
});

// SIGN UP REGISTRATION BUTTON
btnRegistrationSignup.addEventListener("click", function (e) {
  e.preventDefault();
  const username = convertUsername(inputRegistrationUser.value);
  const password = +inputRegistrationPassword.value;
  const confirmPassword = +inputRegistrationConfirm.value;

  const selectedCountry = country.options[country.selectedIndex];
  const selectedCurrency = selectedCountry.getAttribute("currency");
  const selectedLocalization = selectedCountry.getAttribute("localization");
  const selectedCurrencyValue = selectedCountry.getAttribute("currencyValue");
  console.log(selectedCountry);
  console.log(selectedCurrency);
  console.log(selectedLocalization);
  console.log(selectedCurrencyValue);

  let userExists;

  if (accounts.find((acc) => acc.name === username)) {
    userExists = true;
  } else {
    userExists = false;
  }

  console.log(userExists);

  if (
    Number.isFinite(password) &&
    Number.isFinite(confirmPassword) &&
    password.toString().length === 4 &&
    confirmPassword === password &&
    username != "" &&
    password != "" &&
    confirmPassword != "" &&
    userExists == false
  ) {
    const account = {
      name: username,
      pin: password,
      transactions: [],
      transactionsDates: [],
      interestRate: 1.1,
      currency: selectedCurrency,
      currencyValue: selectedCurrencyValue,
      localization: selectedLocalization,
    };

    inputRegistrationUser.value =
      inputRegistrationPassword.value =
      inputRegistrationConfirm.value =
        "";

    accounts.push(account);

    showMessage("You have successfully registered");

    console.log(accounts);
  } else if (
    username != "" &&
    password != "" &&
    confirmPassword != "" &&
    !userExists
  ) {
    if (!Number.isFinite(password)) {
      showError("Password should be a number");
      inputRegistrationPassword.value = inputRegistrationConfirm.value = "";
    } else if (password.toString().length !== 4) {
      showError("Password should contain 4 numbers");
      inputRegistrationPassword.value = inputRegistrationConfirm.value = "";
    } else if (confirmPassword === "") {
      showError("Confirm password");
    } else if (password != confirmPassword) {
      showError("Different passwords");
      inputRegistrationPassword.value = inputRegistrationConfirm.value = "";
    }
  } else if (
    username === "" ||
    password === "" ||
    (confirmPassword === "" && !userExists)
  ) {
    showError("Set username and password");
  } else if (userExists) {
    showError("User is already exists");
  }
});

// LOG OUT BUTTON
btnLogout.addEventListener("click", function (e) {
  e.preventDefault();

  clearInterval(timer);

  welcomeWindow.style.display = "inline-block";
  appWindow.style.display = "none";
});

// TRANSFER UTTON
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  resetTimer();

  const amount = Number(inputTransferAmount.value);

  let amountReceived;

  const receiver = accounts.find(
    (account) => account.name === convertUsername(inputTransferTo.value)
  );

  const converter = function (amountSent) {
    if (currentAccount.currency === receiver.currency) {
      amountSent === amountReceived;
    } else {
      amountReceived =
        (receiver.currencyValue / currentAccount.currencyValue) * amountSent;
    }
    return amountReceived;
  };

  /*console.log("reciever: ", receiver);
  console.log("current account: ", currentAccount);
  console.log("reciever currency: ", receiver.currency);
  console.log("current account currency: ", currentAccount.currency);
  console.log("reciever account currency value:", receiver.currencyValue);
  console.log("current account currency value: ", currentAccount.currencyValue); */

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiver &&
    currentAccount.name !== receiver.name
  ) {
    currentAccount.transactions.push(-amount);
    receiver.transactions.push(converter(amount));

    currentAccount.transactionsDates.push(new Date());
    receiver.transactionsDates.push(new Date());

    displayTransactions(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);
    hideError();
  } else if (inputTransferTo.value === "" || inputTransferAmount.value === "") {
    showError("input username and amount");
  } else if (receiver && currentAccount.name !== receiver.name && amount <= 0) {
    showError("incorrect amount");
  } else if (
    receiver &&
    currentAccount.name !== receiver.name &&
    currentAccount.balance < amount
  ) {
    showError("not enough balance");
  } else {
    showError("incorrect user");
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

// LOAN BUTTON
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  resetTimer();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0) {
    currentAccount.transactions.push(amount);
    currentAccount.transactionsDates.push(new Date());
    displayTransactions(currentAccount);
    displayBalance(currentAccount);
    displaySummary(currentAccount);
    hideError();
  } else {
    showError("incorrect amount");
  }

  inputLoanAmount.value = "";
});

// CLOSE BUTTON
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  resetTimer();

  const account = convertUsername(inputCloseAccount.value);
  const pin = +inputClosePin.value;

  if (currentAccount.name === account && currentAccount.pin === pin) {
    const account = accounts.findIndex(
      (acc) => acc.name === currentAccount.name
    );
    accounts.splice(account, 1);

    appWindow.style.display = "none";
    welcomeWindow.style.display = "inline-block";
    hideError();
  } else if (currentAccount.name === account) {
    setTimeout(() => {
      showError("incorrect password");
    });
  } else if (inputCloseAccount.value === "" || inputClosePin.value === "") {
    showError("input username and password");
  } else {
    showError("incorrect username");
  }

  inputCloseAccount.value = inputClosePin.value = "";
  account.push(currentAccount);
});
