var superSlidePoll = (function (id_presentation) {
	var superSlidePoll = {};
	var voteRef = new Firebase(superSlide.firebaseUrl + "/presentation/" + id_presentation + "/polls_answers");
	var charts = {};
	var colors = {};
	
	function vote(id_poll, id_answer) {
		// Test token ..
		var firebaseObject = new Firebase(superSlide.firebaseUrl);
		var authData = firebaseObject.getAuth();

		if(!authData) {
		    firebaseObject.authAnonymously(function(error, authData) {
			    if (!error) {
			    	vote(id_poll, id_answer);
			    }
			    else {
			    	alert('OMG NOZ');
			    }
		    });
		    return;
		}

		if (authData) {
			console.log('Authenticated user with uid:', authData.uid);
			console.log('Authenticated user with token:', authData.token);
			voteRef.push({id_answer : id_answer, id_poll : id_poll, voter : authData.token});
		}
		else {
			alert("OH MY GAD CEST GRAVE LA");
		}
	}
	
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	function renderChart(counter, id_poll) {
		var data_chart = [];
		var answers = counter[id_poll].answers;
		for (id_answer in answers) {
			if (answers.hasOwnProperty(id_answer)) {
				var answerText = answers[id_answer].answer;
				var answerCount = answers[id_answer].count;
				var color = colors[id_poll + "_" + id_answer] || getRandomColor();
				colors[id_poll + "_" + id_answer] = color;
				data_chart.push({
					value: answerCount,
					color: color,
					//highlight: "#FF5A5E",
					label: answerText
				});
			}
		}

		if(!charts[id_poll]) {
			var totalVotes = data_chart.reduce(function(sum, data) { return sum + data['value']; }, 0);
			if(totalVotes > 0) {
				var ctx = $("#" + id_poll + "_chart").get(0).getContext("2d");
				var pieChart = new Chart(ctx).Pie(data_chart, {animation: false});
				charts[id_poll] = pieChart;
			}
		}
		else {
			data_chart.forEach(function(data) {
				for(var i = 0; i < charts[id_poll].segments.length; i++) {
					if(charts[id_poll].segments[i].label === data.label) {
						charts[id_poll].segments[i].value = data.value;
						break;
					}
				}
			});
			charts[id_poll].update();
		}
	}
	
	function renderCharts(counter) {
		for (id_poll in counter) {
			if (counter.hasOwnProperty(id_poll)) {
				renderChart(counter, id_poll);
			}
		}
	}
	
	
	superSlidePoll.processPolls = function() {
		$(document).ready(function(){
			var counter = {};
			
			$("poll").each(function( index ) {
				var id_poll = "poll_" + index;
				$(this).after('<canvas id="'+id_poll+'_chart" width="400" height="400" style="display:block;margin:auto"></canvas>');
				$('#'+id_poll+'_chart').hide();
				var question = $(this).children("question").text();
				counter[id_poll] = { question: question, answers: {} };
				$(this).attr("id", id_poll);
				
				$(this).children("answers").children("answer").each(function( index ) {
					var id_answer = "answer_" + index;
					var answer = $(this).text();
					counter[id_poll]["answers"][id_answer] = {};
					counter[id_poll]["answers"][id_answer] = { answer: answer, count: 0 };
					$(this).attr("id", id_answer);
					$(this).on("click", function () {
						vote(id_poll, id_answer);
					});
				});
			});
			voteRef.on('child_added', function(snapshot) {
				var voteData = snapshot.val();
				counter[voteData.id_poll]["answers"][voteData.id_answer]["count"]++;

				var firebaseObject = new Firebase(superSlide.firebaseUrl);
				var authData = firebaseObject.getAuth();
				if(authData && voteData.voter === authData.token) {
					$('#'+voteData.id_poll).hide();
					$('#'+voteData.id_poll+'_chart').show();
				}
				renderCharts(counter);
			});
		});
	};
	return superSlidePoll;
})(presentationId);