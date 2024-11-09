CREATE DATABASE IF NOT EXISTS livestock_management;
USE livestock_management;

-- Table for storing grazing camp information
CREATE TABLE grazing_camps (
    camp_id INT AUTO_INCREMENT PRIMARY KEY,
    camp_name VARCHAR(100) NOT NULL,
    location_description TEXT,
    rotation_interval_weeks INT NOT NULL -- 3 weeks for Cattle, 4 weeks for Sheep and Goats
);

-- Table for storing livestock information
CREATE TABLE animals (
    animal_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_number VARCHAR(50) NOT NULL,
    species ENUM('Cattle', 'Sheep', 'Goat') NOT NULL,
    date_of_birth DATE NOT NULL,
    desired_slaughter_age_months INT NOT NULL,
    weight DECIMAL(10, 2) NULL,
    current_camp_id INT,
    next_vaccination_date DATE,
    expected_slaughter_date DATE,
    CONSTRAINT fk_current_camp
        FOREIGN KEY (current_camp_id)
        REFERENCES grazing_camps(camp_id)
        ON DELETE SET NULL
);


-- Table for storing vaccination information
CREATE TABLE vaccinations (
    vaccination_id INT AUTO_INCREMENT PRIMARY KEY,
    species ENUM('Cattle', 'Sheep', 'Goat') NOT NULL,
    vaccine_name VARCHAR(100) NOT NULL,
    initial_age_weeks INT NOT NULL,
    booster_interval_weeks INT, -- NULL if not applicable
    annual_booster BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table for recording animal vaccinations
CREATE TABLE animal_vaccinations (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    vaccination_id INT NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    CONSTRAINT fk_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_vaccination
        FOREIGN KEY (vaccination_id)
        REFERENCES vaccinations(vaccination_id)
        ON DELETE CASCADE
);

-- Table for tracking grazing camp rotation history
CREATE TABLE camp_rotations (
    rotation_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    from_camp_id INT,
    to_camp_id INT NOT NULL,
    rotation_date DATE NOT NULL,
    next_rotation_due DATE,
    notes TEXT,
    CONSTRAINT fk_animal_rotation
        FOREIGN KEY (animal_id)
        REFERENCES animals(animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_from_camp
        FOREIGN KEY (from_camp_id)
        REFERENCES grazing_camps(camp_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_to_camp
        FOREIGN KEY (to_camp_id)
        REFERENCES grazing_camps(camp_id)
        ON DELETE CASCADE
);

-- Table for storing species-specific slaughter age ranges
CREATE TABLE slaughter_criteria (
    species ENUM('Cattle', 'Sheep', 'Goat') PRIMARY KEY,
    min_age_months INT NOT NULL,
    max_age_months INT NOT NULL
);

-- Insert sample data for grazing camps
INSERT INTO grazing_camps (camp_name, location_description, rotation_interval_weeks)
VALUES
    ('North Field', 'Located at the northern side of the farm', 3),
    ('East Pasture', 'Pasture on the eastern side', 4),
    ('South Meadow', 'Open meadow in the south', 4),
    ('West Paddock', 'Paddock on the west side', 3);

-- Insert vaccination data based on species requirements
INSERT INTO vaccinations (species, vaccine_name, initial_age_weeks, booster_interval_weeks, annual_booster)
VALUES
    ('Cattle', 'Clostridial Vaccine', 8, 4, FALSE),
    ('Cattle', 'Bovine Respiratory Disease Complex', 12, NULL, FALSE),
    ('Cattle', 'Leptospirosis', 24, NULL, TRUE),
    ('Goat', 'CD-T', 8, 4, FALSE),
    ('Goat', 'Caseous Lymphadenitis (CL)', 12, NULL, TRUE),
    ('Goat', 'Rabies', 12, NULL, TRUE),
    ('Sheep', 'CD-T', 8, 4, FALSE),
    ('Sheep', 'Campylobacter (Vibriosis)', NULL, NULL, TRUE),
    ('Sheep', 'Chlamydia (Enzootic Abortion)', NULL, NULL, TRUE);

-- Insert slaughter criteria data based on age ranges
INSERT INTO slaughter_criteria (species, min_age_months, max_age_months)
VALUES
    ('Cattle', 14, 18),
    ('Sheep', 6, 8),
    ('Goat', 8, 10);
