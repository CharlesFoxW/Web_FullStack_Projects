
var app = angular.module('MyApp', ['ui.bootstrap', 'ngResource', 'angularUtils.directives.dirPagination']);

if (localStorage.getItem("favLegisCount") === null)
    localStorage.setItem("favLegisCount", 0);
if (localStorage.getItem("favBillCount") === null)
    localStorage.setItem("favBillCount", 0);
if (localStorage.getItem("favCommCount") === null)
    localStorage.setItem("favCommCount", 0);

app.controller('control_legis', function ($scope, $http) {

    $scope.catagory = "legislators";

    $http({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        method: "GET",
        params: {catagory: $scope.catagory}
    }).success(function(data, status, headers, config) {
        if (data.count == 0) {
            alert("no data!");
        }
        else
            $scope.legislators = data.results;

    }).error(function(data, status, headers, config) {

    });

    $scope.numPerPage = 10;
    $scope.currentPage = 1;


    $scope.displayDetailsLegis = function (json_obj) {
        displayLegisD(json_obj, "legisCarousel", "detailsCard", "legisCommTable", "billsCommTable", "legisFavButton");
    };

});


app.controller('control_bills', function ($scope, $http) {
    $scope.catagory = "activeBills";
    $scope.activeBills = "";
    $scope.newBills = "";

    $http({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        method: "GET",
        params: {catagory: $scope.catagory}
    }).success(function(data, status, headers, config) {

        if (data.count == 0) {
            alert("no data!");
        }
        else
            $scope.activeBills = data.results;

    }).error(function(data, status, headers, config) {

    });

    $scope.catagory = "newBills";

    $http({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        method: "GET",
        params: {catagory: $scope.catagory}
    }).success(function(data, status, headers, config) {

        if (data.count == 0) {
            alert("no data!");
        }
        else
            $scope.newBills = data.results;

    }).error(function(data, status, headers, config) {

    });

    $scope.numPerPage = 5;
    $scope.currentPage = 1;

    $scope.displayDetailsBills = function(json_obj) {
        displayBillD(json_obj, "billsCarousel", "detailsCardBills", "billFavButton");
    };

});


app.controller('control_comm', function ($scope, $http) {
    $scope.catagory = "committees";
    $scope.committees = "";

    $http({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        method: "GET",
        params: {catagory: $scope.catagory}
    }).success(function(data, status, headers, config) {

        if (data.count == 0) {
            alert("no data!");
        }
        else {
            $scope.committees = data.results;
        }

    }).error(function(data, status, headers, config) {

    });

    $scope.numPerPage = 10;
    $scope.currentPage = 1;

    $scope.checkFavComm = function (json_obj) {
        var currCount = localStorage.getItem("favCommCount");
        for (var i = 0; i < Number(currCount); i++) {
            console.log(localStorage.getItem("favComm[" + i + "]"));
            if (localStorage.getItem("favComm[" + i + "]") == JSON.stringify(json_obj)) {
                return true;
            }
        }
        return false;
    };

    $scope.toggleFavCommCall = function (json_obj, event, index, tab) {
        toggleFavComm(json_obj, event.target, index, tab);
    };


});


function toggleFavLegis(json_obj, fav_button) {
    var currCount = localStorage.getItem("favLegisCount");
    var currIndex = -1;
    for (var i = 0; i < Number(currCount); i++) {
        if (localStorage.getItem("favLegis[" + i + "]") == JSON.stringify(json_obj)) {
            currIndex = i;
        }
    }
    if (currIndex < 0) {
        localStorage.setItem("favLegis[" + currCount + "]", JSON.stringify(json_obj));
        localStorage.setItem("favLegisCount", Number(currCount) + 1);
        if (fav_button != "")
            document.getElementById(fav_button).innerHTML = "<i class='fa fa-star yellowIconColor' aria-hidden='true'></i>";
    }
    else {
        for (var j = currIndex; j < Number(currCount) - 1; j++)
            localStorage.setItem("favLegis[" + j + "]", localStorage.getItem("favLegis[" + (j+1) + "]"));
        localStorage.removeItem("favLegis[" + (Number(currCount)-1) + "]");
        localStorage.setItem("favLegisCount", Number(currCount) - 1);
        if (fav_button != "")
            document.getElementById(fav_button).innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";
    }
    if (fav_button == "") { // called from favorites.
        displayFavInfo();
        document.getElementById("legisFavButton").innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";
    }

}


