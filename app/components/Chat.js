import React, { useContext, useEffect, useRef } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";

import io from "socket.io-client";
import { Link } from "react-router-dom";

const socket = io("http://localhost:8080");

export default function Chat() {
  const chatField = useRef(null);
  const chatLog = useRef(null);

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    socket.on("chatFromServer", message => {
      setState(draft => {
        draft.chatMessages.push(message);
      });
    });
  }, []);

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;

    if (state.chatMessages.length > 0 && !appState.isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  const handleFieldChange = e => {
    const value = e.target.value;

    setState(draft => {
      draft.fieldValue = value;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    socket.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token,
    });

    setState(draft => {
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });

      draft.fieldValue = "";
    });
  };

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (appState.isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          className="chat-title-bar-close"
          onClick={() => appDispatch({ type: "closeChat" })}
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div kwy={index} className="chat-self">
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }

          return (
            <div key={index} className="chat-other">
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}:</strong>{" "}
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          ref={chatField}
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          value={state.fieldValue}
          onChange={handleFieldChange}
        />
      </form>
    </div>
  );
}