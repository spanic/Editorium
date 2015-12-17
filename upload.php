<?php

$fn = (isset($_SERVER['HTTP_X_FILENAME']) ? $_SERVER['HTTP_X_FILENAME'] : false);

if ($fn) {

	//Вызов AJAX
	file_put_contents(
		'uploads/' . $fn,
		file_get_contents('php://input')
	);
	echo "$fn uploaded";
	exit();

}
else {
	//Обработка кнопки
	$files = $_FILES['fileselect'];

	foreach ($files['error'] as $id => $err) {
		if ($err == UPLOAD_ERR_OK) {
			$fn = $files['name'][$id];
			move_uploaded_file(
				$files['tmp_name'][$id],
				'uploads/' . $fn
			);
			echo "<p>File $fn uploaded.</p>";
		}
	}

}