
var socket = io();
$(document).ready(function(){
	$('input[type=radio][name=speedMode]').change(function(){
		socket.emit('speedMode', this.value);
	})
	$('#unBalanced').change(function(){
		socket.emit('unBalanced', $(this).is(':checked'));
	})
});
socket.on('speedMode', function(value){
    $('input[type=radio][name=speedMode][value=' + value + ']').prop('checked', true);
    //console.log("speedMode: " + value);
  });
socket.on('unBalanced', function(value){
    $('#unBalanced').prop('checked', value);
    //console.log("unBalanced: " + value);
  });