function toggleFavBill(json_obj, fav_button) {
    var currCount = localStorage.getItem("favBillCount");
    var currIndex = -1;
    for (var i = 0; i < Number(currCount); i++) {
        if (localStorage.getItem("favBill[" + i + "]") == JSON.stringify(json_obj)) {
            currIndex = i;
        }
    }
    if (currIndex < 0) {
        localStorage.setItem("favBill[" + currCount + "]", JSON.stringify(json_obj));
        localStorage.setItem("favBillCount", Number(currCount) + 1);
        if (fav_button != "")
            document.getElementById(fav_button).innerHTML = "<i class='fa fa-star yellowIconColor' aria-hidden='true'></i>";
    }
    else {
        for (var j = currIndex; j < Number(currCount) - 1; j++)
            localStorage.setItem("favBill[" + j + "]", localStorage.getItem("favBill[" + (j+1) + "]"));
        localStorage.removeItem("favBill[" + (Number(currCount)-1) + "]");
        localStorage.setItem("favBillCount", Number(currCount) - 1);
        if (fav_button != "")
            document.getElementById(fav_button).innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";
    }
    if (fav_button == "") { // called from favorites.
        displayFavInfo();
        document.getElementById("billFavButton").innerHTML = "<i class='fa fa-star-o' aria-hidden='true'></i>";
    }
}

function toggleFavComm(json_obj, element, index, tab) {
    var currCount = localStorage.getItem("favCommCount");
    var currIndex = -1;
    var the_id = "";
    for (var i = 0; i < Number(currCount); i++) {
        if (localStorage.getItem("favComm[" + i + "]") == JSON.stringify(json_obj)) {
            currIndex = i;
        }
    }
    if (currIndex < 0) {
        localStorage.setItem("favComm[" + currCount + "]", JSON.stringify(json_obj));
        localStorage.setItem("favCommIndex[" + currCount + "]", "" + tab + index);
        localStorage.setItem("favCommCount", Number(currCount) + 1);
        if (element != "") {
            element.className = "fa fa-star yellowIconColor";
        }

    }
    else {
        the_id = localStorage.getItem("favCommIndex[" + currIndex + "]");
        for (var j = currIndex; j < Number(currCount) - 1; j++) {
            localStorage.setItem("favComm[" + j + "]", localStorage.getItem("favComm[" + (j + 1) + "]"));
            localStorage.setItem("favCommIndex[" + j + "]", localStorage.getItem("favCommIndex[" + (j + 1) + "]"));
        }
        localStorage.removeItem("favComm[" + (Number(currCount)-1) + "]");
        localStorage.removeItem("favCommIndex[" + (Number(currCount)-1) + "]");
        localStorage.setItem("favCommCount", Number(currCount) - 1);
        if (element != "") {
            element.className = "fa fa-star-o";
        }
    }
    if (element == "" && the_id != "") {
        document.getElementById(the_id).className = "fa fa-star-o";
        displayFavInfo();
    }

}

