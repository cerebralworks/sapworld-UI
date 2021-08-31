/*--myChart1--*/
var ctx = document.getElementById("myChart1").getContext('2d');
var myChart1 = new Chart(ctx, {
type: 'bar',
data: {
labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
datasets: [
{
label: 'New Employers',
data: [25, 30, 32, 27, 35, 22, 19, 20, 21, 31, 33, 25],
backgroundColor: 'rgba(56, 94, 223, 0.4)',
borderColor: 'rgba(56, 94, 223, 0.8)',
borderWidth: 1},
{
label: 'New Jobseekers',
data: [41, 40, 39, 45, 30, 29, 32, 44, 28, 35, 36, 33],
backgroundColor: 'rgba(17, 183, 113, 0.4)',
borderColor: 'rgba(17, 183, 113, 0.8)',
borderWidth: 1},
{
label: 'New Subscribers ',
data: [29, 31, 32, 15, 10, 16, 20, 19, 21, 28, 25, 30],
backgroundColor: 'rgba(233, 135, 82, 0.4)',
borderColor: 'rgba(233, 135, 82, 0.8)',
borderWidth: 1}     
 ]
}
});
/*--myChart2--*/
var ctx = document.getElementById("myChart2").getContext('2d');
var myChart2 = new Chart(ctx, {
type: 'line',
data: {
labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
datasets: [
{
label: 'Postesd Jobs',
data: [25, 30, 32, 27, 35, 22, 19, 20, 21, 31, 33, 25],
backgroundColor: 'rgba(56, 94, 223, 0.4)',
borderColor: 'rgba(56, 94, 223, 0.8)',
borderWidth: 1},
{
label: 'Active Jobs',
data: [22, 30, 28, 20, 30, 17, 19, 15, 19, 28, 27, 21],
backgroundColor: 'rgba(163, 81, 200, 0.4)',
borderColor: 'rgba(163, 81, 200, 0.8)',
borderWidth: 1}     
 ]
}
});
/*--myChart3--*/
var ctxP = document.getElementById("myChart3").getContext('2d');
var myPieChart = new Chart(ctxP, {
  plugins: [ChartDataLabels],
  type: 'doughnut',
  data: {
    labels: ["Active", "Inactive"],
    datasets: [{
      data: [72, 40],
      backgroundColor: ["#ff8167", "#a570ea", "#ffb741", "#71c083"],
      hoverBackgroundColor: ["#dd6e57", "#9360d5", "#e19e30", "#65b277"]
    }]
  },
  options: {
    responsive: true,
    legend:false,
    plugins: {
      datalabels: {
        color: 'black',
        labels: {
          title: {
            font: {
              size: '12'
            }
          }
        }
      }
    }
  }
});


/*--myChart4--*/
var ctxP = document.getElementById("myChart4").getContext('2d');
var myPieChart = new Chart(ctxP, {
  plugins: [ChartDataLabels],
  type: 'doughnut',
  data: {
    labels: ["Available", "Not Open for Roles"],
    datasets: [{
      data: [1050, 500],
      backgroundColor: ["#51b9d1", "#ffc800", "#ff8167", "#a570ea"],
      hoverBackgroundColor: ["#44a4ba", "#eab701", "#dd6e57", "#9360d5"]
    }]
  },
  options: {
    responsive: true,
    legend:false,
    plugins: {
      datalabels: {
        color: 'black',
        labels: {
          title: {
            font: {
              size: '12'
            }
          }
        }
      }
    }
  }
});


