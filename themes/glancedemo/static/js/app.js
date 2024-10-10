const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const remoteAudio = document.getElementById('remoteAudio');

let localStream;
let peerConnection;

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

startCallButton.onclick = startCall;
endCallButton.onclick = endCall;

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            // Send the candidate to the other peer
            console.log('New ICE candidate:', event.candidate);
        }
    };

    peerConnection.ontrack = event => {
        remoteAudio.srcObject = event.streams[0];
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Offer sent:', offer);
    // Send the offer to the other peer via signaling server
}

async function endCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
}
