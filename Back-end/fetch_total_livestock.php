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

// Query to count animals by type
$sql = "
    SELECT type, COUNT(*) as count
    FROM Animals
    GROUP BY type;
";

$result = $conn->query($sql);

$totals = [
    "Cattle" => 0,
    "Sheep" => 0,
    "Goat" => 0
];

// Process the results
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (isset($totals[$row["type"]])) {
            $totals[$row["type"]] = $row["count"];
        }
    }
}

$conn->close();
?>

<div class="card">
    <h2>Total Livestock</h2>
    <p>Cattle: <?php echo $totals["Cattle"]; ?></p>
    <p>Sheep: <?php echo $totals["Sheep"]; ?></p>
    <p>Goats: <?php echo $totals["Goat"]; ?></p>
</div>
