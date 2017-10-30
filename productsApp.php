<?php

include ("../../session.php");
include_once ("../../service.php");


function load( $cats, $types){

dbConn();
//$productsList = dbSelect("SELECT name, long_name, id, type, price, category, color FROM default_products WHERE type in ($types) AND category IN ($cats) AND active='1' ORDER BY category ASC");
$productsList = dbSelect("SELECT * FROM default_products WHERE type in ($types) AND category IN ($cats) AND active='1' ORDER BY category ASC");

dbDisconn();

$newProducts = array();
foreach ($productsList as $product)
            {
$newProducts[$product['id']]=$product;
            }
        
returnWrapper($newProducts);
}


function save($data){
//$userId = $_SESSION['userId'];
	dbQuery(iQ(json_decode($data, false), 'default_products'));

	returnWrapper(iQ(json_decode($data, false), 'default_products'));
}

function update($data, $id){
//uQ($usrData, $tableName, $where)
	
	dbQuery(uQ(json_decode($data, false), 'default_products', 'where id = '.$id));

	returnWrapper(uQ(json_decode($data, false), 'default_products', 'where id = '.$id));
}





