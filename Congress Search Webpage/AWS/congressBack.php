<?php
define("API_KEY", "724adf69e1af408e8333ac1f713c80f4");
define("LEGIS_API", "http://congress.api.sunlightfoundation.com/legislators?");
define("BILLS_API", "http://congress.api.sunlightfoundation.com/bills?");
define("COMM_API", "http://congress.api.sunlightfoundation.com/committees?");
//define("LEGIS_API", "http://104.198.0.197:8080/legislators?");
//define("BILLS_API", "http://104.198.0.197:8080/bills?");
//define("COMM_API", "http://104.198.0.197:8080/committees?");

header("Access-Control-Allow-Origin: *");

if (isset($_GET['catagory'])) {
    if ($_GET['catagory'] == "legislators"){
        $json_str = file_get_contents(LEGIS_API . "&apikey=" . API_KEY . "&per_page=all");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "legis_house") {
        $json_str = file_get_contents(LEGIS_API . "&apikey=" . API_KEY . "&per_page=all&chamber=house&order=last_name__asc");
        echo $json_str;

    }
    else if ($_GET['catagory'] == "legis_senate") {
        $json_str = file_get_contents(LEGIS_API . "&apikey=" . API_KEY . "&per_page=all&chamber=senate&order=last_name__asc");
        echo $json_str;

    }
    else if ($_GET['catagory'] == "legis_bills") {
        if (isset($_GET['id'])) {
            $json_str = file_get_contents(BILLS_API . "&apikey=" . API_KEY . "&sponsor_id="
                . $_GET['id'] . "&last_version.urls.pdf__exists=true&per_page=5");
            echo $json_str;
        }
    }
    else if ($_GET['catagory'] == "legis_comm") {
        if (isset($_GET['id'])) {
            $json_str = file_get_contents(COMM_API . "&apikey=" . API_KEY . "&member_ids=" . $_GET['id'] . "&per_page=5");
            echo $json_str;
        }
    }
    else if ($_GET['catagory'] == "activeBills") {
        $json_str = file_get_contents(BILLS_API . "&apikey=" . API_KEY
            . "&per_page=50&history.active=true&order=introduced_on__desc&last_version.urls.pdf__exists=true");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "newBills") {
        $json_str = file_get_contents(BILLS_API . "&apikey=" . API_KEY
            . "&per_page=50&history.active=false&order=introduced_on__desc&last_version.urls.pdf__exists=true");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "committees") {
        $json_str = file_get_contents(COMM_API . "&apikey=" . API_KEY . "&per_page=all");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "comm_house") {
        $json_str = file_get_contents(COMM_API . "&apikey=" . API_KEY . "&per_page=all&chamber=house&order=name__asc");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "comm_senate") {
        $json_str = file_get_contents(COMM_API . "&apikey=" . API_KEY . "&per_page=all&chamber=senate&order=name__asc");
        echo $json_str;
    }
    else if ($_GET['catagory'] == "comm_joint") {
        $json_str = file_get_contents(COMM_API . "&apikey=" . API_KEY . "&per_page=all&chamber=joint&order=name__asc");
        echo $json_str;
    }
}

