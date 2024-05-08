-- These are some Database Manipulation queries for our partially implemented Project Website 
-- using the bsg database.
-- for the 14 requiered functions we need 5 SELECTs, 5 INSERTs, 1 UPDATE, 1 DELETE, 1 Dynamic drop-down/search.


---- SELECTS ----

-- get all investor IDs and names of investors to populate the Investors page.
SELECT investorID, name FROM Investors

-- get all stocks IDs, stock symbols and company names to populate Stocks page.
SELECT stockID, symbol, companyName FROM Stocks

-- get all the changes IDs, stock IDs, price metrics and date to populate the Changes page.
SELECT changeID, stockID, priceOpen, priceClose, priceHigh, priceLow, date FROM Changes

-- get all investers's data to populate a dropdown for investments made by investors.  
SELECT investID, investorID, date FROM Investments

-- get all invested stock to list on Invested Stocks page.
SELECT investedStockID, stockID, investID, quantitiy, investment FROM Investedstocks


---- INSERTS ----

-- add a new Investor
INSERT INTO Investors (
    name
)
VALUES
(
    :name_Input
)

-- add a new Investment
INSERT INTO Investments (
    investorID,
    date
)
VALUES 
(
    :investor_id_from_dropdown_Input,
    date_Input
)

-- associate an Investor with an Investment (M-to-M relationship addition)
INSERT INTO InvestedStocks (
    stockID,
    investID,
    quantitiy,
    investment
)
VALUES
(
    :stock_id_from_dropdown_Input,
    :investor_id_from_dropdown_Input,
    :quantity_Input,
    :investment_Input
)


---- UPDATES ----

-- update an Investor's data based on submission of the Update Investor form 
UPDATE Investors SET name = :name_Input WHERE id= :investor_ID_from_the_update_form

-- update an Investor's Investments based on submission of the Update Investments form 
UPDATE Investments SET inevstor_ID = :investor_id_from_dropdown_Input, date = :date_input WHERE id= :invest_ID_from_the_update_form


---- DELETES ----

-- delete an investor
DELETE FROM Investors WHERE pid = :inevstor_ID_selected_from_certificate_and_character_list AND cid = :certification_ID_selected_from-certificate_and_character_list

-- dis-associate an investment from an investor (M-to-M relationship deletion)
DELETE FROM Investments WHERE id = :invest_ID_selected_from_browse_invested_page
