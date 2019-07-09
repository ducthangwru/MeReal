//getting dom elements
var divSelectRoom = document.getElementById("selectRoom")
var divConsultingRoom = document.getElementById("consultingRoom")
var inputRoomNumber = document.getElementById("roomNumber")
var btnGoRoom = document.getElementById("goRoom")
var localVideo = document.getElementById("localVideo")
localVideo.muted = true
var remoteVideo = document.getElementById("remoteVideo")

// variables
var roomNumber
var localStream
var remoteStream
var rtcPeerConnection = []
var iceServers = {
    'iceServers': [
        {url:'stun:stun.l.google.com:19302'},
        {url:'stun:stun1.l.google.com:19302'},
        {url:'stun:stun2.l.google.com:19302'},
        {url:'stun:stun3.l.google.com:19302'},
        {url:'stun:stun4.l.google.com:19302'},
    ]
}
var streamConstraints = { audio: true, video: true }
var isCaller

// Let's do this
var socket = io();

btnGoRoom.onclick = function () {
    if (inputRoomNumber.value === '') {
        alert("Please type a room number")
    } else {
        roomNumber = inputRoomNumber.value;
        socket.emit('joinroom', roomNumber);
        divSelectRoom.style = "display: none;"
        divConsultingRoom.style = "display: block;"
    }
};

// message handlers
socket.on('created', function (room) {
    navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
        localStream = stream
        localVideo.srcObject = stream
        isCaller = true
    }).catch(function (e) {
        console.log('An error ocurred when accessing media devices', e)
    });
});

socket.on('joined', function (data) {
    $('#listView').append(`<p>${data.id}</p>`)
    socket.emit('ready', data.room)
    // navigator.mediaDevices.getUserMedia(streamConstraints).then(function (stream) {
    //     localStream = stream
    //     localVideo.srcObject = stream
    //     socket.emit('ready', roomNumber)
    // }).catch(function (e) {
    //     console.log('An error ocurred when accessing media devices', e)
    // });
});

socket.on('candidate', function (event) {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });
    rtcPeerConnection[rtcPeerConnection.length-1].addIceCandidate(candidate)
});

socket.on('ready', function () {
    if (isCaller) {
        rtcPeerConnection.push(new RTCPeerConnection(iceServers))
        rtcPeerConnection[rtcPeerConnection.length-1].onicecandidate = onIceCandidate
        rtcPeerConnection[rtcPeerConnection.length-1].ontrack = onAddStream
        if(localStream)
        {
            rtcPeerConnection[rtcPeerConnection.length-1].addTrack(localStream.getTracks()[0], localStream)
            rtcPeerConnection[rtcPeerConnection.length-1].addTrack(localStream.getTracks()[1], localStream)
        }
      
        rtcPeerConnection[rtcPeerConnection.length-1].createOffer()
            .then(sessionDescription => {
                rtcPeerConnection[rtcPeerConnection.length-1].setLocalDescription(sessionDescription)
                socket.emit('offer', {
                    type: 'offer',
                    sdp: sessionDescription,
                    room: roomNumber
                });
            })
            .catch(error => {
                console.log(error)
            })
    }
});

socket.on('offer', function (event) {
    if (!isCaller) {
        rtcPeerConnection.push(new RTCPeerConnection(iceServers))
        rtcPeerConnection[rtcPeerConnection.length-1].onicecandidate = onIceCandidate
        rtcPeerConnection[rtcPeerConnection.length-1].ontrack = onAddStream;
        if(localStream)
        {
            rtcPeerConnection[rtcPeerConnection.length-1].addTrack(localStream.getTracks()[0], localStream)
            rtcPeerConnection[rtcPeerConnection.length-1].addTrack(localStream.getTracks()[1], localStream)
        }
      
        console.log(rtcPeerConnection)
        rtcPeerConnection[0].setRemoteDescription(new RTCSessionDescription(event))
        rtcPeerConnection[rtcPeerConnection.length-1].createAnswer()
            .then(sessionDescription => {
                rtcPeerConnection[rtcPeerConnection.length-1].setLocalDescription(sessionDescription);
                socket.emit('answer', {
                    type: 'answer',
                    sdp: sessionDescription,
                    room: roomNumber
                });
            })
            .catch(error => {
                console.log(error)
            })
    }
});

socket.on('answer', function (event) {
    rtcPeerConnection[0].setRemoteDescription(new RTCSessionDescription(event))
})

// handler functions
function onIceCandidate(event) {
    if (event.candidate) {
        console.log('sending ice candidate');
        socket.emit('candidate', {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: roomNumber
        })
    }
}

function onAddStream(event) {
    remoteVideo.srcObject = event.streams[0]
    remoteStream = event.stream
}