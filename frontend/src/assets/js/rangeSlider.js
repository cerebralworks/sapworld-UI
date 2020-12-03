$(document).ready(function(){
			
	/*----*/
	/*--Salary Range--*/
	$(function () {
	  $("#salary-slider-range").slider({
		range: true,
		orientation: "horizontal",
		min: 1000,
		max: 5000,
		values: [1000, 2500],
		step: 100,

		slide: function (event, ui) {
		  if (ui.values[0] == ui.values[1]) {
			  return false;
		  }
		  
		  $(".min_salary").val( " $ " + ui.values[ 0 ] ); 
		  $(".max_salary").val( " $ " + ui.values[ 1 ] ); 
		}
	  });

	  $(".min_salary").val(" $ " + $("#salary-slider-range").slider("values", 0));
	  $(".max_salary").val(" $ " + $("#salary-slider-range").slider("values", 1));

	});

	$("#salary-slider-range").click(function () {

	  var min_salary = $('.min_salary').val();
	  var max_salary = $('.max_salary').val();

	  $("#salaryResults").text( min_salary +" "+ "$" +" "+ "-" + " "+ max_salary +" "+"$" );
	});
		
	/*----*/
	/*--Experience Range--*/
	$(function () {
	  $("#experience-slider-range").slider({
		range: true,
		orientation: "horizontal",
		min: 0,
		max: 20,
		values: [0, 5],
		step: 1,

		slide: function (event, ui) {
		  if (ui.values[0] == ui.values[1]) {
			  return false;
		  }
		  
		  $(".min_years").val(ui.values[0]);
		  $(".max_years").val(ui.values[1]);
		}
	  });

	  $(".min_years").val($("#experience-slider-range").slider("values", 0));
	  $(".max_years").val($("#experience-slider-range").slider("values", 1));

	});

	$("#experience-slider-range").click(function () {

	  var min_years = $('.min_years').val();
	  var max_years = $('.max_years').val();

	  $("#yearsResults").text( min_years +" "+ "yrs" +" "+ "-" + " "+ max_years +" "+"yrs" );
	});
		
	/*----*/
	/*--Distance Range--*/
	$(function () {
	  $("#distance-slider-range").slider({
		range: true,
		orientation: "horizontal",
		min: 0,
		max: 25,
		values: [0, 1],
		step: 1,

		slide: function (event, ui) {
		  if (ui.values[0] == ui.values[1]) {
			  return false;
		  }
		  
		  $(".min_distance").val(ui.values[0]);
		  $(".max_distance").val(ui.values[1]);
		}
	  });

	  $(".min_distance").val($("#distance-slider-range").slider("values", 0));
	  $(".max_distance").val($("#distance-slider-range").slider("values", 1));

	});

	$("#distance-slider-range").click(function () {

	  var min_price = $('.min_distance').val();
	  var max_price = $('.max_distance').val();

	  $("#distanceResults").text( min_price +" "+ "mi" +" "+ "-" + " "+ max_price +" "+"mi" );
	});
	
	/*----*/
	/*--Time Range--*/	
	
	$(function () {
	  $("#time-slider-range").slider({
		range: true,
		orientation: "horizontal",
		min: 0,
		max: 1440,
		values: [350, 1200],
		step: 15,

		slide: function (e, ui) {
				var hours1 = Math.floor(ui.values[0] / 60);
				var minutes1 = ui.values[0] - (hours1 * 60);

				if (hours1.length == 1) hours1 = '0' + hours1;
				if (minutes1.length == 1) minutes1 = '0' + minutes1;
				if (minutes1 == 0) minutes1 = '00';
				if (hours1 >= 12) {
					if (hours1 == 12) {
						hours1 = hours1;
						minutes1 = minutes1 + " PM";
					} else {
						hours1 = hours1 - 12;
						minutes1 = minutes1 + " PM";
					}
				} else {
					hours1 = hours1;
					minutes1 = minutes1 + " AM";
				}
				if (hours1 == 0) {
					hours1 = 12;
					minutes1 = minutes1;
				}



				$('.min-time').html(hours1 + ':' + minutes1);

				var hours2 = Math.floor(ui.values[1] / 60);
				var minutes2 = ui.values[1] - (hours2 * 60);

				if (hours2.length == 1) hours2 = '0' + hours2;
				if (minutes2.length == 1) minutes2 = '0' + minutes2;
				if (minutes2 == 0) minutes2 = '00';
				if (hours2 >= 12) {
					if (hours2 == 12) {
						hours2 = hours2;
						minutes2 = minutes2 + " PM";
					} else if (hours2 == 24) {
						hours2 = 11;
						minutes2 = "59 PM";
					} else {
						hours2 = hours2 - 12;
						minutes2 = minutes2 + " PM";
					}
				} else {
					hours2 = hours2;
					minutes2 = minutes2 + " AM";
				}

				$('.max-time').html(hours2 + ':' + minutes2);
			}
	  });

	  $(".min-time").val($("#time-slider-range").slider("values", 0));
	  $(".max-time").val($("#time-slider-range").slider("values", 1));

	});

});