SET AUTOCOMMIT = 0;

INSERT IGNORE INTO Stocks (
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

INSERT IGNORE INTO Investors (
    name
)
VALUES
('Michael Jackson'),
('Kobe Bryant'),
('OJ Simpson'),
('Barak Obama'),
('Tom Segura'),
('Christina P.');


INSERT IGNORE INTO Investments (
    InvestorID,
    date
) 
VALUES
(5,  '2024-01-01'),
(7, '2024-01-05'),
(2, '2024-02-14'),
(5, '2024-02-20'),
(2, '2024-02-20'),
(4, '2024-03-04'),
(6, '2024-03-04'),
(8, '2024-04-03'),
(1, '2024-04-14'),
(6, '2024-12-04');


INSERT IGNORE INTO Changes (
    stockID,
    priceOpen,
    priceClose,
    priceHigh,
    priceLow,
    date
)
VALUES
(1, 180.01, 190.34, 194.20, 178.23, '2024-02-20'),
(6, 123.45, 101.32, 123.45, 101.32, '2024-04-03'),
(1, 179.81, 150.23, 179.91, 145.23, '2024-02-22'),
(5, 125.98, 142.83, 146.01, 123.23, '2024-01-05'),
(4, 112.12, 118.34, 120.45, 98.23, '2024-02-14'),
(3, 345.45, 340.92, 346.56, 340.12, '2024-03-04'),
(5, 345.45, 340.92, 346.56, 340.12, '2024-01-01');


INSERT IGNORE INTO InvestedStocks (
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



SHOW TABLES;


COMMIT;