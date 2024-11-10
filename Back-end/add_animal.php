<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "MILLshe@73";
$dbname = "livestock_management";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Check if JSON data is received
$input = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST" && $input) {
    try {
        $conn->begin_transaction();

        $tag_number = htmlspecialchars($input['tag_number']);
        $type = htmlspecialchars($input['type']);
        $date_of_birth = htmlspecialchars($input['dob']);
        $slaughter_age = htmlspecialchars($input['slaughterAge']);
        $vaccine_type = htmlspecialchars($input['vaccineType']);
        $current_camp = htmlspecialchars($input['currentCamp']); // Added current_camp

        $stmt = $conn->prepare("INSERT INTO Animals (tag_number, type, date_of_birth, slaughter_age, vaccine_type, current_camp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssiss", $tag_number, $type, $date_of_birth, $slaughter_age, $vaccine_type, $current_camp); // Added binding for current_camp
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting animal: " . $stmt->error);
        }
        
        $stmt->close();
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Animal added successfully',
            'tag_number' => $tag_number
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
    
    $conn->close();
}
?>
