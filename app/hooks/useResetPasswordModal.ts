import { use } from "react";
import { create } from "zustand";

interface ResetPasswordStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useResetPasswordModal = create<ResetPasswordStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
export default useResetPasswordModal;
