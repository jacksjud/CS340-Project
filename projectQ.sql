create or replace table Investors (
    investorID int unique not NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(50) not NULL
);

create or replace table Stocks (
    stockID int unique not NULL AUTO_INCREMENT PRIMARY KEY,
    symbol varchar(256) not NULL,
    companyName varchar(256) not NULL
);

create or replace table Changes (
    changeID int unique not NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    priceOpen decimal (19,2) not NULL,
    priceClose  decimal (19,2) not NULL,
    priceHigh  decimal (19,2) not NULL,
    priceLow  decimal (19,2) not NULL,
    date date not NULL,
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID)
);

create or replace table Investments (
    investID int unique not NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    investorID int,
    date date not NULL,
    FOREIGN KEY stockID REFERENCES Stocks(stockID),
    FOREIGN KEY investorID REFERENCES Investors(investorID)
);

create or replace table InvestedStocks (
    investedStockID int unique not NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    investID int,
    quantity int not NULL,
    investment decimal(19,2) not NULL
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID),
    FOREIGN KEY (investID) REFERENCES Investments(investID)
);

-- Sample data:
-- Stocks
INSERT INTO Stocks (symbol, companyName) VALUES
('AAPL', 'Apple Inc.'),
('BA', 'The Boeing Company'),
('NKE', 'NIKE, Inc.'),
('SBUX', 'Starbucks Corporation'),
('DIS', 'The Walt Disney Company'),
('S&P 500', 'Standard & Poor\'s 500');

-- Investors
INSERT INTO Investors (name) VALUES
('Michael Jackson'),
('Kobe Bryant'),
('OJ Simpson'),
('Barak Obama'),
('Tom Segura'),
('Christina P.');

-- Investments
INSERT INTO Investments (InvestorID, Date) VALUES
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
INSERT INTO Changes (stockID, priceOpen, priceClose, priceHigh, priceLow, Date) VALUES
(1, 180.01, 190.34, 194.20, 178.23, '2024-02-20'),
(6, 123.45, 101.32, 123.45, 101.32, '2024-04-03'),
(1, 179.81, 150.23, 179.91, 145.23, '2024-02-22'),
(5, 125.98, 142.83, 146.01, 123.23, '2024-01-05'),
(4, 112.12, 118.34, 120.45, 98.23, '2024-02-14'),
(3, 345.45, 340.92, 346.56, 340.12, '2024-03-04'),
(5, 345.45, 340.92, 346.56, 340.12, '2024-01-01');

-- InvestedStocks
INSERT INTO InvestedStocks (stockID, investID, quantity, investment) VALUES
(1, 1, 100, 5000.00),
(3, 1, 50, 3000.00),
(2, 2, 75, 4500.00),
(6, 3, 200, 10000.00),
(5, 4, 150, 7500.00);
