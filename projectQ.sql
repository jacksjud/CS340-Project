create or replace table Investments (
    investID int not NULL AUTO_INCREMENT unique PRIMARY KEY,
    stockID int,
    investorID int,
    FOREIGN KEY stockID REFERENCES Stocks(stockID),
    FOREIGN KEY investorID REFERENCES Investors(investorID)
);

create or replace table Investors (
    investorID int AUTO_INCREMENT unique not NULL PRIMARY KEY,
    name varchar(50) not NULL
);

create or replace table InvestedStocks (
    investedStockID int not NULL AUTO_INCREMENT PRIMARY KEY,
    stockID int,
    investID int,
    quantity int not NULL,
    investment decimal(19,2) not NULL
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID),
    FOREIGN KEY (investID) REFERENCES Investments(investID)
);

create or replace table Stocks (
    stockID int AUTO_INCREMENT not NULL PRIMARY KEY,
    symbol varchar(256) not NULL,
    companyName varchar(256) not NULL
);

create or replace table Changes (
    changeID int not NULL AUTO_INCREMENT unique PRIMARY KEY,
    stockID int,
    priceOpen decimal (19,2) not NULL,
    priceClose  decimal (19,2) not NULL,
    priceHigh  decimal (19,2) not NULL,
    priceLow  decimal (19,2) not NULL,
    date date not NULL,
    FOREIGN KEY (stockID) REFERENCES Stocks(stockID)
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