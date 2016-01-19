function fetchLikeCount(url, callback){
  var likes;
  $.ajax({
    dataType: 'jsonp',
    url: 'https://api.facebook.com/method/fql.query?callback=callback',
    data: {
        query: 'SELECT like_count FROM link_stat WHERE url="' + url + '"',
        format: 'JSON'
    },
    async: false,
    success: function(res) {
      callback(res[0].like_count);
    }
  });
};

$(function() {
  // team information
  teams = [
  {
    url: 'https://www.facebook.com/University-of-Alberta-EcoCar-Team-287163227967047',
    name: 'Ualberta EcoCar',
    baseline: 248
  },
  {
    url: 'https://www.facebook.com/utsupermileage/',
    name: 'UofT Supermileage',
    baseline: 524
  },
  {
    url: 'https://www.facebook.com/ubcst/',
    name: 'UBC Supermileage',
    baseline: 1076
  },
  {
    url: 'https://www.facebook.com/queensevt/',
    name: "Queen's Eco-Vehicle",
    baseline: 570
  },
  {
    url: 'https://www.facebook.com/UWEcoMarathon/',
    name: 'Waterloo Supermileage',
    baseline: 618
  },
  {
    url: 'https://www.facebook.com/AlerionSupermileage/',
    name: 'ULaval Supermileage',
    baseline: 783
  },
  {
    url: 'https://www.facebook.com/umonctonsupermileage/',
    name: 'UMoncton Supermileage',
    baseline: 242
  }];

  // get likes
  teams.forEach(function(team) {
    fetchLikeCount(team.url, function(likes) {
      team.total_likes = likes;
      team.likes = likes - team.baseline;
    });
  });

  console.log(teams);

  // draw chart
  $(document).ajaxStop(function() {
    // get plotting arrays
    var categories = [];
    var baseline = [];
    var likes = [];
    teams.forEach(function(team) {
      categories.push(team.name);
      baseline.push(team.baseline);
      likes.push(team.likes);
    });
    console.log(categories);
    console.log(baseline);
    console.log(likes);

    // add chart
    $("#container").highcharts({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Shell Marathon Facebook Likes'
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Facebook Likes'
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: [
      {
        name: 'After 10th Jan',
        data: likes
      },
      {
        name: 'Before 10th Jan',
        data: baseline
      }]
    });

  });

});