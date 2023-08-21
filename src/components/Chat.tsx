import { FunctionComponent, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface ChatProps {
    socket: Socket;
    username: string;
    room: string;
}

interface dataItem {
    message: string;
    time: string;
    author: string;
}

const Chat: FunctionComponent<ChatProps> = ({ socket, room, username }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState<dataItem[]>([]);

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            };

            await socket.emit('send_message', messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);
    return (
        <div className="flex flex-col items-center border-2 border-white rounded-lg mt-[50px] min-w-[500px] phone:min-w-[300px] h-[500px]">
            <div className="border-b-2 border-white w-full">
                <p className="text-3xl font-semibold text-center py-4">Live Chat</p>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto w-full">
                {messageList.map((messageContent, index) => (
                    <div
                        key={index}
                        className={`${
                            username === messageContent.author ? 'self-end' : 'self-start'
                        } flex flex-col  p-2 max-w-[50%]`}
                    >
                        <div
                            className={`${
                                username === messageContent.author
                                    ? 'bg-white text-black'
                                    : 'bg-black text-white border-2 border-white'
                            }  w-full py-2 px-4 whitespace-normal break-words  rounded-lg`}
                        >
                            <p>{messageContent.message}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="mr-2">{messageContent.time}</p>
                            <p className="font-semibold">{messageContent.author}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="border-t-2 border-white flex items-center overflow-hidden w-full">
                <input
                    className="text-white rounded-lg w-full py-2 bg-transparent outline-none pl-6"
                    type="text"
                    placeholder="Message..."
                    value={currentMessage}
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="text-white px-4 py-2 border-l-2 border-white hover:text-black hover:bg-white"
                >
                    &#9658;
                </button>
            </div>
        </div>
    );
};

export default Chat;
