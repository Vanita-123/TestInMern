
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
const socket = io("http://localhost:3000");
function SocketIo() {
  const [chat, setChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(""); 

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: message,
      user: username,
      time: `${new Date().getHours()}:${new Date().getMinutes()}`,
    };

    if (message.trim() !== "") {
      socket.emit('send-message', messageData);
      setMessage("");
    } else {
      alert('Message cannot be empty');
    }
  };

  return (
    <div>
      {chat ? (
        <div>
          <h1 className='text-2xl font-serif'>Chat is here</h1>
          <div>
            {messages.map((msg, index) => (
              <div key={index} className={`chat ${msg.user === username ? 'chat-end' : 'chat-start'}`}>
                <div className={`chat-bubble ${msg.user === username ? 'chat-bubble-accent' : 'chat-bubble-primary'}`}>
                  <h3>  
                    <span className='text-black'>
                    UserName:  
                    </span>
                    {msg.user}</h3> 
                    <span className='text-black'>
                    message 
                    </span>
                  <p> {msg.message}</p>
                  <span className='text-black'>
                    Time 
                    </span>
                  <p>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex space-x-1 h-[8vh] bg-black text-center">
              <div className="w-[70%] py-1 px-1">
                <input 
                  type="text" 
                  placeholder='Message' 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="border-2 border-black justify-center align-middle text-center"
                />
                <button className='bg-green-500 py-1 px-2 m-1 font-bold' type='submit'>Send</button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-black p-1 mb-2"
          />
          <button className='bg-green-500 p-2 text-black font-bold' onClick={() => setChat(true)}>Start Chat</button>
        </div>
      )}
    </div>
  );
}

export default SocketIo;
