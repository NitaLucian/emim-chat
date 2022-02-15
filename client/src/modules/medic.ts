
export interface Medic {
    id: string 
    nume: string
    prenume: string
    specialitate: string
  }

  export class Medic implements Medic{
    id='';
    nume='';
    prenume='';
    specialitate='';
    
    constructor(init? : MedicValues){
      if(init){
        Object.assign(this,init);
      }
    }

  }

  export class MedicValues {
    id='';
    nume='';
    prenume='';
    specialitate='';

    constructor(medic?: Medic) {
      if (medic) {
        this.id = medic.id;
        this.nume = medic.nume;
        this.prenume = medic.prenume;
        this.specialitate = medic.specialitate;
      }
    }
  }
  