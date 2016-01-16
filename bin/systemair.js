var systemair = require("../data/all.json");

module.exports = function(slaveId){

	function getModbusMetadata(registerName){
		var sysairObject;
		for(var obj in systemair){
			systemair[obj].filter(function(item){
				if(item.name === registerName){
					sysairObject = item;
				}
			 	return item.name === registerName;
			});
			if(sysairObject){
				break;
			}
		}
		return { 
			'address' : sysairObject.registeraddress - slaveId,
			'functionCode' : getFunctionCode(sysairObject)
		}
	}

	function getFunctionCode(obj){
		var ret = {};
		if(obj.access.toLowerCase().indexOf("reg") > -1){
			ret['read'] = 3;
			if(obj.readmode.toLowerCase().indexOf("w") > -1){
				ret['write'] = 6;
			}
		}
		if(obj.access.toLowerCase().indexOf("coil") > -1){
			ret['read'] = 1;
			if(obj.readmode.toLowerCase().indexOf("w") > -1){
				ret['write'] = 5;
			}
		}
		return ret;
	}

	var mod = {};
	mod.fanLevel = getModbusMetadata("REG_FAN_SPEED_LEVEL");
	mod.firePlaceMode = getModbusMetadata("REG_DI_3");
	mod.temperatureSetpoint = getModbusMetadata("REG_HC_TEMP_LVL");

	return mod;

}