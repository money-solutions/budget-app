## budget-app

Welcome to Robert and John's budget app!

# Description

We are creating a easily navigable budget creator for users. Users will be able to keep track of expenses...

# Tech Stack

-   React
-   PostgreSQL
-   Node.js
-   [and more]

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
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password CHAR(60) NOT NULL,
    Firstname VARCHAR(50),
    Lastname VARCHAR(50),
	Email VARCHAR(50),
	Phone VARCHAR(20),
	DateCreated DATE
);
```

2. Create the "Accounts" Table:

```sql
CREATE TABLE Accounts(
	AccountID SERIAL PRIMARY KEY,
	UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
	Nickname VARCHAR(50),
	Bank VARCHAR(50),
	AccountType INT
);
```

3. Create the "Budgets" Table:

```sql
CREATE TABLE Budgets(
	BudgetID SERIAL PRIMARY KEY,
	UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
	BudgetYear INT NOT NULL,
	BudgetMonth INT NOT NULL,
	CONSTRAINT unique_budget UNIQUE(UserID, BudgetYear, BudgetMonth)
);
```

4. Create the "Categories" Table:

```sql
CREATE TABLE Categories(
	CategoryID SERIAL PRIMARY KEY,
	BudgetID INT NOT NULL REFERENCES Budgets(BudgetID) ON DELETE CASCADE,
	CategoryName VARCHAR(50) NOT NULL,
	CategoryType VARCHAR(50),
	BudgetAmount NUMERIC(12, 2),
	CONSTRAINT unique_category UNIQUE(BudgetID, CategoryName)
);
```

5. Create the "Transactions" Table:

```sql
CREATE TABLE Transactions(
	TransactionID SERIAL PRIMARY KEY,
	AccountID INT NOT NULL REFERENCES Accounts(AccountID) ON DELETE CASCADE,
	Amount NUMERIC(12, 2),
	Currency VARCHAR(3),
	Description TEXT,
	DatePosted DATE,
	DateTransacted DATE,
	CategoryID INT REFERENCES Categories(CategoryID) ON DELETE SET NULL
);
```

6. Create the "CanView" Table:

```sql
CREATE TABLE CanView(
	ViewerID INT REFERENCES Users(UserID) ON DELETE CASCADE,
	BudgetID INT REFERENCES Budgets(BudgetID) ON DELETE CASCADE
);
```

7. Create the "get_user_by_username" function:

```sql
CREATE OR REPLACE FUNCTION get_user_by_username(username_param character varying)
RETURNS SETOF Users AS 
$$
BEGIN
    RETURN QUERY SELECT * FROM Users WHERE username = username_param;
END;
$$ LANGUAGE plpgsql;

```

8. Create the "create_user" stored procedure:

```sql
CREATE OR REPLACE PROCEDURE public.create_user(
	IN username_param character varying,
	IN password_param character varying,
	IN firstname_param character varying,
	IN lastname_param character varying)
LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
    INSERT INTO Users (Username, Password, Firstname, Lastname, DateCreated) 
    VALUES (username_param, password_param, firstname_param, lastname_param, CURRENT_DATE);
END;
$BODY$;
ALTER PROCEDURE public.create_user(character varying, character varying, character varying, character varying)
    OWNER TO postgres;
```

9. Create the "mail_list" view:

```sql
CREATE OR REPLACE VIEW email_list_view AS
SELECT Email
FROM Users
WHERE Email IS NOT NULL;
```