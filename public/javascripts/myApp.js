
var socket = io();
var isDragging = false;
var isDraggingTemp = false;
var speedSlider,tempSlider;
$(document).ready(function(){
	$("#btn-fireplace-mode").click(function(){
		socket.emit('unBalanced');
	});
	$("#btn-speed-min").click(function(){
	 		socket.emit('speedMode', '1');
	});
	$("#btn-speed-med").click(function(){
	 		socket.emit('speedMode', '2');
	});
	$("#btn-speed-max").click(function(){
	 		socket.emit('speedMode', '3');
	});
	speedSlider = new Dragdealer('slider',{
		steps: 9,
		slide: false,
		snap: true,
		animationCallback: function(x,y){
			$('.remaining').text(Math.round(x * 120) + " min.");
		},
		dragStartCallback: function(x,y){
			isDragging = true;
		},
		dragStopCallback: function(x, y){
			socket.emit('fire-place-timer', Math.round(x * 120));
			isDragging = false;
		}
	});
	tempSlider = new Dragdealer('tempSlider',{
		steps: 12,
		slide: false,
		snap: true,
		animationCallback: function(x,y){
			var temp = (Math.round(x * 11));
			$('.setpoint').text((temp === 0 ? "Off" : (temp+11)+ " °C"));
		},
		dragStartCallback: function(x,y){
			isDraggingTemp = true;
		},
		dragStopCallback: function(x, y){
			socket.emit('tempSetpoint', Math.round(x * 11));
			isDraggingTemp = false;
		}
	});
});

socket.on('tempSetpoint', function(value){
	if(isDraggingTemp)
		return;
	var tmp = parseInt(value) + 11;
	console.log(tmp);
	$('.setpoint').text(tmp);
	tempSlider.setValue((value/11),0,true);
  });

socket.on('unBalanced', function(value){
	if(value){
		$('#btn-fireplace-mode').addClass("btn-info active").removeClass("btn-default");
		$('.panel-body.fireplace').addClass("active");
	}else{
		$('#btn-fireplace-mode').removeClass("btn-info active").addClass("btn-default")
		$('.panel-body.fireplace').removeClass("active");
	}
  });

socket.on('speedMode', function(value){
	if(value == 1){
		$('#btn-speed-min').addClass("btn-info active").removeClass("btn-default")
		$('#btn-speed-med').removeClass("btn-info active").addClass("btn-default")
		$('#btn-speed-max').removeClass("btn-info active").addClass("btn-default")
	}
	if(value == 2){
		$('#btn-speed-min').removeClass("btn-info active").addClass("btn-default")
		$('#btn-speed-med').addClass("btn-info active").removeClass("btn-default")
		$('#btn-speed-max').removeClass("btn-info active").addClass("btn-default")
		}
	if(value == 3){
		$('#btn-speed-min').removeClass("btn-info active").addClass("btn-default")
		$('#btn-speed-med').removeClass("btn-info active").addClass("btn-default")
		$('#btn-speed-max').addClass("btn-info active").removeClass("btn-default")
	}
  });

socket.on('time',function (time) {
	if(isDragging)
		return;

	$('.remaining').text(time.time);
	var parts = time.time.split(':');
	var minutes = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
	var place = minutes - (minutes % 15) + 15;
	speedSlider.setValue((place/120),0,true);


});

