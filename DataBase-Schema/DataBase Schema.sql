CREATE DATABASE IF NOT EXISTS livestock_management;
USE livestock_management;
drop table animals;
-- Table for storing livestock information
CREATE TABLE Animals (
    tag_number VARCHAR(50) PRIMARY KEY,
    type ENUM('Cattle', 'Sheep', 'Goat') NOT NULL,
    date_of_birth DATE NOT NULL,
    slaughter_age INT NOT NULL,
    vaccine_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    current_camp VARCHAR(50) NOT NULL,
    date_added_to_camp DATE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_current_camp CHECK (current_camp IN ('North Field', 'East Pasture', 'South Meadow', 'West Paddock'))
);
