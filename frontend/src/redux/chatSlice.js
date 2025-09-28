import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [], // Real-time, can be managed without persistence
    messages: [], // Message history, can be persisted
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload; // No need to persist this
    },
    setMessages: (state, action) => {
      console.log('New messages:', action.payload); // Check the payload
      state.messages = action.payload; // Messages are serializable
    }
  }
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
