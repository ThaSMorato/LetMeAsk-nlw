import { useHistory } from 'react-router-dom'
import IllustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";
import GoogleIconImg from "../assets/images/google-icon.svg";
import '../styles/auth.scss';
import { Button } from "../components/Button";
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home () {

    const {user, signInWithGoogle} = useAuth();

    const [roomCode, setRoomCode] = useState('');

    const history = useHistory();    

    const handleCreateRoom = async () => {

        if(!user) {
            await signInWithGoogle();
        }

        history.push('/rooms/new');
    }

    const handleJoinRoom = async (event : FormEvent) => {
        event.preventDefault();

        if(roomCode.trim() === '') {
            return ;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert('Room does not exists');

            return;
        }

        if(roomRef.val().endedAt) {
            alert('Room aready closed.')
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }

    return (
        <div id="page-auth">
            <aside>
                <img src={IllustrationImg} alt="Ilustracao simbolizanddo perguntas e respostas" />
                <strong>Crie sala de Q&amp;A ao-vivo </strong>
                <p>Tire as duvidas da usa audiencia em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="LetMeAsk" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={GoogleIconImg} alt="Logo Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o codigo da sala" 
                            onChange={event => setRoomCode(event.target.value)}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}