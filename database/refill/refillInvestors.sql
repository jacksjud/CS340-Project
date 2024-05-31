SET AUTOCOMMIT = 0;

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


COMMIT;