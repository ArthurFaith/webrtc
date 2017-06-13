/*
 * 呼叫控制
 * @author 王杰
 * 无锡淘金网络科技有限公司
 */

taojin_room.controller('callController', function ($rootScope,$timeout,$scope, $window, ServiceParticipant, ServiceRoom, Fullscreen, LxNotificationService) {

    $scope.roomName = ServiceRoom.getRoomName();
    $scope.userName = ServiceRoom.getUserName();
    $scope.participants = ServiceParticipant.getParticipants();
    $scope.kurento = ServiceRoom.getKurento();
	
	$timeout(function(){
		$rootScope.manNumber =  Object.keys($scope.participants).length;
    },3000)
    //断开视频连接
    $scope.leaveRoom = function () {
        ServiceRoom.getKurento().close();
        ServiceParticipant.removeParticipants();

        //redirect to login
        $window.location.href = '#/login';
    };
    
	//判断是否连接
    window.onbeforeunload = function () {
    	//not necessary if not connected
    	if (ServiceParticipant.isConnected()) {
    		ServiceRoom.getKurento().close();
    	}
    };

	//全屏显示网页
    $scope.goFullscreen = function () {

        if (Fullscreen.isEnabled())
            Fullscreen.cancel();
        else
            Fullscreen.all();

    };
    
    //通讯录
    $scope.disableMainSpeaker = function (value) {

    	var element = document.getElementById("buttonMainSpeaker");
        if (element.classList.contains("md-person")) { //on
            element.classList.remove("md-person");
            element.classList.add("md-recent-actors");
            ServiceParticipant.enableMainSpeaker();
        } else { //off
            element.classList.remove("md-recent-actors");
            element.classList.add("md-person");
            ServiceParticipant.disableMainSpeaker();
        }
    }
	
	//关闭麦克风
    $scope.onOffVolume = function () {
        var localStream = ServiceRoom.getLocalStream();
        var element = document.getElementById("buttonVolume");
        var kurento = ServiceRoom.getKurento();
        var doaction = "";
        if (element.classList.contains("room-say-close")) { //on
            element.classList.remove("room-say-close");
            element.classList.add("room-say");
            localStream.audioEnabled = true;
            doaction = "startvoice";
        } else { //off
            element.classList.remove("room-say");
            element.classList.add("room-say-close");
            localStream.audioEnabled = false;
            doaction = "stopvoice";
        }
        
        console.log("Sending volume to all");
		kurento.sendRequest("ctrroomNotice", {
			doaction:doaction
		}, function(error, response) {
			if(error) {
				console.error("Error on ctrroomVoice: " + JSON.stringify(error));
			} else {
				
			}
		});
    };
	
	//关闭摄像头
    $scope.onOffVideocam = function () {
        var localStream = ServiceRoom.getLocalStream();
        var element = document.getElementById("buttonVideocam");
        var kurento = ServiceRoom.getKurento();
        var doaction = "";
        if (element.classList.contains("room-head-close")) {//on
            element.classList.remove("room-head-close");
            element.classList.add("room-head");
            localStream.videoEnabled = true;
            doaction = "startvoice";
        } else {//off
            element.classList.remove("room-head");
            element.classList.add("room-head-close");
            localStream.videoEnabled = false;
            doaction = "stopvoice";
        }
        console.log("Sending videocam to all");
		kurento.sendRequest("ctrroomNotice", {
			doaction:doaction
		}, function(error, response) {
			if(error) {
				console.error("Error on ctrroomVideo: " + JSON.stringify(error));
			} else {
				
			}
		});
    };
	
	//断开视频连接
    $scope.disconnectStream = function() {
    	var localStream = ServiceRoom.getLocalStream();
    	var participant = ServiceParticipant.getMainParticipant();
    	if (!localStream || !participant) {
    		LxNotificationService.alert('Error!', "Not connected yet", 'Ok', function(answer) {
            });
    		return false;
    	}
    	ServiceParticipant.disconnectParticipant(participant);
    	ServiceRoom.getKurento().disconnectParticipant(participant.getStream());
    }
    
    //chat
    $scope.message;
	
	//聊天窗口发送
    $scope.sendMessage = function () {
        console.log("Sending message", $scope.message);
        var kurento = ServiceRoom.getKurento();
        kurento.sendMessage($scope.roomName, $scope.userName, $scope.message);
        $scope.message = "";
    };

    //open or close chat when click in chat button
    //聊天窗口切换
    $scope.toggleChat = function () {
        var selectedEffect = "slide";
        // most effect types need no options passed by default
        var options = {direction: "right"};
        if ($("#effect").is(':visible')) {
            $("#content").animate({width: '100%'}, 500);
        } else {
            $("#content").animate({width: '80%'}, 500);
        }
        // run the effect
        $("#effect").toggle(selectedEffect, options, 500);
    };
    
    //人物帽子功能
    $scope.showHat = function () {
    	var targetHat = false;
    	var offImgStyle = "md-mood";
    	var offColorStyle = "btn--deep-purple";
    	var onImgStyle = "md-face-unlock";
    	var onColorStyle = "btn--purple";
    	var element = document.getElementById("hatButton");
        if (element.classList.contains(offImgStyle)) { //off
            element.classList.remove(offImgStyle);
            element.classList.remove(offColorStyle);
            element.classList.add(onImgStyle);
            element.classList.add(onColorStyle);
            targetHat = true;
        } else if (element.classList.contains(onImgStyle)) { //on
            element.classList.remove(onImgStyle);
            element.classList.remove(onColorStyle);
            element.classList.add(offImgStyle);
            element.classList.add(offColorStyle);
            targetHat = false;
        }
    	
        var hatTo = targetHat ? "on" : "off";
    	console.log("Toggle hat to " + hatTo);
    	ServiceRoom.getKurento().sendCustomRequest({hat: targetHat}, function (error, response) {
    		if (error) {
                console.error("Unable to toggle hat " + hatTo, error);
                LxNotificationService.alert('Error!', "Unable to toggle hat " + hatTo, 
                		'Ok', function(answer) {});
        		return false;
            } else {
            	console.debug("Response on hat toggle", response);
            }
    	});
    };
    
    //二分屏
    $scope.splitScreen = {
    	//创建的容器容器
    	videoBox: function(){
    		var screenVideo = document.createElement('div');
    		screenVideo.className = "video";
    		return screenVideo;
    	},
    	//屏幕自适应
    	updateStyle:function(length){
			if(length == 1){
				$('.video').css({
	                "width": "100%",
	                "height":"100%"
	            });
			}
			if (length == 2 ) {
	            $('.video').css({
	                "width": "50%",
	                "height":"100%"
	            });
	        }
	        if (length > 2 && length < 5) {
	            $('.video').css({
	                "width": "50%",
	                "height": "50%"
	            });
	        }
	        if(length > 4 && length < 7){
	        	$('.video').css({
	                "width": "33.3%",
	                "height": "50%"
	            });
	        }
	        if(length > 7){
	        	$('.video').css({
	                "width": "33.3%",
	                "height": "33.3%"
	            });
	        }

    	},
    	someScreen:function(some){
    		var mainBox = document.getElementById("participants");
    		var childrenBox = mainBox.getElementsByClassName("video");
			var aaaa = document.createElement('div')
			if(childrenBox.length == 0)
			{
				for(var n=0;n<some;n++)
    			{
    				mainBox.appendChild($scope.splitScreen.videoBox());
    			}
			}
    		if(childrenBox.length > 0 && childrenBox.length < some)
    		{	
    			var nowLength = some-childrenBox.length;
    			for(var j=0;j<nowLength;j++)
    			{	
    				mainBox.appendChild($scope.splitScreen.videoBox());
    			}    			
    		}
    		if(childrenBox.length = some)
    		{
    			
    		}
    		if(childrenBox.length > some)
    		{
    			var removeLength = childrenBox.length-some;
    			for(var m=0;m<removeLength;m++)
    			{
    				mainBox.removeChild(mainBox.lastChild);
    			}
    		}
    		this.updateStyle(childrenBox.length);

    	}
    }
    
	$scope.canNo = function(){
		alert('暂未实现');
	}

});


