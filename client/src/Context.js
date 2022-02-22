import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import UrlStore from './store/urlStore';



const SocketContext = createContext();
const socket = io(UrlStore.urlVideoChat);


const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [myAudioNotification, setMyAudio] = useState(new Audio('/assets/CallingYou.mp3'));
  const [chatStore, setChatStore] = useState(null);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  function startAudioNotification(){
    console.log("dau drumul la sonerie, sa ma sune..." + myAudioNotification);
    myAudioNotification.play();
       // setTimeout(function(){ audio.pause(); audio.currentTime = 0;}, 10000);
  }
  function stopAudioNotification(){
    console.log("opresc soneria...")
    myAudioNotification.pause(); 
    myAudioNotification.currentTime = 0;
  }


  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => {
      setMe(id);
      console.log("client, am primit me = " + me);
      console.log("client, am primit me Id = " + id);
    });


    socket.on('callUser', ({ from, name: callerName, signal }) => {
      if(from === me){
        console.log("ma sun pe mine insusi, nu fac nimic..." + name);
        return;
      }
      startAudioNotification();
      console.log("sunt apelat de catre "+ from + " name= " +callerName);
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);


  const answerCall = () => {
    console.log("am raspuns la call, ar trebui sa se opreasca calling you");
    stopAudioNotification();
    //opresc si SignalR, sa nu se suprapuna pe acelasi webSocket cu video-chat-ul
    console.log("incerc sa opresc SignalR....");
    chatStore.stopHubConnection();
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id,callerName) => {

      console.log("client emit callUser userToCall=" + id + ", from="+ me+", callername=" + callerName + ", callAccepted="+ callAccepted);
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on('signal', (data) => {
        console.log("peer - on.signal() -> client emit callUser userToCall=" + id + ", from="+ me+", callername=" + callerName);
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name:callerName });
      });

      peer.on('stream', (currentStream) => {
        userVideo.current.srcObject = currentStream;
      });

      socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
        //am acceptaat convorbirea, hai sa opresc SignalR, sa nu se suprapuna cu video-chat-ul
        console.log("onCallAccepted -> mi s-a acceptat convorbirea, opresc SignalR");

        peer.signal(signal);

        if(chatStore){
          chatStore.stopHubConnection();
        }

      });

      connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload(); //luci TODO, de ce sa resetez totul?
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      setChatStore
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
