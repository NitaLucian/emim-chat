import { createContext, useContext } from "react";
import ChatModelStore from "./chatModelStore";
import ChatStore from "./chatStore";
import MedicStore from "./medicStore";

interface Store{
    medicStore: MedicStore,
    chatModelStore: ChatModelStore,
    chatStore: ChatStore,
}

export const store:Store={

    medicStore: new MedicStore(),
    chatModelStore: new ChatModelStore(),
    chatStore: new ChatStore()
    
}
export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}