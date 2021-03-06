/* WebRTC PubNub Controller
 * Author: Kevin Gleason
 * Date: July 15, 2015
 * Description: A wrapper library for the PubNub WebRTC SDK to make simple video
 *              functions a breeze to implement.
 *
 * TODO: make getVideoElement a native non-jQuery function
 *
 */
var token = localStorage.getItem('token');
var u = JSON.parse(localStorage.getItem('user'));
var request;

$.cloudinary.config({ cloud_name: 'ducthangwru', api_key: '581286618712862', api_secret : 'VxHXdcMzuF0KiNnSy4dRSrQqRQA'});

(function(){
	
var CONTROLLER = window.CONTROLLER = function(phone, serverFunc){
	if (!window.phone) window.phone = phone
	var ctrlChan  = controlChannel(phone.number())
	var pubnub    = phone.pubnub
	var userArray = []
	subscribe()
	
	var CONTROLLER = function(){}
	
	// Get the control version of a users channel
	function controlChannel(number){
		return number + "-ctrl"
	}
	
	// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	// Setup Phone and Session callbacks.
	// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	var readycb   = function(){}
	var unablecb  = function(){}
    var receivecb = function(session){}
    var videotogglecb = function(session, isEnabled){}
    var audiotogglecb = function(session, isEnabled){}
    
    CONTROLLER.ready   = function(cb) { readycb   = cb }
    CONTROLLER.unable  = function(cb) { unablecb  = cb }
    CONTROLLER.receive = function(cb) { receivecb = cb }
    CONTROLLER.videoToggled = function(cb) { videotogglecb = cb }
    CONTROLLER.audioToggled = function(cb) { audiotogglecb = cb }
	
	phone.ready(function(){ readycb() })
	phone.unable(function(){ unablecb() })
	phone.receive(function(session){
		manage_users(session)
		receivecb(session)
	})
	
	/* Require some boolean form of authentication to accept a call
	var authcb    = function(){} 
	CONTROLLER.answerCall = function(session, auth, cb){
		auth(acceptCall(session, cb), session) 
	}
	
	function acceptCall(session, cb){ // Return function bound to session that needs a boolean.
		return function(accept) {
			if (accept) cb(session) 
			else phone.hangup(session.number)  
		}
	}*/
	
	// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	// Setup broadcasting, your screen to all.
	// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
	var streamreceivecb = function(m){}
	var streamprescb    = function(m){}
	var stream_name = ""
	
	
	CONTROLLER.streamPresence = function(cb){ streamprescb    = cb }
	CONTROLLER.streamReceive  = function(cb){ streamreceivecb = cb }
	
	function broadcast(vid){
	    var video = document.createElement('video')
        video.srcObject    = phone.mystream
        video.volume = 0.0
        video.play()
	    video.setAttribute( 'autoplay', 'autoplay' )
	    video.setAttribute( 'data-number', phone.number() )
	    vid.style.cssText ="-moz-transform: scale(-1, 1)  \
						 	-webkit-transform: scale(-1, 1)  -o-transform: scale(-1, 1)  \
							transform: scale(-1, 1)  filter: FlipH "
		vid.appendChild(video)
    } 
    
    function stream_subscribe(name){
	    var ch = (name ? name : phone.number()) + "-stream" 
	    pubnub.subscribe({
            channel    : ch,
            message    : streamreceivecb,
            presence   : streamprescb,
            connect    : function() { 
				stream_name = ch
				console.log("Streaming channel " + ch) 
			}
        }) 
    }
    
    CONTROLLER.stream = function(){
	    stream_subscribe() 
    }
    
    CONTROLLER.joinStream = function(name){
	    stream_subscribe(name) 
	    publishCtrl(controlChannel(name), "userJoin", phone.number()) 
    }
    
    CONTROLLER.leaveStream = function(name){
	    var ch = (name ? name : phone.number()) + "-stream" 
	    pubnub.unsubscribe({
            channel    : ch,
        }) 
    }
    
    CONTROLLER.send = function( message, number ) {
        if (phone.oneway) return stream_message(message) 
        phone.send(message, number) 
    } 
    
    function stream_message(message){
	    if (!stream_name) return  // Not in a stream
		pubnub.publish({ 
			channel: stream_name,
			message: msg,
			callback : function(m){console.log(m)}
		}) 
    }
    
    
    // Give it a div and it will set up the thumbnail image
    CONTROLLER.addLocalStream = function(streamHolder){
	    broadcast(streamHolder) 
    } 
	
	CONTROLLER.dial = function(number, servers){ // Authenticate here??
		if (!servers && serverFunc) servers=serverFunc() 
		var session = phone.dial(number, servers)  // Dial Number
		if (!session) return  // No Duplicate Dialing Allowed
	} 
	
	CONTROLLER.hangup = function(number){
		if (number) {
			if (phone.oneway) CONTROLLER.leaveStream(number) 
			phone.hangup(number) 
			return publishCtrl(controlChannel(number), "userLeave", phone.number())
		} 
		if (phone.oneway) CONTROLLER.leaveStream() 
		phone.hangup() 
		for (var i=0 ; i < userArray.length ; i++) {
			var cChan = controlChannel(userArray[i].number) 
			publishCtrl(cChan, "userLeave", phone.number()) 
		}
	} 
	
	CONTROLLER.toggleAudio = function(){
		var audio = false 
		var audioTracks = window.phone.mystream.getAudioTracks() 
		for (var i = 0, l = audioTracks.length ; i < l ; i++) {
			audioTracks[i].enabled = !audioTracks[i].enabled 
			audio = audioTracks[i].enabled 
		}
		publishCtrlAll("userAudio", {user : phone.number(), audio:audio})  // Stream false if paused
		return audio 
	} 
	
	CONTROLLER.toggleVideo = function(){
		var video = false 
		var videoTracks = window.phone.mystream.getVideoTracks() 
		for (var i = 0, l = videoTracks.length ; i < l ; i++) {
			videoTracks[i].enabled = !videoTracks[i].enabled 
			video = videoTracks[i].enabled 
		}
		publishCtrlAll("userVideo", {user : phone.number(), video:video})  // Stream false if paused
		return video 
	} 
	
	CONTROLLER.isOnline = function(number, cb){
		pubnub.here_now({
			channel : number,
			callback : function(m){
				console.log(m)   // TODO Comment out
				cb(m.occupancy != 0) 
			}
		}) 
	} 
	
	CONTROLLER.isStreaming = function(number, cb){
		CONTROLLER.isOnline(number+"-stream", cb) 
	} 
	
	CONTROLLER.getVideoElement = function(number){
		return $('*[data-number="'+number+'"]') 
	}
	
	function manage_users(session){
		if (session.number == phone.number()) return  	// Do nothing if it is self.
		var idx = findWithAttr(userArray, "number", session.number)  // Find session by number
		if (session.closed){
			if (idx != -1) userArray.splice(idx, 1)[0]  // User leaving
		} else {  				// New User added to stream/group
			if (idx == -1) {  	// Tell everyone in array of new user first, then add to array. 
				if (!phone.oneway) publishCtrlAll("userJoin", session.number) 
				userArray.push(session) 
			}
		}
		userArray = userArray.filter(function(s){ return !s.closed  })  // Clean to only open talks
		// console.log(userArray) 
	}
	
	function add_to_stream(number){
		if (serverFunc) phone.dial(number, serverFunc()) 
		else phone.dial(number) 
	}
	
	function add_to_group(number){
		var session = serverFunc ? phone.dial(number, serverFunc()) : phone.dial(number)  // Dial Number
		if (!session) return  	// No Dupelicate Dialing Allowed
	}
	
	function publishCtrlAll(type, data){
		for (var i=0 ; i < userArray.length ; i++) {
			var cChan = controlChannel(userArray[i].number) 
			publishCtrl(cChan, type, data) 
		}
	}
	
	function publishCtrl(ch, type, data){
		// console.log("Pub to " + ch) 
		var msg = {type: type, data: data} 
		pubnub.publish({ 
			channel: ch,
			message: msg,
			callback : function(m){console.log(m)}
		}) 
	}
	
	function subscribe(){
		pubnub.subscribe({
            channel    : ctrlChan,
            message    : receive,
            connect    : function() {} // console.log("Subscribed to " + ctrlChan)  }
        }) 
	}
	
	function receive(m){
		switch(m.type) {
		case "userCall":
			callAuth(m.data) 
			break 
		case "userJoin":
			if (phone.oneway){ add_to_stream(m.data)  }// JOIN STREAM HERE!
			else add_to_group(m.data) 
			break 
		case "userLeave":
			var idx = findWithAttr(userArray, "number", m.data) 
			if (idx != -1) userArray.splice(idx, 1)[0] 
			break 
		case "userVideo":
			var idx = findWithAttr(userArray, "number", m.data.user) 
			var vidEnabled = m.data.video 
			if (idx != -1) videotogglecb(userArray[idx], vidEnabled) 
			break 
		case "userAudio":
			var idx = findWithAttr(userArray, "number", m.data.user) 
			var audEnabled = m.data.audio 
			if (idx != -1) audiotogglecb(userArray[idx], audEnabled) 
			break 
		}
		// console.log(m) 
	}
	
	function findWithAttr(array, attr, value) {
	    for(var i = 0 ; i < array.length ; i += 1) {
	        if(array[i][attr] === value) {
	            return i 
	        }
	    }
	    return -1 
	}
	
	return CONTROLLER 
}

})() 



