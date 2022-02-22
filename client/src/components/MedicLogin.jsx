import React, { useState, useContext, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
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
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
}));

const MedicLogin = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const classes = useStyles();

  const {chatStore, chatModelStore} = useStore();
  const {chatModel} = chatModelStore;


  useEffect(() => {

    return () => {
        chatStore.stopHubConnection();
    }
}, [chatStore]);

function ConnectToChat(){
    chatModel.callerSocketId = me;
    chatModel.callerName = name;

    chatStore.createHubConnection(chatModel, callUser);
    chatStore.hubConnection.start().catch(error => console.log('chat hub nu s-a putut conecta : ', error))
        .then(result => {console.log("SignalR s-a conectat" + chatModel.callerSocketId + ' nume=' + chatModel.callerName)});
}

  
 
  return (
    <Container className={classes.container} style={{ marginTop: `10px` }}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            <Grid item xs={6} md={6} className={classes.padding}>
              <Typography gutterBottom variant="h9">Medic Info</Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={6} md={6} className={classes.padding}>
                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large" />}
                      onClick= {()=> ConnectToChat()}>
                  Connect!
                </Button>

            </Grid>
            
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
};

export default MedicLogin;
