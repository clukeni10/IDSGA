import { VehicleCardType } from "../types/VehicleCardType"
import { VehicleType } from "../types/VehicleType";
import { create } from "zustand";
import CardDao from "../database/CardDao";
import VehicleDao from "../database/VehicleDao";
import VehicleCardDao from "../database/VehicleCardDao";
import VehicleCardService from "../database/VehicleCardService";


const initialState: State = {
    cards: [],
    refresh: 0
} 
 
interface State {
    cards: VehicleCardType[]
    refresh: number
}


interface Actions {
    addVehicle: (vehicle: VehicleType, valid:Date,   totalCards?: any[])=> Promise<void>
    updateVehicle:(vehicle: VehicleType, card: VehicleCardType)=> Promise<void>
    forceRefresh: () => void
}

export const useVehicleState = create<Actions & State>((set) => ({
    ...initialState,
    addVehicle: async (vehicle: VehicleType, valid: Date, totalCards?: any[]) => {

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
    };

    if (vehicle) {
        await VehicleCardService.shared.addVehicle({ ...vehicle, ...card });
    } else {
        await VehicleDao.shared.addVehicle(vehicle);
        await VehicleCardDao.shared.addCard(card); 
    }

    set((state) => ({ cards: [...state.cards, card], refresh: state.refresh + 1 }));
},

updateVehicle: async (vehicle: VehicleType,  card: VehicleCardType) => {
    await VehicleCardService.shared.updateVehicle( { ...vehicle, ...card })
    set((state) => ({ refresh: state.refresh + 1 }));
 
},

forceRefresh: () => {
    set((state) => ({ refresh: state.refresh + 1 }))
}
})
);