var video_out  = document.getElementById("vid-box") 
var embed_code = document.getElementById("embed-code") 
var embed_demo = document.getElementById("embed-demo") 
var here_now   = document.getElementById('here-now') 
var stream_info= document.getElementById('stream-info') 
var end_stream = document.getElementById('end') 
var pub_key = "pub-c-6265d3da-b817-441c-8722-d5aa3b0c94b2"
var sub_key = "sub-c-99870162-9da7-11e9-9aea-96d77c97c6d4"
var streamName 

function stream() {
	//Kiểm tra xem user đó có được livestream ko
	callAPI('userrequest/check', 'GET', 'stream=played', token, null, (res) => {
		if(!res.success)
		{
			alert(res.error)
		}
		else
		{
			$('#btnStart').show()
			$('#btnStream').hide()
			$('#btnWatch').hide()
			request = res.data
			streamName = "a" //Tên phòng
			var phone = window.phone = PHONE({
				number        : streamName, // listen on username line else random
				publish_key   : pub_key, // Your Pub Key
				subscribe_key : sub_key, // Your Sub Key
				oneway        : true,
				broadcast     : true,
			})
			//phone.debug(function(m){ console.log(m)  })
			var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers) 
			ctrl.ready(function(){
				//form.streamname.style.background="#55ff5b"
				//form.streamname.value = phone.number()
		//		form.stream_submit.hidden="true"  
				ctrl.addLocalStream(video_out)
				ctrl.stream()
				stream_info.hidden=false
				end_stream.hidden =false
				//addLog("Đang stream đến phòng " + streamName) 
			})

			ctrl.receive(function(session){
				session.connected(function(session){ 
					//addLog(session.number + " đã tham gia")  
				})
				session.ended(function(session) { 
					//addLog(session.number + " đã rời đi")
					console.log(session)
				})
			})

			ctrl.streamPresence(function(m){
				here_now.innerHTML=m.occupancy
				//addLog(m.occupancy + " đang xem")
			})
		}
	})
	return false
}

