import { reducerCases } from "./constants";

export const initialState = {
  userInfo: undefined,
  newUser: false,
  contacts: false,
  currentChat: undefined,
  messages: [],
  socketRef: undefined,
  messagesSearch: false,
  filteredContacts: [],
  userContacts: [],
  onlineUsers: [],
  videoCall: undefined,
  VoiceCall: undefined,
  incomeVoiceCall: undefined,
  incomeVideoCall: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.userInfo,
      };
    }

    case reducerCases.SET_NEW_USER: {
      return {
        ...state,
        newUser: action.newUser,
      };
    }

    case reducerCases.SET_ALL_CONTACTS: {
      return {
        ...state,
        contacts: !state.contacts,
      };
    }
    case reducerCases.CHANGE_CURRENT_USER: {
      return {
        ...state,
        currentChat: action.user,
      };
    }
    case reducerCases.SET_MESSAGES: {
      return {
        ...state,
        messages: action.messages,
      };
    }
    case reducerCases.SET_SOCKET: {
      return {
        ...state,
        socketRef: action.socketRef,
      };
    }
    case reducerCases.ADD_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    }
    case reducerCases.SET_MESSAGES_SEARCH:
      return {
        ...state,
        messagesSearch: !state.messagesSearch,
      };
    case reducerCases.SET_CONTACT_SEARCH: {
      const filteredContacts = state.userContacts.filter((contact) =>
        contact.name.toLowerCase().includes(action.contactSearch.toLowerCase())
      );
      return {
        ...state,
        contactSearch: action.contactSearch,
        filteredContacts,
      };
    }
    case reducerCases.SET_CONTACT_USERS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case reducerCases.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case reducerCases.SET_VIDEO_CALL:
      return {
        ...state,
        videoCall: action.videoCall,
      };
    case reducerCases.SET_INCOME_VIDEO_CALL:
      return {
        ...state,
        incomeVideoCall: action.incomeVideoCall,
      };
    case reducerCases.SET_VOICE_CALL:
      return {
        ...state,
        voiceCall: action.voiceCall,
      };
    case reducerCases.SET_INCOME_VOICE_CALL:
      return {
        ...state,
        incomeVoiceCall: action.incomeVoiceCall,
      };
    case reducerCases.SET_EXIT_CHAT:
      return {
        ...state,
        currentChat: undefined,
      };
    case reducerCases.END_CALL:
      return {
        ...state,
        incomeVoiceCall: undefined,
        incomeVideoCall: undefined,
        voiceCall: undefined,
        videoCall: undefined,
      };

    default:
      return state;
  }
};

export default reducer;
