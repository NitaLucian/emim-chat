
import {makeAutoObservable} from "mobx";
import { ChatModel } from "../modules/chatModel";



export default class ChatModelStore{

    chatModel: ChatModel = {
        clinicaId: "6E6423FF-00F9-4142-59E3-08D608D9CCBF",
        callerSocketId: "",
        callerUserId: "",
        callerName: "",
        responderSocketId: "",
        responderUserId: "",
        responderName: "",
        callerDate: undefined,
        responderDateDate: undefined,
        callerMessage: "",
        responderrMessage: ""
    };


    constructor(){
        makeAutoObservable(this);
    }

    
}