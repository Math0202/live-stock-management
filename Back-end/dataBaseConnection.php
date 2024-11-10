<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "MILLshe@73";
$dbname = "livestock_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->close();
?>
