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

export function AdminRoom() {

    const { id } = useParams<RoomParams>();
    
    const {user} = useAuth();
    
    const [newQuestion, setNewQuestion ] = useState('');

    const {title, questions } = useRoom(id)

   

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <div>
                        <RoomCode code={id} />
                        <Button isOutlined >Encerrar Sala</Button>
                    </div>
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