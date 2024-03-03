## budget-app
Welcome to Robert and John's budget app!

# Description
We are creating a easily navigable budget creator for users. Users will be able to keep track of expenses...

# Tech Stack
- React
- PostgreSQL
- Node.js
- [and more]
  
# To Run the Application
### First, Start the Server:
1. Ensure your local Postgres server is running
2. Make the budget-app/API your working directory
3. Include a .env in the root API directory in the following format (ensure the PORT is set to 8000 as it is the default value in the UI's API requests):
```
PORT=8000
DB_USER=""
DB_HOST="localhost"
DB_NAME="your-database-name"
DB_PASSWORD=""
DB_PORT=5432
```
4. Run `npm install` to install all dependencies
5. Run `node server.js` to start the server

### Second, Start the FrontEnd Application:
1. Ensure the server is running and on PORT 8000 
2. Make the budget-app/UI your working directory
3. Run `npm install` to install all dependencies
4. Run `npm run dev` to start the frontend application

# Additional Development Information
### To Run the Server Unit Tests (testing endpoints and functions):
1. Make the budget-app/API your working directory
2. While the server is NOT running, run `npm test`

### To initialize the tables in the Database:
1. Create the "Users" Table:
```sql
CREATE TABLE Users(
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL,
    Password CHAR(60) NOT NULL,
    Firstname VARCHAR(50),
    Lastname VARCHAR(50),
	Email VARCHAR(50),
	Phone BIGINT,
	DateCreated DATE
);
```
2. Create the "Account" Table:
```sql
CREATE TABLE Account(
	AccountID SERIAL PRIMARY KEY,
	Nickname VARCHAR(50),
	Bank VARCHAR(50),
	AccountType INT,
	UserID INT REFERENCES Users(UserID) ON DELETE CASCADE
);
```
3. Create the "Budget" Table:
```sql
CREATE TABLE Budget(
	BudgetID SERIAL PRIMARY KEY,
	BudgetYear INT,
	BudgetMonth VARCHAR (3),
	UserID INT REFERENCES Users(UserID) ON DELETE CASCADE
);
```
4. Create the "Category" Table:
```sql
CREATE TABLE Category(
	CategoryID SERIAL PRIMARY KEY,
	CategoryName VARCHAR(50),
	CategoryType VARCHAR(50),
	BudgetAmount NUMERIC(12, 2),
	Budget INT REFERENCES Budget(BudgetID) ON DELETE CASCADE
);
```
5. Create the "Expense" Table:
```sql
CREATE TABLE Expense(
	ExpenseID SERIAL PRIMARY KEY,
	AccountID INT REFERENCES Account(AccountID) ON DELETE CASCADE,
	Amount NUMERIC(12, 2),
	Currency VARCHAR(3),
	Description TEXT,
	DatePosted TIMESTAMP,
	DateTransacted TIMESTAMP,
	Category INT REFERENCES Category(CategoryID)
);
```
6. Create the "CanView" Table:
```sql
CREATE TABLE CanView(
	ViewerID INT REFERENCES Users(UserID) ON DELETE CASCADE,
	Budget INT REFERENCES Budget(BudgetID) ON DELETE CASCADE
);
```