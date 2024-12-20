import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

// Define a simplified interface for the store state
interface StoreState {
  selectedBasketOption: {
    label: string
    value: string
  }
  // Setters for each field
  setField: <T extends keyof StoreState>(key: T, value: StoreState[T]) => void
}

const initialState: Omit<StoreState, 'setField'> = {
  selectedBasketOption: { label: '', value: '' },
}

const usePortfolioStore = create<StoreState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setField: (key, value) =>
          set(
            produce((draft: StoreState) => {
              draft[key] = value
            }),
          ),
      }),
      {
        name: 'persist-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
)

export { usePortfolioStore }
