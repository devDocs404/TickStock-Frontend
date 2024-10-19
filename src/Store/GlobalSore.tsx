import { produce } from "immer";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

// Define a simplified interface for the store state
interface StoreState {
  toggleTheme: string;

  // Setters for each field
  setField: <T extends keyof StoreState>(key: T, value: StoreState[T]) => void;
}

const initialState: Omit<StoreState, "setField"> = {
  toggleTheme: "dark",
};

const useGlobalStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setField: (key, value) =>
          set(
            produce((draft: StoreState) => {
              draft[key] = value;
            })
          ),
      }),
      {
        name: "persist-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);

export { useGlobalStore };
