import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatModel } from "../modules/chatModel";
import UrlStore from "./urlStore";


export default class ChatStore {

    chatUrl = UrlStore.urlEmimChat;    //"http://localhost:5006/chat";

    comments: ChatModel | null  = null;
    hubConnection: HubConnection | null = null;
  
    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (myChatModel: ChatModel, callUser: (string)=>void) => {
        if (myChatModel.clinicaId) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(this.chatUrl + '?clinicaId=' + myChatModel.clinicaId)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            //this.hubConnection.start().catch(error => console.log('chat hub nu s-a putut conecta : ', error));

            this.hubConnection.on('NeedAResponder', (chatModel: ChatModel) => {
                runInAction( async () => {
                    chatModel.responderSocketId = myChatModel.callerSocketId;
                    chatModel.responderName = myChatModel.callerName;
                    try {
                        await this.hubConnection?.invoke('ResponderFound', chatModel);
                    } catch (error) {
                        console.log(error);
                    }
                });
            })

            this.hubConnection.on('ResponderFound', (chatModel: ChatModel) => {
                if(chatModel.responderSocketId && chatModel.responderName.includes("dr")){
                    //am gasit un responder, acum il apelez prin canalul de video
                    runInAction(() => {
                        callUser(chatModel.responderSocketId);
                     });
                }

            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

}