function watch(form){
	var num = "a"
	var phone = window.phone = PHONE({
	    number        : "Viewer" + Math.floor(Math.random()*100), // listen on username line else random
		publish_key   : pub_key, // Your Pub Key
		subscribe_key : sub_key, // Your Sub Key
	    oneway        : true
	})
	
	var ctrl = window.ctrl = CONTROLLER(phone, get_xirsys_servers)
	ctrl.ready(function(){
		ctrl.isStreaming(num, function(isOn){
			if (isOn) 
			{
				ctrl.joinStream(num)
				$('#btnWatch').hide()
			}
			else alert("Người dùng không livestream")
		})
		//addLog("Đang tham gia phòng stream")
	})

	ctrl.receive(function(session){
	    session.connected(function(session){ 
            video_out.appendChild(session.video)
            //addLog(session.number + " đã tham gia")
            stream_info.hidden=false
		})
		
	    session.ended(function(session) { 
			//addLog(session.number + " đã rời đi") 
		})
	})

	ctrl.streamPresence(function(m){
		here_now.innerHTML=m.occupancy
		//addLog(m.occupancy + " số người đang xem")
	})
	return false
}

function getVideo(number){
	return $('*[data-number="'+number+'"]')
}

function addLog(log){
	$('#logs').append("<p>"+log+"</p>")
}

function end(){
	if (!window.phone) return
	ctrl.hangup() 
	$('#btnStream').show()
	$('#btnStart').hide()
	$('#btnWatch').hide()
	stream_info.hidden = true
    video_out.innerHTML = ""
//	phone.pubnub.unsubscribe()  // unsubscribe all?
}

