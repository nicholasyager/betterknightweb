$(document).ready( function() {

    console.log("BetterKnightWeb active");


    // Find the listed courses
    var injection = false;
    var pageType = null;
    $("table.datadisplaytable tbody").children('tr').each( function(index) {



        if ($(this).children().get(0).className == "ddtitle" && pageType == null ) {
            pageType = "student";
            console.log("Page Type: Student.");
            return;
        }

        // Do not read the header rows.
        if ($(this).children().get(0).className == "dddead") {
            console.log("Label detected "+index);
            injection = false;
            return;
        }
      
        if ($(this).children().get(0).className == "ddheader" && pageType == null)
        {
            console.log("Label detected "+index);
            injection = false;
            return;
        }
        

        console.log(index + "  " +$(this).contents().get()[0]);

        if ($(this).children().get(1).innerHTML == "CRN") {
            $(this).children().get(12).remove();
            $(this).children().get(11).remove();
            $(this).children().get(12).remove();
            $(this).children().get(5).remove();
            //$(this).children().get(10).remove();

            $(this).children().get(12).innerHTML = "Ratings";
            $(this).children().get(10).innerHTML = "Instructor";
            
            $(this).children().get(9).innerHTML = "Seats";

            console.log("Course header detected "+index);
            injection = true;

            //console.log($(this).children().get(5));
            return;
        }


        if (injection == true) {
            console.log("Injection activated.");
        $(this).children('td').each( function(index) {

            if (index == 1) {
                if (this.innerHTML == "&nbsp;") {
                    $(this).data("Time","true");
                } else {
                    $(this).data("Time","false");
                }
                $(this).addClass("crn");
            } else if (index == 2) {
                $(this).addClass("subject");
            } else if (index == 3) {
                $(this).addClass("course");
            } else if (index == 10) {
                $(this).addClass("cap");
            } else if (index == 12) {
                $(this).addClass("rem");
            } else if (index == 13) {
                $(this).addClass("instructor");
            }
        });

        if ($(this).children(".crn").data("Time") == "true") {

            $(this).children('td').each( function(index) {
                $(this).css("border-bottom","1px solid lightgray");
            });
        } else {

            $(this).children('td').each( function(index) {
                $(this).css("border-top","1px solid lightgray");
            });


        }

        var crn = $(this).children(".crn").text();
        var subject = $(this).children(".subject").text();
        var course = $(this).children(".course").text();
        var instructor = $(this).children(".instructor").text().split(" ");
        var remaining = $(this).children(".rem").text();
        var cap = $(this).children(".cap").text();

        var name;

        if (instructor[2] == "O'Donnell") {
            instructor[2] = "Donnell";
        }

        if (instructor.length <= 3) {
            if (instructor.length % 3 == 0) {
                name = instructor[1] + ", " + instructor[0];
            } else {
                name = instructor[2] + ", " + instructor[0];
            }
        } else if (instructor.length == 4) {
            name = instructor[2] + ", " + instructor[0];
        } else if (instructor.length > 4) {
            if (instructor[2] == "(P),") {
                name = instructor[1] + ", " + instructor[0];
            } else { 
                name = instructor[2] + ", " + instructor[0];
            }

        }


        $(this).children().get(12).remove();
        $(this).children().get(11).remove();
        $(this).children().get(12).remove();
        $(this).children().get(5).remove();

        

        // Rewrite some values for better visability.

        if (isNaN(parseInt(cap)) == false && isNaN(parseInt(remaining)) == false ) {
           
            // Set conditional coloring.
            var remColor = "green";
            var seats = $(this).children().get(9);
            var color = "white";
            if (parseInt(remaining) <= 0) {
                remColor = "red";
            } else if (parseInt(remaining) > 0 && parseInt(remaining) <= 3) {
                remColor = "orange";
            } else if (parseInt(remaining) > 3 && parseInt(remaining) <= parseInt(cap) * 0.5 ) {
                remColor = "yellow";
                color = "black";
            }


            $(seats).html("<div class=data>"+remaining + "/" + cap+"</div>");
            $(seats).children(".data").css( { "background-color":remColor,
                                              "color":color} );
        }

        $(this).children().get(10).innerHTML = name;

        if (isNaN(parseInt(crn)) == false ) {


            $(this).children().get(12).setAttribute("id", crn);
            $.ajax({
                    type: "GET",
                    url:"http://nicholasyager.com/data/sofis/query.php",
                    async: true,
                    dataType: "JSON",
                    data:   {
                                crn: crn,
                                course : course,
                                subject : subject,
                                instructor : name
                            },
                    success : function (data) {
                        var items = [];
                        $.each(data, function(key, value) {
                            items.push(value);
                        });
                        var remaining = parseFloat(items[2]);
                        var grade = items[3];
                        var color = "white";
                        var color2 = "white";
                        var remColor = "green";
                        var letterColor = "green";
                        
                        if (remaining == 0) { 
                            remColor = "purple";
                            remaining = "New";
                            grade = "New";
                        } else if (remaining <= 2) {
                            remColor = "red";
                        } else if (remaining > 2 && remaining <= 3) {
                            remColor = "orange";
                        } else if (remaining > 3 && remaining <= 4) {
                            remColor = "yellow";
                            color = "black";
                        } else if (remaining > 4 && remaining <= 5) {
                            remColor = "green";
                        } else if (remaining > 5) {
                            remColor = "blue";
                        }

                        if (grade == "D") {
                            letterColor = "red";
                        } else if (grade == "C") {
                            letterColor = "orange";
                        } else if (grade == "B") {
                            letterColor = "green";
                        } else if (grade == "A") {
                            letterColor = "blue";
                        } else if (grade == "New") {
                            letterColor = "purple";
                        }


                        $("#"+crn).html("<table width=100%><tr width=100%><td><span class='datalabel'>Rating:</span></td><td><div id='score-"+crn+"' class=datascore>"+remaining+"</div></td></tr>"+
                                "<tr width=100%;><td><span class='datalabel'>Avg. Grade:</span></td><td><div id='grade-"+crn+"' class=datagrade>"+grade+"</div></tr></table>");

                        $("#score-"+crn).css( { "background-color":remColor,
                                                            "color":color} )
                        $("#grade-"+crn).css( { "background-color":letterColor,
                            "color":color2} );
;

                    }
            });

        } else {

            $(this).children().get(12).innerHTML = "";

        }

        }

    });



});
