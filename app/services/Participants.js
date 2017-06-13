/*
 * 音视频流控制
 * @author 王杰
 * 无锡淘金网络科技有限公司
 */
//var count = 0;
function AppParticipant(stream,length) {

    this.stream = stream;//流对象
    this.videoElement;//界面视频DOM
    this.thumbnailId;//参与者ID
    var that = this;

    this.getStream = function() {
		return this.stream;
	}
	
	//主屏
    this.setMain = function () {

        var mainVideo = document.getElementById("main-video");
        var oldVideo = mainVideo.firstChild;

        stream.playOnlyVideo("main-video", that.thumbnailId);

        that.videoElement.className += "active-video";

        if (oldVideo !== null) {
            mainVideo.removeChild(oldVideo);
        }
    }
	
	//移除主屏
    this.removeMain = function () {
        $(that.videoElement).removeClass("active-video");
    }
	
	//移除子屏
    this.remove = function () {
        if (that.videoElement !== undefined) {
            if (that.videoElement.parentNode !== null) {
                that.videoElement.parentNode.removeChild(that.videoElement);
            }
        }
    }
	
	
	//创建界面DOM
    function playVideo() {
		//获取participants容器
		var boxes = document.getElementsByClassName('video');
	
        that.thumbnailId = "video-" + stream.getGlobalID();	

		var videoIndex = 0;
		for(var q=0;q<boxes.length;q++)
		{	
			if(!boxes[q].childNodes[0]){
				videoIndex = q;
				break;
			}						
		}
		
		if(videoIndex == 0)
		{	
			//创建新的video容器
			that.videoElement = document.createElement('div');
			that.videoElement.className = "video";
			that.videoElement.setAttribute("id", that.thumbnailId);
			
			var speakerSpeakingVolumen = document.createElement('div');
	        speakerSpeakingVolumen.setAttribute("id","speaker" + that.thumbnailId);
	        speakerSpeakingVolumen.className = 'btn--m btn--green btn--fab mdi md-volume-up blinking';
	        speakerSpeakingVolumen.style.position = "absolute";
	        speakerSpeakingVolumen.style.left = "3%";
	        speakerSpeakingVolumen.style.top = "60%";
	        speakerSpeakingVolumen.style.zIndex = "100";
	        speakerSpeakingVolumen.style.display = "none";
	        that.videoElement.appendChild(speakerSpeakingVolumen);
	
	        document.getElementById("participants").appendChild(that.videoElement);
	        
	        that.stream.playThumbnail(that.thumbnailId);
		}
		if(videoIndex > 0)
		{	
			//使用页面上的video容器
			that.videoElement = $('#participants .video')[videoIndex];
			console.log(that.videoElement);
			that.videoElement.setAttribute("id", that.thumbnailId);
			
			var speakerSpeakingVolumen = document.createElement('div');
	        speakerSpeakingVolumen.setAttribute("id","speaker" + that.thumbnailId);
	        speakerSpeakingVolumen.className = 'btn--m btn--green btn--fab mdi md-volume-up blinking';
	        speakerSpeakingVolumen.style.position = "absolute";
	        speakerSpeakingVolumen.style.left = "3%";
	        speakerSpeakingVolumen.style.top = "60%";
	        speakerSpeakingVolumen.style.zIndex = "100";
	        speakerSpeakingVolumen.style.display = "none";
	        that.videoElement.appendChild(speakerSpeakingVolumen);
		        
	        that.stream.playThumbnail(that.thumbnailId);
		}
        
 
        
//      var buttonVideo = document.createElement('button');
//      buttonVideo.className = 'action btn btn--m btn--orange btn--fab mdi md-desktop-mac';
//      //FIXME this won't work, Angular can't get to bind the directive ng-click nor lx-ripple
//      buttonVideo.setAttribute("ng-click", "disconnectStream();$event.stopPropagation();");
//      buttonVideo.setAttribute("lx-ripple", "");
//      buttonVideo.style.position = "absolute";
//      buttonVideo.style.left = "15%";
//      buttonVideo.style.top = "60%";
//      buttonVideo.style.zIndex = "100";
//      that.videoElement.appendChild(buttonVideo);
        
    }

    playVideo();
}

