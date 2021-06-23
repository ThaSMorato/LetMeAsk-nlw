import {Link, useHistory} from 'react-router-dom'
import IllustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";
import '../styles/auth.scss';
import { Button } from "../components/Button";
import {FormEvent, useState} from 'react';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

export function NewRoom () {

    const {user} = useAuth();

    const history = useHistory();    

    const [newRoom, setNewRoom] = useState('');

    const handleCreateRoom = async (event : FormEvent) => {
        event.preventDefault();

        if(newRoom.trim() === '') {
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        });

        history.push(`/rooms/${firebaseRoom.key}`);

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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder="Nome da sala" 
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom} 
                        />
                        <Button type="submit">
                            Criar na sala
                        </Button>
                    </form>
                    <p>
                        Quer Entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}