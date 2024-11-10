USE livestock_management;

-- To fetch the Total Livestock --
DELIMITER //
CREATE PROCEDURE GetTotalLivestock()
BEGIN
    SELECT 
        species,
        COUNT(*) AS total_count
    FROM 
        animals
    GROUP BY
        species;
END //
DELIMITER ;

--  Stored Procedure for Upcoming Grazing Camp Rotations --
DELIMITER //
CREATE PROCEDURE GetUpcomingRotations()
BEGIN
    SELECT 
        species,
        MIN(DATEDIFF(next_rotation_due, CURDATE())) AS days_until_next_rotation
    FROM 
        camp_rotations
    JOIN 
        animals ON camp_rotations.animal_id = animals.animal_id
    WHERE 
        next_rotation_due > CURDATE()
    GROUP BY 
        species;
END //
DELIMITER ;

-- Stored Procedure to Count Animals Needing Vaccination Soon --
DELIMITER //
CREATE PROCEDURE GetVaccinationsDueSoon()
BEGIN
    SELECT 
        COUNT(*) AS animals_due_for_vaccination
    FROM 
        animals
    WHERE 
        next_vaccination_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY);
END //
DELIMITER ;


-- Stored Procedure for Animals Ready for Slaughter -- 
DELIMITER //
CREATE PROCEDURE GetReadyForSlaughter()
BEGIN
    SELECT 
        species,
        COUNT(*) AS ready_for_slaughter
    FROM 
        animals
    JOIN 
        slaughter_criteria ON animals.species = slaughter_criteria.species
    WHERE 
        TIMESTAMPDIFF(MONTH, date_of_birth, CURDATE()) BETWEEN min_age_months AND max_age_months
    GROUP BY 
        species;
END //
DELIMITER ;