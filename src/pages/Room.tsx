import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useParams } from 'react-router-dom'
import "../styles/room.scss";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";

type RoomParams = {
    id: string;
}

export function Room() {

    const { id } = useParams<RoomParams>();
    
    const {user} = useAuth();
    
    const [newQuestion, setNewQuestion ] = useState('');

    const {title, questions } = useRoom(id)

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

                <div className="question-list">
                {
                    questions.map((question) => {
                        return (
                            <Question
                                author={question.author}
                                content={question.content}
                                key={question.id}
                            />
                        )
                    })
                }
                </div>

            </main>
        </div>
    );
}