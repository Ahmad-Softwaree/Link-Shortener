import { create } from "zustand";

export type ModalTypes =
  | "add"
  | "update"
  | "delete"
  | "info"
  | "success"
  | "filter"
  | "restore"
  | "caption_info"
  | "caption_form"
  | "setting_info"
  | "setting_form"
  | "show_image"
  | "add_item_cost"
  | "add_item_variant"
  | "add_customer_address"
  | "see_item_tags"
  | "reject_order"
  | "reject_coupon"
  | "exchange_point"
  | null;

interface ModalState {
  modal: ModalTypes;
  modalData: any;
  modalProps: any;
  isPending: boolean;
  id: string | number;
  name: string;
  actionBar: string;
  openModal: (args: {
    type: ModalTypes;
    modalData?: any;
    id?: string | number;
    name?: string;
    modalProps?: any;
  }) => void;
  setActionBar: (actionBar: string) => void;
  closeModal: () => void;
  submitForm: () => void;
  setModalData: (data: any) => void;
  clearModalData: () => void;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modal: null,
  modalData: null,
  id: 0,
  name: "",
  isPending: false,
  modalProps: {},
  actionBar: "",

  setModalData: (modalData: any) => set({ modalData }),
  clearModalData: () => set({ modalData: null }),
  setActionBar: (actionBar: string) => set({ actionBar }),
  openModal: ({ type, modalData, id, name, modalProps }) =>
    set({ modal: type, modalData, id, name, modalProps, isPending: false }),

  closeModal: () =>
    set({
      modal: null,
      modalData: null,
      id: 0,
      name: "",
      isPending: false,
      modalProps: {},
      actionBar: "",
    }),

  submitForm: () => set({ isPending: true }),
}));
