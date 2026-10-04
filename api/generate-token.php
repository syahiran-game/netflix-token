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

$options = [
    'http' => [
        'header'  => "Content-Type: application/json\r\n" .
                     "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n" .
                     "Origin: https://token-netflix.vercel.app\r\n" .
                     "Referer: https://token-netflix.vercel.app/\r\n",
        'method'  => 'POST',
        'content' => $data,
        'timeout' => 15
    ]
];

$context = stream_context_create($options);
$result = @file_get_contents($url, false, $context);

if ($result === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal sambung ke API Netflix. Cuba lagi.']);
    exit;
}

$json = json_decode($result, true);

if (isset($json['data'][0])) {
    echo json_encode($json['data'][0]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Token tidak dijumpai dalam respons API.']);
}
?>
