/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7
Version: 2.1.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v2.1/admin/html/
*/

var handleCalendarDemo = function() {

    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    currentMonth = (currentMonth < 10) ? '0' + currentMonth : currentMonth;
    
    var calender = $('#calendar').fullCalendar({
        header: {
            left: 'month,agendaWeek,agendaDay',
            center: 'title',
            right: 'prev,today,next '
        },
        droppable: false, // this allows things to be dropped onto the calendar
        drop: function() {
            $(this).remove();
        },
        selectable: false,
        selectHelper: false,
        height:400,
        editable: false,
        eventLimit: false,
        events: function(start, end, timezone, callback) {
            jQuery.ajax({
                url: '/events',
                type: 'GET',
                dataType: 'json',
                success: function(doc) {
                    var jsonevents =    JSON.parse(JSON.stringify(doc));
                    var events = [];
                    $.map( jsonevents, function( r ) {
                        if(r.start != null){
                            events.push({
                                title: "Tasks : "+r.title,
                                start: r.start
                            });
                        }
                    });
                    events.push({
                        title: "Tasks : ",
                        start: "2017-11-29"
                    });
                    callback(events);
                }
            });
        },
        eventAfterRender: function(event, element, view) {
          $(element).css('width','50px');
      },  
     //   events: '/events',
     eventClick: function(calEvent, jsEvent, view) {
        var date = calEvent.start.format();

        var form = $(document.createElement('form'));
        $(form).attr("action", "/tdtasks");
        $(form).attr("method", "POST");

        var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "calldate")
        .val(date);

        $(form).append($(input));
        form.appendTo( document.body )
        $(form).submit();
    }
});
};

var Calendar = function () {
	"use strict";
    return {
        //main function
        init: function () {    
            handleCalendarDemo();        
        }
    };
}();