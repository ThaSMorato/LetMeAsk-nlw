import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useParams } from 'react-router-dom'
import "../styles/room.scss";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type RoomParams = {
    id: string;
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}

export function Room() {

    
    const { id } = useParams<RoomParams>();
    
    const {user} = useAuth();
    
    const [newQuestion, setNewQuestion ] = useState('');

    const [questions, setQuestions] = useState<Question[]>([]);

    const [title, setTitle] = useState('');
    
    useEffect(() => { //firebase docs events
        const roomRef = database.ref(`rooms/${id}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val();

            const firebaseQuestions : FirebaseQuestion = databaseRoom.questions  ?? {};

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return { 
                    id: key,
                    content: value.content,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);
        });

    }, [id]);

    const handleSendQuestion = async (event: FormEvent) => {
        event.preventDefault();
        
        if(newQuestion.trim() === '') {
            return;
        }

        if(!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            question: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${id}/questions`).push(question);

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <RoomCode code={id} />
                </div>
            </header> 
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {
                        questions.length > 0 && (
                            <span>{questions.length} pergunta(s)</span>
                        )
                    }
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que voce quer perguntar" 
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {
                            user ? (
                                <div className="user-info">
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>
                            ) : 
                            (
                                <span>Para enviar uma pergunta <button> faca seu login</button></span>
                            )
                        }
                        <Button disabled={!user} type="submit"> Enviar pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    );
}