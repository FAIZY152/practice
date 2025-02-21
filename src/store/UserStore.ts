import { create } from "zustand";
import { User } from "../types/UserTypes";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  usageCount: number;
  setUser: (userData: User | null) => void;
  logout: () => void;
  setUsageCount: (count: number) => void;
  userid: string | null;
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userid: null,
      user: null,
      usageCount: 0,
      isOpen: false,
      openDialog: () => set({ isOpen: true }),
      closeDialog: () => set({ isOpen: false }),
      setUsageCount: (count) => set({ usageCount: count }),
      // Initially, no user is logged in
      setUser: (userData) => set({ user: userData, userid: userData?.id }),
      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, userid: null });
      },
    }),
    {
      name: "user-store", // unique name for localStorage key
    }
  )
);

export default useUserStore;
