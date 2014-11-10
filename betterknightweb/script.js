$(document).ready( function() {

    console.log("BetterKnightWeb active");


    // Find the listed courses
    var injection = false;
    var pageType = null;

    var $rows = $('table.datadisplaytable tbody tr');
    

    data = $rows.map(function() {
        
        if ($(this).find(':nth-child(1)').hasClass("ddheader")){
            $(this).append("<th class=ddheader>Grade</th>");

        } else if ($(this).find(':nth-child(1)').hasClass("ddtitle")){
            $(this).find(':nth-child(1)').attr('colspan',15);
        } else {
            $(this).append("<td class=dddefault></td>");
            $(this).find(":nth-child(17)").html("");
        }


        var $row = $(this);

        return {
            crn: $row.find(':nth-child(2)').text(),
            department: $row.find(':nth-child(3)').text(),
            course: $row.find(':nth-child(4)').text(),
            section: $row.find(':nth-child(5)').text(),
            capacity: parseInt($row.find(':nth-child(11)').text()),
            remaining: parseInt($row.find(':nth-child(13)').text()),
            instructor: $row.find(':nth-child(14)').text().replace(" (P)","")
        };

    }).get();

    console.log(data);

    // Remove useless columns
    $('table.datadisplaytable tbody td').remove(":nth-child(6)");
    $('table.datadisplaytable tbody th').remove(":nth-child(6)");
    $('table.datadisplaytable tbody td').remove(":nth-child(11)");
    $('table.datadisplaytable tbody td').remove(":nth-child(11)");
    $('table.datadisplaytable tbody th').remove(":nth-child(11)");
    $('table.datadisplaytable tbody th').remove(":nth-child(11)");
    $('table.datadisplaytable tbody td').remove(":nth-child(12)");
    $('table.datadisplaytable tbody th').remove(":nth-child(12)");


    $('th.ddheader:nth-child(10)').text("Seats");
    $('th.ddheader:nth-child(13)').text("Rating");


    

    $.each(data, function(index, listing) {


        if (index > 1) {
        $rows.eq(index).find(":nth-child(11)").html(listing.instructor.replace(",",",<br>"));
        }
        if ( isNaN(listing.capacity) ) {
            return;
        }

        // Parse the Instructor names
        var instructorArray = listing.instructor.split(",")[0].split(" ");
        var instructor = instructorArray[instructorArray.length - 1];
        var percentCapacity = Math.round(parseFloat(listing.remaining)/listing.capacity * 100);



            $.ajax({
                    type: "GET",
                    url:"https://www.nicholasyager.com/data/sofis/query.php",
                    async: true,
                    dataType: "JSON",
                    data:   {
                                crn: listing.crn,
                                course : listing.course,
                                subject : listing.department,
                                instructor : instructor
                            },
                    success : function (data) {
                        $rows.eq(index).find(":nth-child(10)").text(listing.remaining+"/"+listing.capacity);
                        $rows.eq(index).find(":nth-child(10)").removeClass();
                        $rows.eq(index).find(":nth-child(13)").removeClass();
                        $rows.eq(index).find(":nth-child(14)").removeClass();
                        $rows.eq(index).find(":nth-child(10)").addClass("data");
                        $rows.eq(index).find(":nth-child(13)").text(data.average)
                        $rows.eq(index).find(":nth-child(14)").text(data.expected);
                        $rows.eq(index).find(":nth-child(13)").addClass("data");
                        $rows.eq(index).find(":nth-child(14)").addClass("data");

                        if (percentCapacity > 50){
                            $rows.eq(index).find(":nth-child(10)").addClass("green");
                        } else if (percentCapacity > 25){
                            $rows.eq(index).find(":nth-child(10)").addClass("yellow");
                        } else if (percentCapacity > 1){
                            $rows.eq(index).find(":nth-child(10)").addClass("orange");
                        } else {
                            $rows.eq(index).find(":nth-child(10)").addClass("red");
                        }

                        if (data.average >= 5){
                            $rows.eq(index).find(":nth-child(13)").addClass("blue");
                        } else if (data.average >= 4){
                            $rows.eq(index).find(":nth-child(13)").addClass("green");
                        } else if (data.average >= 3){
                            $rows.eq(index).find(":nth-child(13)").addClass("yellow");
                        } else if (data.average >= 2){
                            $rows.eq(index).find(":nth-child(13)").addClass("orange");
                        } else if (data.average > 0)  {
                            $rows.eq(index).find(":nth-child(13)").addClass("red");
                        } else {
                            $rows.eq(index).find(":nth-child(13)").addClass("gray");
                        }

                        if (data.expected == "A" ){
                            $rows.eq(index).find(":nth-child(14)").addClass("blue");
                        } else if ( data.expected == "B+"|| data.expected == "A-") {
                            $rows.eq(index).find(":nth-child(14)").addClass("green");
                        } else if ( data.expected == "B" ||data.expected == "B-" ) {
                            $rows.eq(index).find(":nth-child(14)").addClass("yellow");
                        } else if (data.expected == "C" || data.expected == "C+") {
                            $rows.eq(index).find(":nth-child(14)").addClass("orange");
                        } else if (data.expected == "C-" || data.expected == "D" ) {
                            $rows.eq(index).find(":nth-child(14)").addClass("red");

                        } else {
                            $rows.eq(index).find(":nth-child(14)").addClass("gray");
                        }


                    }
            });
            
    });




});
