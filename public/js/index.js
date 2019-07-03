function openStream() {
    const config = {audio : true, video : true}
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag)
    video.srcObject = stream
    video.play()
}

// openStream().then(stream => playStream('localStream', stream))

const peer = new Peer('someid', {
    secure: true, 
    host: 'peer-mereal.herokuapp.com/myapp', 
    port: 443,
});

peer.on('open', id => $('#myPeer').append(id))

//Người gọi
$('#btnCall').click(() => {
    const id = $('#remoteId').val()
    openStream().then(stream => {
        playStream('localStream', stream)
        const call = peer.call(id, stream)
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
})

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream)
        playStream('localStream', stream)
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    })
})