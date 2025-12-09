-- =============================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Travel Management System (TMS)
-- =============================================

-- Step 1: Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TravelManagementSystem')
BEGIN
    CREATE DATABASE TravelManagementSystem;
END
GO

USE TravelManagementSystem;
GO

-- Step 2: Drop existing tables if they exist (for clean setup)
IF OBJECT_ID('TMS_EmployeeDocumentMaster', 'U') IS NOT NULL DROP TABLE TMS_EmployeeDocumentMaster;
IF OBJECT_ID('TMS_TravelMaster', 'U') IS NOT NULL DROP TABLE TMS_TravelMaster;
IF OBJECT_ID('TMS_LoginMaster', 'U') IS NOT NULL DROP TABLE TMS_LoginMaster;
IF OBJECT_ID('TMS_EmployeeMaster', 'U') IS NOT NULL DROP TABLE TMS_EmployeeMaster;
IF OBJECT_ID('TMS_DocumentMaster', 'U') IS NOT NULL DROP TABLE TMS_DocumentMaster;
IF OBJECT_ID('TMS_RollMaster', 'U') IS NOT NULL DROP TABLE TMS_RollMaster;
GO

-- Step 3: Create Tables
CREATE TABLE TMS_RollMaster (
    RollID INT PRIMARY KEY,
    RollName VARCHAR(50) NOT NULL
);

CREATE TABLE TMS_DocumentMaster (
    DocumentID INT PRIMARY KEY,
    DocumentName VARCHAR(100) NOT NULL
);

CREATE TABLE TMS_EmployeeMaster (
    EmpId INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    RptEmpId VARCHAR(20) NULL,
    RefRoleId INT NOT NULL,
    CreatedOn DATETIME2 DEFAULT GETDATE(),
    CreatedBy VARCHAR(50),
    UpdatedOn DATETIME2 NULL,
    UpdatedBy VARCHAR(50) NULL,
    CONSTRAINT FK_Employee_Role FOREIGN KEY (RefRoleId) REFERENCES TMS_RollMaster(RollID)
);

CREATE TABLE TMS_LoginMaster (
    EmpId INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    RptEmpId VARCHAR(20) NULL,
    RefRoleId INT NOT NULL,
    CreatedOn DATETIME2 DEFAULT GETDATE(),
    CreatedBy VARCHAR(50),
    UpdatedOn DATETIME2 NULL,
    UpdatedBy VARCHAR(50) NULL,
    CONSTRAINT FK_Login_Role FOREIGN KEY (RefRoleId) REFERENCES TMS_RollMaster(RollID)
);

CREATE TABLE TMS_TravelMaster (
    TravelId INT IDENTITY(1,1) PRIMARY KEY,
    EmpId INT NOT NULL,
    Country VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Remark VARCHAR(500),
    SuggestedDate DATE,
    TravelStartDate DATE,
    TravelEndDate DATE,
    Status INT DEFAULT 1,
    RptEmpId INT
);

CREATE TABLE TMS_EmployeeDocumentMaster (
    EmpDocId INT PRIMARY KEY,
    EmpId INT NOT NULL,
    DocumentID INT NOT NULL,
    Document VARBINARY(MAX),
    CreatedOn DATETIME2 DEFAULT GETDATE(),
    CreatedBy VARCHAR(50),
    UpdatedOn DATETIME2 NULL,
    UpdatedBy VARCHAR(50) NULL,
    CONSTRAINT FK_EmpDoc_Employee FOREIGN KEY (EmpId) REFERENCES TMS_EmployeeMaster(EmpId),
    CONSTRAINT FK_EmpDoc_Document FOREIGN KEY (DocumentID) REFERENCES TMS_DocumentMaster(DocumentID)
);
GO

-- Step 4: Insert Data
INSERT INTO TMS_RollMaster VALUES (101,'Employee'),(102,'Manager'),(103,'Helpdesk'),(104,'DVP/AVP'),(105,'SVP');

INSERT INTO TMS_DocumentMaster VALUES 
(1,'Passport'),(2,'Invitation Letter'),(3,'Cover Letter'),(4,'KT plan'),
(5,'Hotel Booking'),(6,'Flight Booking'),(7,'Travel Insurance'),(8,'Visa Form'),(9,'Letter of Intent');