function Participants() {

    var mainParticipant;
    var localParticipant;
    var mirrorParticipant;
    var participants = {};
    var roomName;
    var that = this;
    var connected = true;
    var displayingRelogin = false;
    var mainSpeaker = true;
    
    //确认是否连接
    this.isConnected = function() {
    	return connected;
    }
    
    //返回房间名
    this.getRoomName = function () {
        console.log("room - getRoom " + roomName);
        roomName = room.name;
        return roomName;
    };
	
	//主要参与者
    this.getMainParticipant = function() {
		return mainParticipant;
	}
    
    //更新视频状态（自适应）
    function updateVideoStyle() {
        var MAX_WIDTH = 100;
        var numParticipants = Object.keys(participants).length;
        var maxParticipantsWithMaxWidth = 100 / MAX_WIDTH;
    	var childrenBox = document.getElementById("participants").getElementsByClassName("video");
		
//		if(numParticipants == 1){
//			$('.video').css({
//              "width": "100%"
//          });
//		}
//		if (numParticipants == 2 ) {
//          $('.video').css({
//              "width": "50%"
//          });
//      }
//      if (numParticipants > 2 && numParticipants < 5 ) {
//          $('.video').css({
//              "width": "50%",
//              "height": "50%"
//          });
//      }
//      if(numParticipants > 4 && numParticipants < 7){
//      	$('.video').css({
//              "width": "33%",
//              "height": "50%"
//          });
//      }
//      if(numParticipants > 7)
//      {
//      	$('.video').css({
//              "width": "33%",
//              "height": "33%"
//          });
//      }
		if(childrenBox.length == 1){
			$('.video').css({
                "width": "100%"
            });
		}
		if (childrenBox.length == 2 ) {
            $('.video').css({
                "width": "50%"
            });
        }
        if (childrenBox.length > 2 && childrenBox.length < 5 ) {
            $('.video').css({
                "width": "50%",
                "height": "50%"
            });
        }
        if(childrenBox.length > 4 && childrenBox.length < 7){
        	$('.video').css({
                "width": "33.3%",
                "height": "50%"
            });
        }
        if(childrenBox.length > 7)
        {
        	$('.video').css({
                "width": "33.3%",
                "height": "33.3%"
            });
        }
    };
	
	//更新参与者
    function updateMainParticipant(participant) {
        if (mainParticipant) {
        	mainParticipant.removeMain();
        }
        mainParticipant = participant;
        mainParticipant.setMain();
    }
	
//	添加本地参与者（大屏）
    this.addLocalParticipant = function (stream) {
        localParticipant = that.addParticipant(stream);
        mainParticipant = localParticipant;
        mainParticipant.setMain();
    };
	
    this.addLocalMirror = function (stream) {
		mirrorParticipant = that.addParticipant(stream);
	};
    
    //添加参与者
    this.addParticipant = function (stream) {
        var participant = new AppParticipant(stream,length);       
        participants[stream.getGlobalID()] = participant;
      	
        updateVideoStyle();

//      $(participant.videoElement).click(function (e) {
//          updateMainParticipant(participant);
//      });

        //updateMainParticipant(participant);

        return participant;
    };
    
    //移除参与者
    this.removeParticipantByStream = function (stream) {
        this.removeParticipant(stream.getGlobalID());
    };

    this.disconnectParticipant = function (appParticipant) {
    	this.removeParticipant(appParticipant.getStream().getGlobalID());
    };

    this.removeParticipant = function (streamId) {
    	var participant = participants[streamId];
        delete participants[streamId];
        participant.remove();
        
        if (mirrorParticipant) {
        	var otherLocal = null;
        	if (participant === localParticipant) {
        		otherLocal = mirrorParticipant;
        	}
        	if (participant === mirrorParticipant) {
        		otherLocal = localParticipant;
        	}
        	if (otherLocal) {
        		console.log("Removed local participant (or mirror) so removing the other local as well");
        		delete participants[otherLocal.getStream().getGlobalID()];
        		otherLocal.remove();
        	}
        }
        
        //setting main
        if (mainParticipant && mainParticipant === participant) {
        	var mainIsLocal = false;
        	if (localParticipant) {
        		if (participant !== localParticipant && participant !== mirrorParticipant) {
        			mainParticipant = localParticipant;
        			mainIsLocal = true;
        		} else {
        			localParticipant = null;
                	mirrorParticipant = null;
        		}
        	}
        	if (!mainIsLocal) {
        		var keys = Object.keys(participants);
        		if (keys.length > 0) {
        			mainParticipant = participants[keys[0]];
        		} else {
        			mainParticipant = null;
        		}
        	}
        	if (mainParticipant) {
        		mainParticipant.setMain();
        		console.log("Main video from " + mainParticipant.getStream().getGlobalID());
        	} else
        		console.error("No media streams left to display");
        }

        updateVideoStyle();
    };

    //only called when leaving the room
    this.removeParticipants = function () {
    	connected = false;
        for (var index in participants) {
            var participant = participants[index];
            participant.remove();
        }
    };
	
	//获取参与者ID
    this.getParticipants = function () {
        return participants;
    };

    this.enableMainSpeaker = function () {
    	mainSpeaker = true;
    }

    this.disableMainSpeaker = function () {
    	mainSpeaker = false;
    }

    // Open the chat automatically when a message is received
    function autoOpenChat() {
        var selectedEffect = "slide";
        var options = {direction: "right"};
        if ($("#effect").is(':hidden')) {
            $("#content").animate({width: '80%'}, 500);
            $("#effect").toggle(selectedEffect, options, 500);
        }
    };

    this.showMessage = function (room, user, message) {
        var ul = document.getElementsByClassName("list");

        var chatDiv = document.getElementById('chatDiv');
        var messages = $("#messages");
        var updateScroll = true;

        if (messages.outerHeight() - chatDiv.scrollTop > chatDiv.offsetHeight) {
        	updateScroll = false;
        }
        console.log(localParticipant)
        var localUser = localParticipant.thumbnailId.replace("_webcam", "").replace("video-", "");
        if (room === roomName && user === localUser) { //me

            var li = document.createElement('li');
            li.className = "list-row list-row--has-primary list-row--has-separator";
            var div1 = document.createElement("div1");
            div1.className = "list-secondary-tile";
            var img = document.createElement("img");
            img.className = "list-primary-tile__img";
            img.setAttribute("src", "./img/kurento.png");
            var div2 = document.createElement('div');
            div2.className = "list-content-tile list-content-tile--two-lines";
            var strong = document.createElement('strong');
            strong.innerHTML = user;
            var span = document.createElement('span');
            span.innerHTML = message;
            div2.appendChild(strong);
            div2.appendChild(span);
            div1.appendChild(img);
            li.appendChild(div1);
            li.appendChild(div2);
            ul[0].appendChild(li);

//               <li class="list-row list-row--has-primary list-row--has-separator">
//                        <div class="list-secondary-tile">
//                            <img class="list-primary-tile__img" src="./img/kurento.png">
//                        </div>
//
//                        <div class="list-content-tile list-content-tile--two-lines">
//                            <strong>User 1</strong>
//                            <span>.............................</span>
//                        </div>
//                    </li>


        } else {//others

            var li = document.createElement('li');
            li.className = "list-row list-row--has-primary list-row--has-separator";
            var div1 = document.createElement("div1");
            div1.className = "list-primary-tile";
            var img = document.createElement("img");
            img.className = "list-primary-tile__img";
            img.setAttribute("src", "./img/kurento.png");
            var div2 = document.createElement('div');
            div2.className = "list-content-tile list-content-tile--two-lines";
            var strong = document.createElement('strong');
            strong.innerHTML = user;
            var span = document.createElement('span');
            span.innerHTML = message;
            div2.appendChild(strong);
            div2.appendChild(span);
            div1.appendChild(img);
            li.appendChild(div1);
            li.appendChild(div2);
            ul[0].appendChild(li);
            autoOpenChat();

//                 <li class="list-row list-row--has-primary list-row--has-separator">
//                        <div class="list-primary-tile">
//                            <img class="list-primary-tile__img" src="./img/kurento.png">
//                        </div>
//
//                        <div class="list-content-tile list-content-tile--two-lines">
//                            <strong>User 2</strong>
//                            <span>.............................</span>
//                        </div>
//                    </li>
        }
        
        if (updateScroll) {
        	chatDiv.scrollTop = messages.outerHeight();
        }
    };

    this.showError = function ($window, LxNotificationService, e) {
        if (displayingRelogin) {
            console.warn('Already displaying an alert that leads to relogin');
            return false;
          }
        displayingRelogin = true;
        that.removeParticipants();
        LxNotificationService.alert('Error!', e.error.message, 'Reconnect', function(answer) {
        	displayingRelogin = false;
            $window.location.href = '/';
        });
    };
    
    this.forceClose = function ($window, LxNotificationService, msg) {
        if (displayingRelogin) {
            console.warn('Already displaying an alert that leads to relogin');
            return false;
          }
        displayingRelogin = true;
        that.removeParticipants();
        LxNotificationService.alert('Warning!', msg, 'Reload', function(answer) {
        	displayingRelogin = false;
            $window.location.href = '/';
        });
    };
    
    this.alertMediaError = function ($window, LxNotificationService, msg, callback) {
        if (displayingRelogin) {
            console.warn('Already displaying an alert that leads to relogin');
            return false;
          }
    	LxNotificationService.confirm('Warning!', 'Server media error: ' + msg
    			+ ". Please reconnect.", { cancel:'Disagree', ok:'Agree' }, 
    			function(answer) {
    	            console.log("User agrees upon media error: " + answer);
    	            if (answer) {
    	            	that.removeParticipants();
    	                $window.location.href = '/';
    	            }
    	            if (typeof callback === "function") {
    	            	callback(answer);
    	            }
    			});
	};

    this.streamSpeaking = function(participantId) {
    	if (participants[participantId.participantId] != undefined)
    		document.getElementById("speaker" + participants[participantId.participantId].thumbnailId).style.display='';
    }

    this.streamStoppedSpeaking = function(participantId) {
    	if (participants[participantId.participantId] != undefined)
    		document.getElementById("speaker" + participants[participantId.participantId].thumbnailId).style.display = "none";
    }

    this.updateMainSpeaker = function(participantId) {
    	if (participants[participantId.participantId] != undefined) {
    		if (mainSpeaker)
    			updateMainParticipant(participants[participantId.participantId]);
    	}
    }
}