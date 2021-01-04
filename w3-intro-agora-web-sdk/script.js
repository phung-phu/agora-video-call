let handleFail = function(err) {
    console.log(err);
}

let remoteContainer = document.querySelector('#remote-container');

function addVideoStream(streamId) {
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform="rotateY(180deg)";
    remoteContainer.appendChild(streamDiv);
}

function removeVideoStream (evt) {
    let stream = evt.stream;
    stream.stop();
    let remDiv=document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);

    console.log("Remote stream is removed " + stream.getId());
}

document.querySelector('#start').onclick = function() {
    let client = AgoraRTC.createClient({
        mode: 'live',
        codec: "vp8" 
    });
    let appid = "58048dc21de24707863f51eacd1af5fc";
    let channelName = document.querySelector('#channelName').value;
    let userId;

    client.init(appid, () => console.log("success"), handleFail)

    client.join(null, channelName, null, (uid)=> {
        var localstream = AgoraRTC.createStream({
            video: true,
            audio: true
        });

        localstream.init(function() {
            localstream.play('me');
            client.publish(localstream);
        });
        console.log('Local stream initialized');
    }, handleFail);

    client.on('stream-added', function(event) {
        client.subscribe(event.stream, handleFail);
    });

    client.on('stream-subscribed', function(event) {
        let stream = event.stream;
        addVideoStream(stream.getId());
        stream.play(stream.getId());
    });

    client.on('stream-removed',removeVideoStream);
    client.on('peer-leave',removeVideoStream);

}

