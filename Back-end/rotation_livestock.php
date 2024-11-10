<?php
$servername = "localhost";
$username = "root";
$password = "MILLshe@73";
$dbname = "livestock_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}   

// Function to handle the livestock rotation
if (isset($_POST['rotateLivestock'])) {
    $tag_number = $_POST['tag_number'];
    $new_camp = $_POST['new_camp'];
    $rotation_date = $_POST['rotation_date'];
    $notes = $_POST['notes'];
    // Get current camp of the animal
    $sql = "SELECT current_camp FROM Animals WHERE tag_number = '$tag_number'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Update the current camp and add rotation date
        $row = $result->fetch_assoc();
        $current_camp = $row['current_camp'];

        // Update the camp
        $update_sql = "UPDATE Animals SET current_camp = '$new_camp', date_added_to_camp = '$rotation_date' WHERE tag_number = '$tag_number'";
        if ($conn->query($update_sql) === TRUE) {
            // Log the rotation
            $log_sql = "INSERT INTO RotationHistory (tag_number, from_camp, to_camp, rotation_date, notes) 
                        VALUES ('$tag_number', '$current_camp', '$new_camp', '$rotation_date', '$notes')";
            $conn->query($log_sql);
            
            echo "Rotation successful for animal with tag number: $tag_number";
        } else {
            echo "Error updating record: " . $conn->error;
        }
    } else {
        echo "Animal not found.";
    }
}
?>
