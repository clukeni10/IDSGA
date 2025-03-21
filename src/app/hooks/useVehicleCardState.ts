import { create } from "zustand"
import VehicleCardDao from "../database/VehicleCardDao"
import VehicleCardService from "../database/VehicleCardService"
import { VehicleCardType } from "../types/VehicleCardType"


const initialState: State = {
    cards:[],
    selectedCard:null
}

interface State {
    cards: VehicleCardType[]
    selectedCard: VehicleCardType | null
}

interface Actions {
    setSelectedCard: (card: VehicleCardType)=> void
    clearSelectedCard: ()=> void
    getAllCards:(url:string | null) => void
}

export const useVehicleCardState = create<Actions & State>((set) => ({
    ...initialState,
    setSelectedCard: (selectedCard: VehicleCardType) => set(() => {

    return ({selectedCard})
    }),

    clearSelectedCard: () => set(() => ({selectedCard:null})),
    getAllCards: (url: string | null) => {
        if(url){
            VehicleCardService.shared.getAllCards(url)
                .then(cards => {
                    set(() => ({cards}))
                })
                .catch(console.log)
        } else{
            VehicleCardDao.shared.getAllCards()
                .then(cards => {
                    set(() => ({cards}))
                })
                .catch(console.log)
        }
    }
}))