// function genEmbed(w,h){
// 	if (!streamName) return 
// 	var url = "https://kevingleason.me/SimpleRTC/embed.html?stream=" + streamName 
// 	var embed    = document.createElement('iframe') 
// 	embed.src    = url 
// 	embed.width  = w 
// 	embed.height = h 
// 	embed.setAttribute("frameborder", 0) 
// 	embed_demo.innerHTML = "<a href='embed_demo.html?stream="+streamName+"&width="+w+"&height="+h+"'>Embed Demo</a>" 
// 	embed_code.innerHTML = 'Embed Code: ' 
// 	embed_code.appendChild(document.createTextNode(embed.outerHTML)) 
// }

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Request fresh TURN servers from XirSys - Need to explain.
// room=default&application=default&domain=kevingleason.me&ident=gleasonk&secret=b9066b5e-1f75-11e5-866a-c400956a1e19
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
function get_xirsys_servers() {
	var servers
	
    $.ajax({
        type: 'POST',
        url: 'https://service.xirsys.com/ice',
        data: {
            room: 'default',
            application: 'default',
            domain: 'kevingleason.me',
            ident: 'gleasonk',
            secret: 'b9066b5e-1f75-11e5-866a-c400956a1e19',
            secure: 1,
        },
        success: function(res) {
	        console.log(res)
            res = JSON.parse(res)
            if (!res.e) servers = res.d.iceServers
        },
        async: false
    })
    return servers
}

function errWrap(fxn){
	try {
		return fxn()
	} catch(err) {
		alert("WebRTC is currently only supported by Chrome, Opera, and Firefox")
		return false
	}
}

