SET AUTOCOMMIT = 0;

INSERT IGNORE INTO Stocks (
    stockID,
    symbol,
    companyName
)
VALUES
(1,'AAPL', 'Apple Inc.'),
(2, 'BA', 'The Boeing Company'),
(3, 'NKE', 'NIKE, Inc.'),
(4, 'SBUX', 'Starbucks Corporation'),
(5, 'DIS', 'The Walt Disney Company'),
(6, 'S&P 500', "Standard & Poor's 500");


COMMIT;