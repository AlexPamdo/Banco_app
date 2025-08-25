<?php

session_start();

// Cargar Configuraciones y clasesss
require_once __DIR__ . '/app/controllers/LoginController.php';
require_once __DIR__ . '/app/controllers/MainController.php';

// Capturamso las ruta del la url
$url = $_GET['url'] ?? 'main/render';
//convertimos la url en un array separando mediante '/'
$urlParts = explode('/' ,$url);

//Guardamos la pagina actual
$page = $urlParts[0];

//guardamos el nombre del controlador ubicado en la primera parte del array
$controllerName = ucfirst($urlParts[0]) . 'Controller';
//Guardamos el metodo ubicado en la segunda parte del array
$method = $urlParts[1] ?? 'render';
//Guardamos otros parametros de la url, omitiendo los 2 primeros
$params = array_slice($urlParts, offset: 2);

// Verificamos si existe el controllador 
$controllerFile = __DIR__ . "/app/controllers/{$controllerName}.php";
if(!file_exists($controllerFile)){
    die("Controlador {$controllerName} no encontrado en {$controllerFile}");
}

//Instanciamos el controlador
$controller = new $controllerName();

//Llamamos el metodo
if(!method_exists($controller, $method)){
    die("Meotodo {$method} no encontrado");
}

call_user_func_array([$controller, $method], $params);
