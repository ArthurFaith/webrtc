/*
 * 会议室对象
 * @author 王杰
 */

taojin_room.service('ServiceRoom', function () {

    var kurento;//kurento对象
    var roomName;//会议室名称
    var userName;//登录名
    var localStream;//流对象

    this.getKurento = function () {
        return kurento;
    };
	
    this.getRoomName = function () {
        return roomName;
    };

    this.setKurento = function (value) {
        kurento = value;
    };

    this.setRoomName = function (value) {
        roomName = value;
    };

    this.getLocalStream = function () {
        return localStream;
    };

    this.setLocalStream = function (value) {
        localStream = value;
    };

    this.getUserName = function () {
        return userName;
    };

    this.setUserName = function (value) {
        userName = value;
    };
});
