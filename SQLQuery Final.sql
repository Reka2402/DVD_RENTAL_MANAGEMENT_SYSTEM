create database DVDdb

use DVDdb;


CREATE TABLE Customers (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    UserName NVARCHAR(50) NOT NULL,
    Mobilenumber NVARCHAR(15) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Nic INT NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1
);
CREATE TABLE DVDs (
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    Genre NVARCHAR(50) NOT NULL,
    Director NVARCHAR(100) NOT NULL,
    ReleaseDate DATETIME NOT NULL, 
    CopiesAvailable INT NOT NULL,
	ImagePath NVARCHAR(255) NOT NULL,
);

CREATE TABLE Rent (
    RentalId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    CustomerID UNIQUEIDENTIFIER NOT NULL,
    DVDId UNIQUEIDENTIFIER NOT NULL,
    RentalDate DATETIME NOT NULL,
    Returndate DATETIME NULL,
    Isoverdue BIT NOT NULL,
    Status NVARCHAR(50) NOT NULL
);
--Customer
INSERT INTO Customers (Id, UserName, Mobilenumber, Email, Nic, Password, IsActive)
VALUES (NEWID(), 'JohnDoe', '0789456', 'johndoe@example.com', 123456789, 'password123', 1);

INSERT INTO Customers (Id, UserName, Mobilenumber, Email, Nic, Password, IsActive)
VALUES (NEWID(), 'Anusiyan', '0778997298', 'anu@example.com', 223456789, 'anu123', 1);

INSERT INTO Customers (Id, UserName, Mobilenumber, Email, Nic, Password, IsActive)
VALUES (NEWID(), 'Raja', '0778065278', 'raja@example.com', 323456789, 'raja123', 1);

--DVDs
INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable, ImagePath)
VALUES (NEWID(), 'Movie3', 'Action', 'Christopher Nolan', '2010-07-16', 10, '/dvdimages/18016cd4-b777-4add-8f8a-c1d00c7a60b1.jpeg');

INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable, ImagePath)
VALUES (NEWID(), 'Inception', 'Sci-Fi', 'Christopher Nolan', '2010-07-16', 10, '/dvdimages/16380bdc-36f9-4833-981f-1c29879f710e.jpg');

INSERT INTO DVDs (Id, Title, Genre, Director, ReleaseDate, CopiesAvailable, ImagePath)
VALUES (NEWID(), 'movie2', 'Sci-Fi', 'Christopher Nolan', '2010-07-16', 10, '/dvdimages/d90bb1db-1b89-4e70-8637-673cf46ae2d1.png');
