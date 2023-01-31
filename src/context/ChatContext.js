import { createContext } from "react";
import { useState, useEffec, useReducer, useContext } from "react";
import { act } from "react-dom/test-utils";
import { AuthContext} from './AuthContext';

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {

    const {currentUser} = useContext(AuthContext);

    const INITIAL_STATE = {
        user: {},
        chatId: "null",
    }
    
    const reducer = (state, action) => {
        switch(action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid
                    ? currentUser.uid + action.payload.uid
                    : action.payload.uid + currentUser.uid  
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

    return(
        <ChatContext.Provider value={{data:state, dispatch}}>
            {children}
        </ChatContext.Provider>
    );
}