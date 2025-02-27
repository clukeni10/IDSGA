import { VehicleCardType } from "../types/VehicleCardType"
import { VehicleType } from "../types/VehicleType";
import { create } from "zustand";
import CardDao from "../database/CardDao";
import CardService from "../database/CardService";
import VehicleDao from "../database/VehicleDao";


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

export const usePersonState = create<Actions & State>((set) => ({
    ...initialState,
addVehicle: async (vehicle: VehicleType, valid: Date, url: string, totalCards?: any[]) => {
    let cardNumber: string;
    
    if (totalCards) {
        const nextId = totalCards.length + 1;
        cardNumber = nextId.toString().padStart(4, '0');
    } else {
        cardNumber = await CardDao.shared.generateNextId();
    }
    const card: VehicleCardType = {
        vehicle,
        expiration: valid,
        cardNumber,
        entity: "Desconhecido" 
    };

    if (url) {
        await CardService.shared.addCard({ ...card, ...vehicle } as VehicleCardType, null, url);
    } else {
        await VehicleDao.shared.addVehicle(vehicle);
        await CardDao.shared.addCard(card);
    }

    set((state) => ({ cards: [...state.cards, card], refresh: state.refresh + 1 }));
},

updateVehicle: async (vehicle: VehicleType, url: string | null, card: VehicleCardType) => {
    await CardService.shared.updateCard({ ...vehicle, ...card }, null, url);
    set((state) => ({ refresh: state.refresh + 1 }));
},
forceRefresh: () => {
    set((state) => ({ refresh: state.refresh + 1 }))
}
}))