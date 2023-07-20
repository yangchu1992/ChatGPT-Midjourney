// eventStore.ts
import create, { State, SetState } from 'zustand';

interface EventState extends State {
  eventHandler: (arg: string) => void;
  setEventHandler: (handler: (arg: string) => void) => void;
}

const useEventStore = create<EventState>((set: SetState<EventState>) => ({
  eventHandler: (arg: string) => {}, // Default empty event handler function
  setEventHandler: (handler: (arg: string) => void) => set({ eventHandler: handler }),
}));

export default useEventStore;
