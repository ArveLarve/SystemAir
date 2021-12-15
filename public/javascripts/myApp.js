
var socket = io();
var isDragging = false;
var isDraggingTemp = false;
var speedSlider,tempSlider;

$(document).ready(function(){
	//
	// ----- GUI Event handlers -----
	//

	//
	// Fan speed minimum button 
	//
	$("#btn-speed-min").click(function(){
 		socket.emit('speedMode', '1');
	});

	//
	// Fan speed medium button 
	//
	$("#btn-speed-med").click(function(){
 		socket.emit('speedMode', '2');
	});

	//
	// Fan speed maximum button 
	//
	$("#btn-speed-max").click(function(){
	 	socket.emit('speedMode', '3');
	});

	//
	// Fireplace button
	//
	$("#btn-fireplace-mode").click(function(){
		socket.emit('unBalanced');
	});

	//
	// Fireplace Timer slider 
	//	
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

	//
	// Temperature slider 
	//	
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

//
// ----- Socket IO Events Received -----
//

//
// Fan speed button update
//
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

//
// Fireplace Mode enabled/disabled
//
socket.on('unBalanced', function(value){
	if(value){
		$('#btn-fireplace-mode').addClass("btn-info active").removeClass("btn-default");
		$('.panel-body.fireplace').addClass("active");
	}else{
		$('#btn-fireplace-mode').removeClass("btn-info active").addClass("btn-default")
		$('.panel-body.fireplace').removeClass("active");
	}
  });

//
// Fireplace Mode timer update
//
socket.on('time',function (time) {
	if(isDragging)
		return;

	$('.remaining').text(time.time);
	var parts = time.time.split(':');
	var minutes = (parseInt(parts[0]) * 60) + parseInt(parts[1]);
	var place = minutes - (minutes % 15) + 15;
	speedSlider.setValue((place/120),0,true);
});

//
// Temperature setpoint
//
socket.on('tempCurrent', function(value){
	if(isDraggingTemp)
		return;

	var tmp = parseInt(value);
	$('.setpoint').text((tmp === 0 ? "Off" : (tmp+11)+ " °C"));
	tempSlider.setValue((value/11),0,true);
  });

