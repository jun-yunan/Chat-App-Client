'use client';

import Chat from '@/components/Chat';
import { useState } from 'react';
import { connect } from 'socket.io-client';

const socket = connect('http://localhost:3001');

export default function Home() {
    const [username, setUsername] = useState('');

    const [room, setRoom] = useState('');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== '' && room !== '') {
            socket.emit('join_room', room);
            setShowChat(true);
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            {!showChat ? (
                <div className="flex flex-col items-center border-2 border-neutral-100 p-6 rounded-lg">
                    <h1 className="text-3xl font-semibold">Join Chat Room</h1>
                    <div className="text-black flex flex-col my-6">
                        <input
                            className="mb-4 px-6 py-2 rounded-lg w-[350px] phone:w-[300px] outline-none"
                            type="text"
                            onChange={(event) => {
                                setUsername(event.target.value);
                            }}
                            placeholder="Username..."
                        />
                        <input
                            className="px-6 py-2 rounded-lg w-[350px] phone:w-[300px] outline-none"
                            type="text"
                            onChange={(event) => setRoom(event.target.value)}
                            placeholder="Room ID..."
                        />
                    </div>
                    <button
                        className="p-4 bg-white text-black rounded-xl hover:bg-gray-300 duration-500 ease-in-out transition-all"
                        onClick={joinRoom}
                    >
                        Join A Room
                    </button>
                </div>
            ) : (
                <Chat socket={socket} room={room} username={username} />
            )}
        </main>
    );
}
