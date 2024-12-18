import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const initialState: State = {
    address: null
}

interface State {
    address: string | null
}

interface Actions {
    saveNetworkAddress: (address: string | null) => void
}

export const useNetworkState = create<Actions & State>()(
    persist(
        (set) => ({
            ...initialState,
            saveNetworkAddress: (address: string | null) => {                
                if (address) {
                    set(() => ({ address: `${address.replace(':3000', '')}:3000` }))
                } else {
                    set(() => ({ address: null }))
                }
            }
        }), {
        name: 'sga-network',
        storage: createJSONStorage(() => localStorage),
        partialize: (persistedState) => ({ address: persistedState.address })
    })
)