INSERT INTO TMS_EmployeeMaster (EmpId, Name, Email, RptEmpId, RefRoleId, CreatedOn, CreatedBy) VALUES
(108,'vikash Kumar','vikash.kumar@demo.com','828',101,'2025-11-27 12:01:42.5633333','System'),
(128,'Rahul Mehta','rahul.mehta@demo.com','600',104,'2025-11-27 11:38:18.7100000','System'),
(2,'Akash Kumar','Akash.Kumar@demo.com','1',105,'2025-11-27 11:38:18.7100000','System'),
(320,'Vikram Singh','vikram.singh@demo.com','',103,'2025-11-27 11:38:18.7100000','System'),
(436,'Priya Sharma','priya.sharma@demo.com','128',101,'2025-11-27 11:38:18.7100000','System'),
(787,'Abhishek Kumar','abhishek.kumar@demo.com','828',101,'2025-11-27 11:38:18.7100000','System'),
(828,'Sneha Patel','sneha.patel@demo.com','200',102,'2025-11-27 11:38:18.7100000','System');

INSERT INTO TMS_LoginMaster (EmpId, Name, Email, Password, RptEmpId, RefRoleId, CreatedOn, CreatedBy) VALUES
(128,'Rahul Mehta','rahul.mehta@demo.com','Rahul@123','600',104,'2025-11-27 11:39:23.3800000','System'),
(2,'Akash Kumar','akash.kumar@demo.com','Akash@123','1',105,'2025-11-27 11:39:23.3800000','System'),
(320,'Vikram Singh','vikram.singh@demo.com','Vikram@123','',103,'2025-11-27 11:39:23.3800000','System'),
(436,'Priya Sharma','priya.sharma@demo.com','Priya@123','128',101,'2025-11-27 11:39:23.3800000','System'),
(787,'Abhishek Kumar','abhishek.kumar@demo.com','Pass@123','828',101,'2025-11-27 11:39:23.3800000','System'),
(828,'Sneha Patel','sneha.patel@demo.com','Sneha@123','200',102,'2025-11-27 11:39:23.3800000','System');

INSERT INTO TMS_TravelMaster (EmpId, Country, City, Remark, SuggestedDate, TravelStartDate, TravelEndDate, Status, RptEmpId) VALUES
(104,'Germany','Frankfurt','Conference','2025-11-25','2025-12-05','2025-12-08',3,20),
(12,'Germany','Berlin','Client meeting','2025-11-28','2025-12-01','2025-12-05',1,828),
(22,'Germany','Berlin','string','2025-11-28','2025-11-28','2025-11-28',1,828),
(282,'Germany','Berlin','string','2025-11-28','2025-11-28','2025-11-28',1,828),
(320,'Germany','Hamburg','Training session','2025-11-26','2025-12-15','2025-12-18',1,200),
(436,'Germany','Munich','Project kickoff','2025-11-27','2025-12-10','2025-12-20',2,128),
(787,'Germany','Berlin','Client meeting','2025-11-28','2025-12-01','2025-12-05',2,828),
(82,'Germany','Berlin','string','2025-11-28','2025-11-28','2025-11-28',1,828);

INSERT INTO TMS_EmployeeDocumentMaster (EmpDocId, EmpId, DocumentID, Document, CreatedOn, CreatedBy) VALUES
(1,787,2,0x51554A44524556475230684A536B744D545535505546465355315256566C645957566F784D6A4D304E5459334F446B7759574A6A5A47566D5A326870616D7473625735766348467963335231646E643465586F3D,'2025-12-02 10:54:12.8233333','Abhi'),
(2,787,1,0x4142434445464748494A4B4C4D4E4F505152535455565758595A313233343536373839306162636465666768696A6B6C6D6E6F707172737475767778797A,NULL,NULL),
(3,787,3,0x4142434445464748494A4B4C4D4E4F505152535455565758595A313233343536373839306162636465666768696A6B6C6D6E6F707172737475767778797A,NULL,NULL),
(4,787,4,0x4142434445464748494A4B4C4D4E4F505152535455565758595A313233343536373839306162636465666768696A6B6C6D6E6F707172737475767778797A,NULL,NULL);
GO

-- Step 5: Verify Setup
PRINT 'Database setup completed successfully!';
PRINT '';

SELECT 'TMS_RollMaster' AS TableName, COUNT(*) AS RecordCount FROM TMS_RollMaster
UNION ALL SELECT 'TMS_DocumentMaster', COUNT(*) FROM TMS_DocumentMaster
UNION ALL SELECT 'TMS_EmployeeMaster', COUNT(*) FROM TMS_EmployeeMaster
UNION ALL SELECT 'TMS_LoginMaster', COUNT(*) FROM TMS_LoginMaster
UNION ALL SELECT 'TMS_TravelMaster', COUNT(*) FROM TMS_TravelMaster
UNION ALL SELECT 'TMS_EmployeeDocumentMaster', COUNT(*) FROM TMS_EmployeeDocumentMaster;
GO