import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent";
import { Medic } from "../modules/medic";


export default class MedicStore{

    medici: Medic[] =[];

    mediciRegistry = new Map<string,Medic>();
    selectedmedic: Medic | undefined = undefined;
    loading = false;
    loadingInitial = true;


    constructor(){
        makeAutoObservable(this);
    }

    get mediciByName(){
        return Array.from(this.mediciRegistry.values()).sort((a,b)=>
            a.nume.localeCompare(b.nume)
        );
    }

    loadMedici = async () => {
        try {
            this.medici = await agent.medici.list();
            this.medici.forEach(medic =>{
                //medic.date... pot face conversii ale camurilor de date calendaristice
                runInAction(()=>{
                    this.mediciRegistry.set(medic.id,medic);
                })
                
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }
    



    setLoadingInitial(state: boolean){
        runInAction(() => {
            this.loadingInitial = state;
        })
        
    }
    
}