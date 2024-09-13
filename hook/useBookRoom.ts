import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakfastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

const useBookRoom = create<BookRoomStore>((set) => ({
  bookingRoomData: null,
  paymentIntent: null,
  clientSecret: undefined,
  setRoomData: (data) => set(() => ({ bookingRoomData: data })),
  setPaymentIntent: (paymentIntent) => set(() => ({ paymentIntent })),
  setClientSecret: (clientSecret) => set(() => ({ clientSecret })),
  resetBookRoom: () =>
    set(() => ({
      bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,
    })),
}));

export default useBookRoom;
