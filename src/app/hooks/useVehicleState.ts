import { VehicleCardType } from "../types/VehicleCardType"
import { VehicleType } from "../types/VehicleType";
import { create } from "zustand";
import CardDao from "../database/CardDao";
import CardService from "../database/CardService";
import VehicleDao from "../database/VehicleDao";
import VehicleCardDao from "../database/VehicleCardDao";


const initialState: State = {
    cards: [],
    refresh: 0
} 
 
interface State {
    cards: VehicleCardType[]
    refresh: number
}


interface Actions {
    addVehicle: (vehicle: VehicleType, valid:Date, url:string, totalCards?: any[])=> Promise<void>
    updateVehicle:(vehicle: VehicleType,  url:string | null, card: VehicleCardType)=> Promise<void>
    forceRefresh: () => void
}

export const useVehicleState = create<Actions & State>((set) => ({
    ...initialState,
    addVehicle: async (vehicle: VehicleType, valid: Date, url: string , totalCards?: any[]) => {

    let cardNumber:Promise<string> | string;
    
    if (totalCards) {
        const nextId = totalCards.length + 1;
        cardNumber = nextId.toString().padStart(4, '0');
    } else {
        cardNumber = await CardDao.shared.generateNextId();
    }
    
    const card: VehicleCardType= {
        vehicle: vehicle,
        expiration: valid,
        cardNumber,
        entity: "Desconhecido" ,
        
        
    };

    if (url) {
        await CardService.shared.addVehicle({ ...vehicle, ...card }, url);
    } else {
        await VehicleDao.shared.addVehicle(vehicle);
        await VehicleCardDao.shared.addCard(card);
    }

    set((state) => ({ cards: [...state.cards, card], refresh: state.refresh + 1 }));
},

updateVehicle: async (vehicle: VehicleType, url: string | null, card: VehicleCardType) => {
    await CardService.shared.updateVehicle(
        { ...vehicle, ...card }, 
        url
    );
    
    set((state) => ({ refresh: state.refresh + 1 }));
},
forceRefresh: () => {
    set((state) => ({ refresh: state.refresh + 1 }))
}
})
);