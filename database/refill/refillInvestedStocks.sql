SET AUTOCOMMIT = 0;


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


COMMIT;