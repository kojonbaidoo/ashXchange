CREATE TABLE Users (
    userID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashedPassword VARCHAR(256) NOT NULL,
    walletAddress VARCHAR(42) NOT NULL
);

CREATE TABLE Securities (
    securityID SERIAL PRIMARY KEY,
    securityName VARCHAR(100) NOT NULL,
    contractAddress VARCHAR(42) NOT NULL,
    userID INTEGER REFERENCES Users(userID)
);

CREATE TABLE Transactions (
    transactionID SERIAL PRIMARY KEY,
    senderID INTEGER REFERENCES Users(userID),
    recipientID INTEGER REFERENCES Users(userID),
    securityID INTEGER REFERENCES Securities(securityID),
    transactionAmount NUMERIC(18,8) NOT NULL,
    securityPrice NUMERIC(18,8) NOT NULL,
    transactionHash VARCHAR(66) NOT NULL
);

CREATE TABLE UserHoldings (
    userID INTEGER REFERENCES Users(userID),
    securityID INTEGER REFERENCES Securities(securityID),
    PRIMARY KEY(userID, securityID)
);