function displayLegisD(json_obj, carousel, details_card, comm_table, bills_table, fav_button) {

    var htmlText = "";
    htmlText += "<div id='detailsArea'><div id='detailsHeader'>" +
        "<button type='button' id='backButton' data-target='#" + carousel + "' data-slide-to='0'>" +
        "<i class='fa fa-chevron-left' aria-hidden='true'></i></button><span>&nbsp Details</span>" +
        "<button type='button' id='" + fav_button + "' style='float: right; margin-right: 20px; margin-top: 10px' " +
        "onclick='toggleFavLegis(" + JSON.stringify(json_obj) + ", \"" + fav_button + "\");'>";
    var currCount = localStorage.getItem("favLegisCount");
    var isFav = false;
    for (var i = 0; i < Number(currCount); i++) {
        if (localStorage.getItem("favLegis[" + i + "]") == JSON.stringify(json_obj)) {
            isFav = true;
        }
        console.log(localStorage.getItem("favLegis[" + i + "]"));
    }

    if (isFav)
        htmlText += "<i class='fa fa-star yellowIconColor' aria-hidden='true'></i></button></div><div style='height: 1px; background: #ddd;'></div>";
    else
        htmlText += "<i class='fa fa-star-o' aria-hidden='true'></i></button></div><div style='height: 1px; background: #ddd;'></div>";

    htmlText += "<div class='table-responsive'><div class='col-lg-6'><div class='col-lg-3 col-sm-3'><div id='legisDImg'>" +
        "<img src='https://theunitedstates.io/images/congress/original/"
        + json_obj.bioguide_id +
        ".jpg' width='175px' height='225px' style='display: block; margin-left: auto; margin-right: auto; padding-top: 5px; padding-bottom: 5px;'></td></tr>" +
        "</div></div><div id='legisDFirstTable' class='col-lg-3 col-sm-3' style='padding-top: 5px;'><table class='table'>" +
        "<tr><td>" + json_obj.title + ". " + json_obj.last_name + ", " + json_obj.first_name + "</td></tr>";
    if (json_obj.oc_email != null)
        htmlText += "<tr><td><a href='mailto:" + json_obj.oc_email + "'>" + json_obj.oc_email + "</a></td></tr>";
    else
        htmlText += "<tr><td>N.A.</td></tr>";
    if (json_obj.chamber == 'house')
        htmlText += "<tr><td>Chamber: House</td></tr>";
    else if (json_obj.chamber == 'senate')
        htmlText += "<tr><td>Chamber: Senate</td></tr>";

    htmlText += "<tr><td>Contact: <a href='#'>" + json_obj.phone + "</a></td></tr>";
    if (json_obj.party == 'R')
        htmlText += "<tr><td><img src='images/R.png' width='20px' height='20px'>&nbsp Republican</td></tr>";
    else if (json_obj.party == 'D')
        htmlText += "<tr><td><img src='images/D.png' width='20px' height='20px'>&nbsp Democrat</td></tr>";



    htmlText += "</table></div><table class='table'><tr><th width='30%'>Start Term</th><td>";
    // Moment JS:
    var endMoment = moment(json_obj.term_end);
    var startMoment = moment(json_obj.term_start);
    var nowMoment = moment();

    htmlText += startMoment.format("MMM DD, YYYY");
    htmlText += "</td></tr>";
    htmlText += "<tr><th>End Term</th><td>" + endMoment.format("MMM DD, YYYY") + "</td></tr>";

    var totalDuration = endMoment.diff(startMoment);
    var passedDuration = nowMoment.diff(startMoment);
    var passedPercent = 0;
    if (totalDuration > 0 && passedDuration > 0)
        passedPercent = Math.floor((passedDuration/totalDuration) * 100);

    htmlText += "<tr><th>Term</th><td><div class='progress'>" +
        "<div class='progress-bar progress-bar-success' role='progressbar' " +
        "aria-valuenow='" + passedPercent +"'aria-valuemin='0' aria-valuemax='100' style='width:" + passedPercent + "%'> " +
        passedPercent + "% </div></div></td></tr>";

    htmlText += "<tr><th>Office</th><td>" + json_obj.office + "</td></tr>";
    htmlText += "<tr><th>State</th><td>" + json_obj.state_name + "</td></tr>";
    if (json_obj.fax != null)
        htmlText += "<tr><th>Fax</th><td><a href='#'>" + json_obj.fax + "</a></td></tr>";
    else
        htmlText += "<tr><th>Fax</th><td>N.A.</td></tr>";

    htmlText += "<tr><th>Birthday</th><td>" + moment(json_obj.birthday).format("MMM DD, YYYY") + "</td></tr>";
    htmlText += "<tr><th>Social Links</th><td>";
    if (json_obj.twitter_id != null)
        htmlText += "<a href='http://twitter.com/" + json_obj.twitter_id + "'><img src='images/t.png' width='30px' height='30px'></a>&nbsp &nbsp";
    if (json_obj.facebook_id != null)
        htmlText += "<a href='http://www.facebook.com/" + json_obj.facebook_id + "'><img src='images/f.png' width='30px' height='30px'></a>&nbsp &nbsp";
    if (json_obj.website != null)
        htmlText += "<a href='" + json_obj.website + "'><img src='images/w.png' width='30px' height='30px'></a>";
    htmlText += "</td></tr></table></div>";


    htmlText += "<div class='col-lg-6'>" +
        "<table class='table' id='" + comm_table + "'>" +
        "<captain style='font-size: 120%; font-weight: bold;'>Committees</captain>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "</table>";

    htmlText += "<table class='table' id='" + bills_table + "'>" +
        "<captain style='font-size: 120%; font-weight: bold;'>Bills</captain>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "<tr><td></td></tr>" +
        "</table></div></div>";



    htmlText += "</div>"; //detailsArea
    document.getElementById(details_card).innerHTML = htmlText;

    $.ajax({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        type: "get", //send it through get method
        data:{catagory: 'legis_comm', id: json_obj.bioguide_id},
        success: function(response) {
            var responseObj = JSON.parse(response);
            if (responseObj.count == 0) {
                document.getElementById(comm_table).innerHTML = "<tr><td>N.A.</td></tr>";
            }
            else{
                var commList = responseObj.results;
                var replaceTableText = "";
                var length = 0;
                if (responseObj.count >= 5)
                    length = 5;
                else
                    length = responseObj.count;
                replaceTableText += "<tr><th>Chamber</th><th>Committee ID</th><th class='hidden-xs'>Name</th></tr>";
                for(var i = 0; i < length; i++) {
                    if (commList[i].chamber == "house")
                        replaceTableText += "<tr><td>House</td>";
                    else if (commList[i].chamber == "senate")
                        replaceTableText += "<tr><td>Senate</td>";
                    replaceTableText += "<td>" + commList[i].committee_id.toUpperCase() + "</td>";
                    replaceTableText += "<td class='hidden-xs'>" + commList[i].name + "</td></tr>";
                }
                document.getElementById(comm_table).innerHTML = replaceTableText;
            }
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

    $.ajax({
        url: "http://clsfox.us-west-2.elasticbeanstalk.com/index.php",
        type: "get", //send it through get method
        data:{catagory: 'legis_bills', id: json_obj.bioguide_id},
        success: function(response) {
            var responseObj = JSON.parse(response);
            if (responseObj.count == 0) {
                document.getElementById(bills_table).innerHTML = "<tr><td>N.A.</td></tr>";
            }
            else{
                var billsList = responseObj.results;
                var replaceTableText = "";
                var length = 0;
                if (responseObj.count >= 5)
                    length = 5;
                else
                    length = responseObj.count;
                replaceTableText += "<tr><th>Bill ID</th><th class='hidden-xs'>Title</th><th class='hidden-xs'>Chamber</th><th class='hidden-xs'>Bill Type</th><th class='hidden-xs'>Congress</th><th>Link</th></tr>";
                for(var i = 0; i < length; i++) {
                    replaceTableText += "<tr><td>" + billsList[i].bill_id.toUpperCase() + "</td>";
                    replaceTableText += "<td class='hidden-xs'>" + billsList[i].official_title + "</td>";
                    replaceTableText += "<td class='hidden-xs'>" + billsList[i].chamber + "</td>";
                    replaceTableText += "<td class='hidden-xs'>" + billsList[i].bill_type + "</td>";
                    replaceTableText += "<td class='hidden-xs'>" + billsList[i].congress + "</td>";
                    replaceTableText += "<td><a href='" + billsList[i].last_version.urls.pdf + "' target='_blank'>Link</a></td></tr>";
                }
                document.getElementById(bills_table).innerHTML = replaceTableText;
            }
        },
        error: function(xhr) {
            //Do Something to handle error
        }
    });

}

function displayBillD(json_obj, carousel, details_card, fav_button) {
    var htmlText = "";
    htmlText += "<div id='detailsAreaBill'><div id='detailsHeaderBill'>" +
        "<button type='button' id='backButtonBill' data-target='#" + carousel + "' data-slide-to='0'>" +
        "<i class='fa fa-chevron-left' aria-hidden='true'></i></button><span>&nbsp Details</span>" +
        "<button type='button' id='" + fav_button + "' style='float: right; margin-right: 20px; margin-top: 10px' " +
        "onclick='toggleFavBill(" + JSON.stringify(json_obj) + ", \"" + fav_button + "\");'>";
    var currCount = localStorage.getItem("favBillCount");
    var isFav = false;
    for (var i = 0; i < Number(currCount); i++) {
        if (localStorage.getItem("favBill[" + i + "]") == JSON.stringify(json_obj)) {
            isFav = true;
        }
        console.log(localStorage.getItem("favBill[" + i + "]"));
    }

    if (isFav)
        htmlText += "<i class='fa fa-star yellowIconColor' aria-hidden='true'></i></button></div><div style='height: 1px; background: #ddd;'></div>";
    else
        htmlText += "<i class='fa fa-star-o' aria-hidden='true'></i></button></div><div style='height: 1px; background: #ddd;'></div>";

    htmlText += "<div class='col-lg-6'><div class='table-responsive'><table class='table'> ";

    htmlText += "<tr><th>Bill ID</th><td>" + json_obj.bill_id.toUpperCase() + "</td></tr>";
    htmlText += "<tr class='hidden-xs'><th>Title</th><td>" + json_obj.official_title + "</td></tr>";
    htmlText += "<tr><th>Bill Type</th><td>" + json_obj.bill_type.toUpperCase() + "</td></tr>";
    htmlText += "<tr><th>Sponsor</th><td>" + json_obj.sponsor.title + ". "
        + json_obj.sponsor.last_name + ", " + json_obj.sponsor.first_name + "</td></tr>";
    if (json_obj.chamber == "house")
        htmlText += "<tr><th>Chamber</th><td>House</td></tr>";
    else if (json_obj.chamber == "senate")
        htmlText += "<tr><th>Chamber</th><td>Senate</td></tr>";
    if (json_obj.history.active == 'true')
        htmlText += "<tr><th>Status</th><td>Active</td></tr>";
    else
        htmlText += "<tr><th>Status</th><td>New</td></tr>";
    htmlText += "<tr><th>Introduced On</th><td>" + moment(json_obj.introduced_on).format("MMM DD, YYYY") + "</td></tr>";
    htmlText += "<tr><th>Congress URL</th><td><a href='" + json_obj.urls.congress + "' target='_blank'>URL</a></td></tr>";
    htmlText += "<tr><th>Version Status</th><td>" + json_obj.last_version.version_name + "</td></tr>";
    htmlText += "<tr><th>Bill URL</th><td><a href='" + json_obj.last_version.urls.pdf + "' target='_blank'>Link</a></td></tr>";
    htmlText += "</table></div></div>";

    htmlText += "<div class='col-lg-6 hidden-xs'>" +
        "<object width='100%' height='600px' data='" + json_obj.last_version.urls.pdf + "' type='application/pdf'>" +
        "<p>This Browser does not support pdfs.</p></object>" +
        "</div></div>";

    document.getElementById(details_card).innerHTML = htmlText;
}


function displayFavInfo() {
    var htmlText = "";
    var currCountLegis = localStorage.getItem("favLegisCount");
    var currCountBill = localStorage.getItem("favBillCount");
    var currCountComm = localStorage.getItem("favCommCount");

    htmlText += "<div class='container-fluid'><div class='tableArea'><div class='tableHead'>" +
        "<span id='tableHeadFText1'>Favorite Legislators</span></div>" +
        "<div class='alt-table-responsive'><table class='table'><thead><tr><th></th><th>Image</th><th>Party</th><th>Name</th>" +
        "<th>Chamber</th><th>State</th><th>Email</th><th></th></tr></thead><tbody> ";
    for(var i = 0; i < currCountLegis; i++) {
        var member_str = localStorage.getItem("favLegis[" + i + "]");
        var member = JSON.parse(member_str);
        htmlText += "<tr><td><button class='fa fa-trash' aria-hidden='true' style='width: 30px; height: 30px; text-align: center;' " +
            "onclick='toggleFavLegis(" + member_str + ", \"\");'></button></td><td>" +
            "<img src='https://theunitedstates.io/images/congress/original/" + member.bioguide_id + ".jpg' " +
            "style='width: 25px; height: 30px;'></td><td><img src='images/" + member.party + ".png' " +
            "style='width: 20px; height: 20px;'></td><td>" + member.last_name + ", " + member.first_name + "</td>";
        if (member.chamber == "senate") {
            htmlText += "<td><img src='images/s.svg' style='width: 20px; height: 20px;'>&nbsp Senate</td>";
        }
        else if (member.chamber == "house") {
            htmlText += "<td><img src='images/h.png' style='width: 20px; height: 20px;'>&nbsp House</td>";
        }

        htmlText += "<td>" + member.state_name + "</td>";
        if (member.oc_email != "")
            htmlText += "<td><a href='mailto:" + member.oc_email + "'>" + member.oc_email + "</a></td>";
        else
            htmlText += "<td>N.A.</td>";
        htmlText += "<td><button type='button' class='btn btn-primary' style='float: right; margin-right: 20px;' " +
            "data-target='#favCarousel' data-slide-to='1' onclick='displayLegisD(" + member_str +
            ", \"favCarousel\", \"detailsCardFav\", \"favLegisCommTable\", \"favLegisBillsTable\", \"favlegisFavButton\");'>" +
            "View Details</button></td></tr>";

    }
    htmlText += "</tbody></table></div></div></div>";
    document.getElementById("favLegislators").innerHTML = htmlText;
    htmlText = "";

    htmlText += "<div class='container-fluid'><div class='tableArea'><div class='tableHead'>" +
        "<span id='tableHeadFText2'>Favorite Bills</span></div>" +
        "<div class='alt-table-responsive'><table class='table'><thead><tr><th></th>" +
        "<th>Bill ID</th><th>Bill Type</th><th width='25%'>Title</th>" +
        "<th>Chamber</th><th>Introduced On</th><th>Sponsor</th><th></th></tr></thead><tbody> ";
    for(i = 0; i < currCountBill; i++) {
        member_str = localStorage.getItem("favBill[" + i + "]");
        member = JSON.parse(member_str);
        htmlText += "<tr><td><button class='fa fa-trash' aria-hidden='true' style='width: 30px; height: 30px; text-align: center;' " +
            "onclick='toggleFavBill(" + member_str + ", \"\");'></button></td><td>" + member.bill_id.toUpperCase() + "</td><td>"
            + member.bill_type.toUpperCase() + "</td><td>" + member.official_title + "</td>";
        if (member.chamber == "senate") {
            htmlText += "<td><img src='images/s.svg' style='width: 20px; height: 20px;'>&nbsp Senate</td>";
        }
        else if (member.chamber == "house") {
            htmlText += "<td><img src='images/h.png' style='width: 20px; height: 20px;'>&nbsp Senate</td>";
        }

        htmlText += "<td>" + member.introduced_on + "</td><td>" + member.sponsor.title + ". "
            + member.sponsor.last_name + ", " + member.sponsor.first_name + "</td><td>" +
            "<button type='button' class='btn btn-primary' style='float: right; margin-right: 20px;' " +
            "data-target='#favCarousel' data-slide-to='1' onclick='displayBillD(" + member_str +
            ", \"favCarousel\", \"detailsCardFav\", \"favBillFavButton\");'>" +
            "View Details</button></td></tr>";

    }
    htmlText += "</tbody></table></div></div></div>";
    document.getElementById("favBills").innerHTML = htmlText;
    htmlText = "";

    htmlText += "<div class='container-fluid'><div class='tableArea'><div class='tableHead'>" +
        "<span id='tableHeadFText3'>Favorite Committeess</span></div>" +
        "<div class='alt-table-responsive'><table class='table'><thead><tr><th></th><th>Chamber</th><th>Committee ID</th><th>Name</th>" +
        "<th>Parent Committee</th><th>Sub Committee</th></tr></thead><tbody> ";
    for(i = 0; i < currCountComm; i++) {
        member_str = localStorage.getItem("favComm[" + i + "]");
        member = JSON.parse(member_str);
        htmlText += "<tr><td><button class='fa fa-trash' aria-hidden='true' style='width: 30px; height: 30px; text-align: center;' " +
            "onclick='toggleFavComm(" + member_str + ", \"\", \"\", \"\");'></button></td>";
        if (member.chamber == "senate") {
            htmlText += "<td><img src='images/s.svg' style='width: 20px; height: 20px;'>&nbsp Senate</td>";
        }
        else if (member.chamber == "house") {
            htmlText += "<td><img src='images/h.png' style='width: 20px; height: 20px;'>&nbsp Senate</td>";
        }
        htmlText += "<td>" + member.committee_id + "</td><td>" + member.name + "</td><td>" + member.parent_committee_id
            +"</td><td>" + member. subcommittee +"</td></tr>";

    }
    htmlText += "</tbody></table></div></div></div>";
    document.getElementById("favCommittees").innerHTML = htmlText;


}













