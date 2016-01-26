var ModbusRTU = require("modbus-serial");
var modClient = new ModbusRTU();
var systemair = require("./systemair")(1);
/******************************/

var slaveId = 1;
var modbusRTU_TCPServerAddress = "192.168.1.121";
var modbusRTU_TCPServerPort = "1234";


/******************************/

function getFunctionById(integerValue){
	var ret;
	switch(integerValue) {
		case 1:
			ret = "readCoils";
			break;
		case 5:
			ret = "writeCoil";
			break;
		case 3:
			ret = "readHoldingRegisters";
			break;
		case 6:
			ret = "writeRegister";
			break;
		case 16:
			ret = "writeRegisters";
			break; 
	}
	return ret;
}

// open connection to a tcp line for Modbus RTU

modClient.connectTelnet(
	modbusRTU_TCPServerAddress,
	{port: modbusRTU_TCPServerPort},
	function(){
  		modClient.setID(1);
	}
);

module.exports = {
	getFanLevel : function(){
		var modbusObject = systemair.fanLevel;
		return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1).then(function(data) 
			{
				return data.data;
			});
	},
	setFanLevel : function(value){
		var modbusObject = systemair.fanLevel;
		if(modbusObject.functionCode.write){
		    return modClient[getFunctionById(modbusObject.functionCode.write)](modbusObject.address, value).then(function(){
		        return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1)
		          .then(function(latestval){
		            return latestval.data;
		        });
		    });	
		}else{
			return null;
		}
	},
	getFireplaceMode : function(){
		var modbusObject = systemair.firePlaceMode;
		return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1).then(function(data) 
			{
				return data.data[0];
			});
	},
	setFireplaceMode : function(value){
		var modbusObject = systemair.firePlaceMode;
		if(modbusObject.functionCode.write){
		    return modClient[getFunctionById(modbusObject.functionCode.write)](modbusObject.address, value).then(function(){
		        return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1)
		          .then(function(latestval){
		            return latestval.data[0];
		        });
		    });	
		}else{
			return null;
		}
	},
	getTemperature : function(){
		var modbusObject = systemair.temperatureSetpoint;
		return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1).then(function(data) 
			{
				return data.data;
			});
	},
	setTemperature : function(value){
		var modbusObject = systemair.temperatureSetpoint;
		if(modbusObject.functionCode.write){
		    return modClient[getFunctionById(modbusObject.functionCode.write)](modbusObject.address, parseInt(value)).then(function(){
		        return modClient[getFunctionById(modbusObject.functionCode.read)](modbusObject.address, 1)
		          .then(function(latestval){
		            return latestval.data;
		        });
		    });	
		}else{
			return null;
		}
	}
}
