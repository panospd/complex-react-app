(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{212:function(e,a){},218:function(e,a,t){"use strict";t.r(a),t.d(a,"default",(function(){return o}));var s=t(0),r=t.n(s),c=t(11),n=t(10),l=t(15),m=t(185),i=t.n(m),u=t(3);function o(){const e=Object(s.useRef)(null),a=Object(s.useRef)(null),t=Object(s.useRef)(null),m=Object(s.useContext)(c.a),o=Object(s.useContext)(n.a),[h,f]=Object(l.a)({fieldValue:"",chatMessages:[]});Object(s.useEffect)(()=>(e.current=i()("http://localhost:8080"),e.current.on("chatFromServer",e=>{f(a=>{a.chatMessages.push(e)})}),()=>{e.current.disconnect()}),[]),Object(s.useEffect)(()=>{m.isChatOpen&&(a.current.focus(),o({type:"clearUnreadChatCount"}))},[m.isChatOpen]),Object(s.useEffect)(()=>{t.current.scrollTop=t.current.scrollHeight,h.chatMessages.length>0&&!m.isChatOpen&&o({type:"incrementUnreadChatCount"})},[h.chatMessages]);return r.a.createElement("div",{id:"chat-wrapper",className:"chat-wrapper shadow border-top border-left border-right "+(m.isChatOpen?"chat-wrapper--is-visible":"")},r.a.createElement("div",{className:"chat-title-bar bg-primary"},"Chat",r.a.createElement("span",{className:"chat-title-bar-close",onClick:()=>o({type:"closeChat"})},r.a.createElement("i",{className:"fas fa-times-circle"}))),r.a.createElement("div",{id:"chat",className:"chat-log",ref:t},h.chatMessages.map((e,a)=>e.username===m.user.username?r.a.createElement("div",{kwy:a,className:"chat-self"},r.a.createElement("div",{className:"chat-message"},r.a.createElement("div",{className:"chat-message-inner"},e.message)),r.a.createElement("img",{className:"chat-avatar avatar-tiny",src:e.avatar})):r.a.createElement("div",{key:a,className:"chat-other"},r.a.createElement(u.b,{to:"/profile/"+e.username},r.a.createElement("img",{className:"avatar-tiny",src:e.avatar})),r.a.createElement("div",{className:"chat-message"},r.a.createElement("div",{className:"chat-message-inner"},r.a.createElement(u.b,{to:"/profile/"+e.username},r.a.createElement("strong",null,e.username,":")," "),e.message))))),r.a.createElement("form",{onSubmit:a=>{a.preventDefault(),e.current.emit("chatFromBrowser",{message:h.fieldValue,token:m.user.token}),f(e=>{e.chatMessages.push({message:e.fieldValue,username:m.user.username,avatar:m.user.avatar}),e.fieldValue=""})},id:"chatForm",className:"chat-form border-top"},r.a.createElement("input",{ref:a,type:"text",className:"chat-field",id:"chatField",placeholder:"Type a message…",autoComplete:"off",value:h.fieldValue,onChange:e=>{const a=e.target.value;f(e=>{e.fieldValue=a})}})))}}}]);