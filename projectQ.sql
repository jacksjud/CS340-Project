CREATE OR REPLACE TABLE Investors (
    investorID int unique NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) NOT NULL
);


CREATE OR REPLACE TABLE Stocks (
    stockID int unique NOT NULL AUTO_INCREMENT PRIMARY KEY,
    symbol varchar(256) NOT NULL,
    companyName varchar(256) NOT NULL
);


CREATE OR REPLACE TABLE Changes (
    changeID int unique NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    priceOpen decimal (19,2) NOT NULL,
    priceClose  decimal (19,2) NOT NULL,
    priceHigh  decimal (19,2) NOT NULL,
    priceLow  decimal (19,2) NOT NULL,
    date date NOT NULL,
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID)
);


CREATE OR REPLACE TABLE Investments (
    investID int unique NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    investorID int,
    date date NOT NULL,
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID),
    FOREIGN KEY (investorID) REFERENCES Investors(investorID)
);


CREATE OR REPLACE TABLE InvestedStocks (
    investedStockID int unique NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    investID int,
    quantity int NOT NULL,
    investment decimal(19,2) NOT NULL,
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID),
    FOREIGN KEY (investID) REFERENCES Investments(investID)
);


-- CREATE OR REPLACE TABLE Invoices (
--     InvoiceID int NOT NULL AUTO_INCREMENT,
--     CustomerID int,
--     InvoiceDate datetime,
--     TotalDue decimal(19,2),
--     TermsCodeID varchar(50),
--     PRIMARY KEY (InvoiceID),
--     FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
--     FOREIGN KEY (TermsCodeID) REFERENCES TermsCode(TermsCodeID)
-- );


-- Sample data:
-- Stocks
INSERT INTO Stocks (
    symbol,
    companyName
) 
VALUES
('AAPL', 'Apple Inc.'),
('BA', 'The Boeing Company'),
('NKE', 'NIKE, Inc.'),
('SBUX', 'Starbucks Corporation'),
('DIS', 'The Walt Disney Company'),
('S&P 500', "Standard & Poor's 500");

-- Investors
INSERT INTO Investors (
    name
) 
VALUES
('Michael Jackson'),
('Kobe Bryant'),
('OJ Simpson'),
('Barak Obama'),
('Tom Segura'),
('Christina P.');

-- Investments
INSERT INTO Investments (
    InvestorID,
    Date
) 
VALUES
(5, '2024-01-01'),
(7, '2024-01-05'),
(2, '2024-02-14'),
(5, '2024-02-20'),
(2, '2024-02-20'),
(4, '2024-03-04'),
(6, '2024-03-04'),
(8, '2024-04-03'),
(1, '2024-04-14'),
(6, '2024-12-04');

-- Changes
INSERT INTO Changes (
    stockID,
    priceOpen,
    priceClose,
    priceHigh,
    priceLow,
    Date
) 
VALUES
(1, 180.01, 190.34, 194.20, 178.23, '2024-02-20'),
(6, 123.45, 101.32, 123.45, 101.32, '2024-04-03'),
(1, 179.81, 150.23, 179.91, 145.23, '2024-02-22'),
(5, 125.98, 142.83, 146.01, 123.23, '2024-01-05'),
(4, 112.12, 118.34, 120.45, 98.23, '2024-02-14'),
(3, 345.45, 340.92, 346.56, 340.12, '2024-03-04'),
(5, 345.45, 340.92, 346.56, 340.12, '2024-01-01');

-- InvestedStocks
INSERT INTO InvestedStocks (
    stockID,
    investID,
    quantity,
    investment
) 
VALUES
(1, 1, 100, 5000.00),
(3, 1, 50, 3000.00),
(2, 2, 75, 4500.00),
(6, 3, 200, 10000.00),
(5, 4, 150, 7500.00);

-- Show all the beautiful data in it's entirety.
SHOW TABLES;
DESCRIBE Investors;
SELECT * FROM Investors;
DESCRIBE Stocks;
SELECT * FROM Stocks;
DESCRIBE Changes;
SELECT * FROM Changes;
DESCRIBE Investments;
SELECT * FROM Investments;
DESCRIBE InvestedStocks;
SELECT * FROM InvestedStocks;

-- Now delete all the beautiful data in it's entirety.
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE Investors, Stocks, Changes, Investments, InvestedStocks; 
SHOW TABLES;