<?php
$servername = "localhost";
$username = "root";
$password = "MILLshe@73";
$dbname = "livestock_management";

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $currentCamp = $_POST['current_camp'];
    $newCamp = $_POST['new_camp'];

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Update the animals' current camp
    $sql = "UPDATE Animals SET current_camp = ? WHERE current_camp = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $newCamp, $currentCamp);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo "Rotation successful";
    } else {
        echo "No animals were updated";
    }

    $stmt->close();
    $conn->close();
}
?>
