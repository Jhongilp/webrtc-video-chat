import React, { useRef, useEffect } from "react";

const Room = () => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const userStream = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true})
    .then( stream => {
      userVideo.current.srcObject = stream;
      userStream.current = stream;

      socketRef.current = io.connect("/");
      socketRef.current.emit("join room", props.match.params.roomID);

      socketRef.current.on("other user", userID => {
        callUser(userID);
        otherUser.current = userID
      });

      socketRef.current.on("user joined", userID => {
        otherUser.current = userID;
      });

      socketRef.current.on("offer", handleReceiveCall);

      socketRef.current.on("answer", handleAnswer);

      socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

    })
  }, []);

  function callUser(userID) {
    peerRef.current = createPeer(userID);
    userStream.current.getTracks().forEach( track => peerRef.current.addTrack(track, userStream.current));
  }

  return (
    <div>
      <video autoPlay red={userVideo}></video>
      <video autoPlay red={partnerVideo}></video>
    </div>
  );
};

export default Room;
