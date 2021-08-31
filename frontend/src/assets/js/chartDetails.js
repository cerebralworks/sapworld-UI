/*--scoreChart1--*/
var data = {
  labels: [
	"Florida",
	"San Francisco",
	"Dallas",
	"Las Vegas",
	"New Mexico"
  ],
  datasets: [
	{
	  data: [8, 9, 10, 11, 7 ],
	  borderWidth:0,
	  backgroundColor: [
		"#f9863e",
		"#59c1dc",
		"#7db861",
		"#ffce45",
		"#07315c"
	  ]
	}]
};

var promisedDeliveryChart = new Chart(document.getElementById('scoreChart1'), {
  type: 'doughnut',
  data: data,
  options: {
	cutoutPercentage: 66,
	responsive: true,
	legend: {
	  display: true,
	  position: 'left',
	  labels: {
		fontSize: 12,
		usePointStyle: true  //<-- set this
	  }
	}
  }
});


/*--scoreChart2--*/
var data = {
  labels: [
	"Florida",
	"San Francisco",
	"Dallas",
	"Las Vegas",
	"New Mexico"
  ],
  datasets: [
	{
	  data: [5, 4, 6, 7, 2 ],
	  borderWidth:0,
	  backgroundColor: [
		"#f9863e",
		"#59c1dc",
		"#7db861",
		"#ffce45",
		"#07315c"
	  ]
	}]
};

var promisedDeliveryChart = new Chart(document.getElementById('scoreChart2'), {
  type: 'doughnut',
  data: data,
  options: {
	cutoutPercentage: 66,
	responsive: true,
	legend: {
	  display: true,
	  position: 'left',
	  labels: {
		 usePointStyle: true  //<-- set this
	  }
	}
  }
});
/*----*/
/*--scoreChart3--*/
var data = {
  labels: [
	"Immediate",
	"15 Days",
	"30 Days",
	"45 Days",
	"60 Days"
  ],
  datasets: [
	{
	  data: [18, 25, 14, 10, 5 ],
	  borderWidth:0,
	  backgroundColor: [
		"#f9863e",
		"#59c1dc",
		"#7db861",
		"#ffce45",
		"#07315c"
	  ]
	}]
};

var promisedDeliveryChart = new Chart(document.getElementById('scoreChart3'), {
  type: 'doughnut',
  data: data,
  options: {
	cutoutPercentage: 66,
	responsive: true,
	legend: {
	  display: true,
	  position: 'left',
	  labels: {
		 usePointStyle: true  //<-- set this
	  }
	}
  }
});
/*----*/
/*--scoreChart4--*/
var data = {
  labels: [
	"Part Time/Freelance",
	"Full Time",
	"Contract",
	"Internship"
  ],
  datasets: [
	{
	  data: [9, 15, 8, 7 ],
	  borderWidth:0,
	  backgroundColor: [
		"#f9863e",
		"#59c1dc",
		"#7db861",
		"#ffce45",
		"#07315c"
	  ]
	}]
};

var promisedDeliveryChart = new Chart(document.getElementById('scoreChart4'), {
  type: 'doughnut',
  data: data,
  options: {
	cutoutPercentage: 66,
	responsive: true,
	legend: {
	  display: true,
	  position: 'left',
	  labels: {
		 usePointStyle: true  //<-- set this
	  }
	}
  }
});
/*----*/
/*--scoreChart5--*/
var data = {
  labels: [
	"USA",
	"Malaysia",
	"Singapore",
	"Australia",
	"Canada"
  ],
  datasets: [
	{
	  data: [20, 17, 11, 19, 26 ],
	  borderWidth:0,
	  backgroundColor: [
		"#f9863e",
		"#59c1dc",
		"#7db861",
		"#ffce45",
		"#07315c"
	  ]
	}]
};

var promisedDeliveryChart = new Chart(document.getElementById('scoreChart5'), {
  type: 'doughnut',
  data: data,
  options: {
	cutoutPercentage: 66,
	responsive: true,
	legend: {
	  display: true,
	  position: 'left',
	  labels: {
		 usePointStyle: true  //<-- set this
	  }
	}
  }
});
/*----*/