<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$url = 'https://token-netflix.vercel.app/api/generate';
$data = json_encode(['count' => 1, 'stream' => false]);

// Guna cURL
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Origin: https://token-netflix.vercel.app',
    'Referer: https://token-netflix.vercel.app/'
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Kadang perlu untuk shared hosting

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL Error: ' . $curlError]);
    exit;
}

$json = json_decode($result, true);

if (isset($json['data'][0])) {
    echo json_encode($json['data'][0]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'Token tidak dijumpai',
        'http_code' => $httpCode,
        'raw_response' => $result
    ]);
}
?>
