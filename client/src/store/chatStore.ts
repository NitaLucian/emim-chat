import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatModel } from "../modules/chatModel";
import UrlStore from "./urlStore";


export default class ChatStore {

    chatUrl = UrlStore.urlEmimChat;    

    comments: ChatModel | null  = null;
    hubConnection: HubConnection | null = null;
  
    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (myChatModel: ChatModel, callUser: (responderId:string, callerName:string)=>void) => {
        if (myChatModel.clinicaId) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(this.chatUrl + '?clinicaId=' + myChatModel.clinicaId)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            //this.hubConnection.start().catch(error => console.log('chat hub nu s-a putut conecta : ', error));

            this.hubConnection.on('NeedAResponder', (chatModel: ChatModel) => {
                console.log("needAResponder, callerName = "+ chatModel.callerName);
                if(chatModel.callerSocketId === myChatModel.callerSocketId){
                    console.log("am primit cererea care am emis-o tot eu, callerSocketId =" + myChatModel.callerSocketId  + " name=" + myChatModel.callerName);
                    return;
                }
                runInAction( async () => {
                    chatModel.responderSocketId = myChatModel.callerSocketId;
                    chatModel.responderName = myChatModel.callerName;
                    try {
                        console.log("trimit ca sunt disponibil...responderSocketId =" + myChatModel.callerSocketId  + " name=" + myChatModel.callerName);
                        await this.hubConnection?.invoke('ResponderFound', chatModel);
                    } catch (error) {
                        console.log(error);
                    }
                });
            })

            this.hubConnection.on('ResponderFound', (chatModel: ChatModel) => {
                console.log("am intrat in RespondeFound....-> responderId="+chatModel.responderSocketId + ", callerName="+ chatModel.callerName +", mychatModel=" +myChatModel);
                if(chatModel.responderSocketId === myChatModel.callerSocketId){
                    console.log("Vad ca m-am dat disponibil tot pe mine..., nu ma mai sun DEGEABA,  callerSocketId =" + myChatModel.callerSocketId  + " name=" + myChatModel.callerName);
                    return;
                }
                else if(chatModel.responderSocketId){
                    console.log("am gasit un responder = " + chatModel.responderSocketId + ", acum il apelez prin canalul de video");
                    runInAction(() => {
                        console.log("OnResponderFound-> inchid SignalR si apelez callUser");
                        this.stopHubConnection();

                        console.log("apelez callUser din functia OnRespondFound, chatModel="+chatModel + ", mychatModel=" + myChatModel);
                        callUser(chatModel.responderSocketId, myChatModel.callerName);
                     });
                }

            })
        }
    }

    stopHubConnection = () => {
        console.log("stopHubConnection - opresc SignaR ");
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
    }

}