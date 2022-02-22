import React, { useContext, useEffect } from 'react';
import { Button, TextField, Grid, Container, Paper } from '@material-ui/core';
import { Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../Context';
import { useStore } from '../store/store';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '20px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 10,
  },
  padding: {
    padding: 10,
  },
  paper: {
    padding: '10px 10px',
    border: '2px solid black',
  },
}));

const Sidebar = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser, setChatStore} = useContext(SocketContext);
  const classes = useStyles();

  const {chatStore, chatModelStore} = useStore();
  const {chatModel} = chatModelStore;


  useEffect(() => {
    console.log("am intrat in use efects la siderbar me = " + me);
    if(me){
      connectToChat();
    }

    return () => { //asta se apeleaza cand se iese din componenta
        chatStore.stopHubConnection();
    }
}, [me] ); 

function connectToChat(){
    chatModel.callerSocketId = me;
    chatModel.callerName = name;
    console.log("ma conectez la SignalR me = " + me);
    chatStore.createHubConnection(chatModel, callUser);
    chatStore.hubConnection.start().catch(error => console.log('chat hub nu s-a putut conecta : ', error))
        .then(result => {
          console.log("SignalR s-a conectat socketId= " + chatModel.callerSocketId + ' nume=' + chatModel.callerName);
          setChatStore(chatStore);
        });


}

  function callMedic(){
    try {
      console.log("sun medicul , my name = " + name);
      chatModel.callerName = name;
      //ar trebui verificat daca intr-adevar am deschisa conexiunea si sa dau mesaj de eroare
      chatStore.hubConnection.invoke('NeedAResponder', chatModel ); 
    } catch (error) {
      console.log(error);
    }
  }
 
  return (
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
          <Grid item xs={6} md={6} className={classes.padding}>
              {/* <Typography gutterBottom variant="h9">My name</Typography> */}
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={6} md={6} className={classes.padding}>
              {callAccepted && !callEnded ? (
                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                 Stop!
                </Button>
              ) : (
                <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth className={classes.margin}
                        onClick={() => callMedic() } >
                  Suna Medicul !
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default Sidebar;
