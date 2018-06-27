<?php

date_default_timezone_set('Asia/Singapore');
# Includes the autoloader for libraries installed with composer
require __DIR__ . '/vendor/autoload.php';

// gsutil cp [LOCAL_OBJECT_LOCATION] gs://[DESTINATION_BUCKET_NAME]/

// Obtain data
$data = '';
foreach($_POST as $key => $value) {
    if (is_array($value)) {
        $arrayValue = '[';
        foreach($value as $ele) {
            $arrayValue = $arrayValue.';'.$ele;
        } 
        $arrayValue = $arrayValue.']';
        $arrayValue[1] = '';
        echo "<script>console.log( 'Debug Objects: " . $arrayValue . "' );</script>";        
        $value = $arrayValue;
    }
    $data = $data.','.$value;
}

$stage = $_POST['stage'];
$bucket = 'user_input';

// Upload data to google cloud storage, under bucket ${bucket}
if (file_exists("gs://${bucket}/${stage}.csv")) {
    $content = file_get_contents("gs://${bucket}/${stage}.csv");
    $data = $content.PHP_EOL.$data;
}
file_put_contents("gs://${bucket}/${stage}.csv", $data);

?>