$(document).ready(function() {
	document.title = 'MeReal - Web Livestream tương tác'
	var socket = io(`${window.location.href}?token=${localStorage.getItem('token')}`)
	var u = JSON.parse(localStorage.getItem('user'))
	var index = 0
	var role = u.role
	getProfile(localStorage.getItem('token'), '', (data) => {
		if(data)
		{
			localStorage.setItem('user', JSON.stringify(data))
			u = JSON.parse(localStorage.getItem('user'))

			$('#spanFullname').text(u.fullname)
			$('#divFullname').attr('data-name', u.fullname)
			$('#pUsername').html(`${u.username}<small>${moment(u.createdAt).format('DD/MM/YYYY HH:mm:ss')}</small>`)
		}
	})
	
	$('.textavatar').textAvatar({width: 90, height : 90})
	$('#btnLogout').click(() => {
		localStorage.setItem('token', '')
		localStorage.setItem('user', '')
		window.location.href = '/logout'
	})

	// $('#divChat').append(`<div>${u.username} đã tham gia</div>`)
	// socket.on('joined', function (user) {
	// 	$('#divChat').append(`<div>${user.username} đã tham gia</div>`)
	// })

	callAPI('userrequest/check', 'GET', '', token, null, (res) => {
		if(!res.success)
		{
			$('#btnStream').hide()
			$('#btnStart').hide()
			$('#btnWatch').show()
		}
		else
		{
			$('#btnStream').show()
			$('#btnWatch').hide()
			request = res.data
		}
	})

	socket.on('received', function (data) {
		if(data.user._id == u._id)
		{
			$('#divChat').append(`
				<div class="direct-chat-msg right">
					<div class="direct-chat-info clearfix">
						<span class="direct-chat-name pull-right">${data.user.username}</span>
						<span class="direct-chat-timestamp pull-left">${data.data.time}</span>
					</div>

					<div class="direct-chat-text">${data.data.msg}</div>
				</div>
			`)
		}
		else
		{
			$('#divChat').append(`
				<div class="direct-chat-msg left">
					<div class="direct-chat-info clearfix">
						<span class="direct-chat-name pull-right">${data.user.username}</span>
						<span class="direct-chat-timestamp pull-left">${data.data.time}</span>
					</div>

					<div class="direct-chat-text">${data.data.msg}</div>
				</div>
			`)
		}
		
		$("#divChat").animate({ scrollTop: $('#divChat').prop("scrollHeight")}, 1000)
	})

	socket.on('start1', function (data) {
		$('#divContent').append(data)
	})

	socket.on('contentQuestion', function (data) {
		$('#labelQuestion').text(`Câu hỏi: ${data.index + 1}`)
		$('#divContent').html(data.content)
	})

	socket.on('winner', function (data) {
		$('#divModalWinner').html('')
		for (let i = 0; i < data.length; i++) {
			$('#divModalWinner').append(`
				<img src="${data[i].user.avatar}" height="50" width="50">
				<label class="label label-success" style="margin-left : 5%">${i+1}. ${data[i].user.username}</label>
				<br>
			`)
		}

		$('#modalWinner').modal('show')
	})

	socket.on('contentAnswer', function (data) {
		$('#divAnswer').append(data.content)
		$(`input[name="${data.data.question._id}"]:radio`).change(function(){
			callAPI('userHistory', 'POST', '', token, {
				user_request :  data.request._id,
				question : data.data.question._id,
				answer : this.value
			}, (res) => {})

			for (let i = 0; i < data.data.answers.length; i++) {
				$(`#r_${data.data.answers[i]._id}`).prop('disabled', true)
			}

			$(`#r_${this.value}`).prop('disabled', false)
		})

		countDown(data.request._id, true, data.data.question._id)
	})

	$("#inputMessage").on('keyup', function (e) {
		if (e.keyCode == 13) {
			sendMessage()
		}
	})

	$('#btnSend').click(() => {
		sendMessage()
	})

	$('#btnStart').click(() => {
		//Nếu mà click vào nút bắt đầu thì ẩn nó đi hiển thị nút Câu hỏi tiếp theo
		if($('#btnStart').attr('data-name') == 'start')
		{
			$('#btnStart').attr('data-name', 'next')
			$('#btnStart').text('Tiếp')
			let start1 = `<h3>${request.desc}</h3> <br> <p>Giải thưởng: ${request.gift.name} trị giá: ${numeral(request.gift.price).format('0,0')} VNĐ</p>`
			$('#divContent').append(start1)
			socket.emit('start1', start1)
		}
		else if($('#btnStart').attr('data-name') == 'next')
		{
			callAPI('question/details', 'GET', `user_request=${request._id}&index=${index}`, token, null, (res) => {
				if(res.success)
				{
					index = res.data.index

					if(index == res.data.length)
					{
						$('#btnStart').attr('data-name', 'top_win')
						$('#btnStart').text('Danh sách trúng thưởng')
					}
					else
					{
						$('#labelQuestion').text(`Câu hỏi: ${index + 1}`)
						$('#divContent').html('')
						let contentQuestion = `<h3>${res.data.question.content}</h3> <p>Gợi ý: ${res.data.question.suggest}</p>`
						$('#divContent').html(contentQuestion)

						socket.emit('contentQuestion', {content : contentQuestion, index : index})

						$('#divAnswer').html('')
						for (let i = 0; i < res.data.answers.length; i++) {
							$('#divAnswer').append(`<input type="radio" id="r_${res.data.answers[i]._id}" name="${res.data.question._id}" value="${res.data.answers[i]._id}">${i + 1}.${res.data.answers[i].content}<br>`)
						}

						socket.emit('contentAnswer', {content : $('#divAnswer').html(), data : res.data, request : request})
						
						index++

						countDown(null, null, res.data.question._id)
					}
				}
			})
		}
		else if($('#btnStart').attr('data-name') == 'top_win')
		{
			callAPI('userRequest/winner', 'GET', `user_request=${request._id}`, token, null, (res) => {
				if(res.success)
				{
					$('#divModalWinner').html('')
					for (let i = 0; i < res.data.length; i++) {
						$('#divModalWinner').append(`
							<img src="${res.data[i].user.avatar}" height="50" width="50">
							<label class="label label-success" style="margin-left : 5%">${i+1}. ${res.data[i].user.username}</label>
							<br>
						`)
					}

					socket.emit('winner', res.data)

					$('#modalWinner').modal('show')
				}
			})
		}
	})

	function countDown(request_id, isClient, question_id) {
		var distance = 10000

		callAPI('userHistory/step', 'GET', `user_request=${request_id ? request_id : request._id}`, token, null, (res) => {
			if(res.success)
			{
				$('#labelScore').text(`Điểm: ${res.data.score}/${res.data.total_question}`)
			}
		})

		var x = setInterval(function() {
			$('#btnStart').hide()
			$('#labelTime').text(`${distance / 1000} s`)
			distance -= 1000
			if (distance < 0) {
				$('#divContent').html('Hết giờ!')
				$('#divAnswer').html('')
				
				if(!isClient)
					$('#btnStart').show()

				callAPI('answer/byQuestion', 'GET', `_id=${question_id}`, token, null, (res) => {
					if(res.success)
					{
						$('#divModal').html('')
						
						for (let i = 0; i < res.data.length; i++) {
							$('#divModal').append(`<label class="label label-${res.data[i].is_true ? 'success' : 'danger'}">${i + 1}. ${res.data[i].content} -- ${res.data[i].num} lựa chọn</label><br>`)
						}
						$('#modalEndAnswer').modal('show')
					}
				})

				callAPI('userHistory/step', 'GET', `user_request=${request_id ? request_id : request._id}`, token, null, (res) => {
					if(res.success)
					{
						$('#labelScore').text(`Điểm: ${res.data.score}/${res.data.total_question}`)
					}
				})

				clearInterval(x)
			}
		  }, 1000)
	}

	function sendMessage() {
		let time = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
		let msg = $('#inputMessage').val()

		if(msg)
		{
			$('#divChat').append(`
				<div class="direct-chat-msg right">
					<div class="direct-chat-info clearfix">
						<span class="direct-chat-name pull-right">${u.username}</span>
						<span class="direct-chat-timestamp pull-left">${time}</span>
					</div>

					<div class="direct-chat-text">${msg}</div>
				</div>
			`)
			
			socket.emit('send', {msg, time})

			$('#inputMessage').val('')
			$("#divChat").animate({ scrollTop: $('#divChat').prop("scrollHeight")}, 500)
		}
	}

	//Nếu nó là user
	if(role == 1)
	{
		callAPI('userrequest/checkWhoLive', 'GET', '', token, null, (res) => {
			if(res.success)
			{
				$('#divMenu').html(`
					<div class="row">
						<div class="col-sm-12" style="text-align:center; margin-top:1%">
							<img src="${res.data.user.avatar ? res.data.user.avatar : '/noimg.png'}" alt="Smiley face" width="50px" height="50px">
						</div>

						<div class="col-sm-12" style="text-align:center; margin-top:1%">
							<p style="color:white">${res.data.user.username}</p>
						</div> <br>

						<div class="col-sm-12" style="text-align:center; margin-top:1%">
							<img src="${res.data.gift.image ? res.data.gift.image : '/noimg.png'}" alt="Smiley face" width="100px" height="100px">
						</div>

						<div class="col-sm-12" style="text-align:center; margin-top:1%;">
							<p style="color:white">${res.data.gift.name}</p>
							<p style="color:white">Trị giá: ${numeral(res.data.gift.price).format('0,0')} VNĐ</p>
							<p style="color:white">Trao cho: ${numeral(res.data.top_win).format('0,0')} người điểm cao nhất</p>
						</div> <br>
					</div>
				`)

				console.log('a')
			}
		})

		$('#btnStream').hide()
		$('#ulMenu').append(`<li><a href="/history"><i class="fa fa-history"></i> <span>Lịch sử chơi<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/profile"><i class="fa fa-wrench"></i> <span>Tài khoản<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/logout"><i class="fa fa-share"></i> <span>Đăng xuất</span></a></li>`)
	}
	//Nếu nó là agent
	else if(role == 2)
	{
		$('#ulMenu').append(`<li><a href="/gift"><i class="fa fa-gift"></i> <span>Quản lý quà tặng<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/question"><i class="fa fa-question"></i> <span>Quản lý câu hỏi<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/request"><i class="fa fa-book"></i> <span>Quản lý yêu cầu<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/profile"><i class="fa fa-wrench"></i> <span>Tài khoản<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/logout"><i class="fa fa-share"></i> <span>Đăng xuất</span></a></li>`)
	}
	else if(role == 3)
	{
		$('#btnStream').hide()
		$('#ulMenu').append(`<li><a href="/request"><i class="fa fa-book"></i> <span>Quản lý yêu cầu<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/user"><i class="fa fa-users"></i> <span>Quản lý người dùng<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/time"><i class="fa fa-calendar"></i> <span>Cấu hình khung giờ<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/profile"><i class="fa fa-wrench"></i> <span>Tài khoản<span></span></a></li>`)
		$('#ulMenu').append(`<li><a href="/logout"><i class="fa fa-share"></i> <span>Đăng xuất</span></a></li>`)
	}
})