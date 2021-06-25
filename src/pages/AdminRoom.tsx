import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { useHistory, useParams } from 'react-router-dom'
import "../styles/room.scss";
// import { FormEvent, useEffect, useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { database } from "../services/firebase";
import { Question } from "../components/Question";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

type RoomParams = {
    id: string;
}

export function AdminRoom() {

    const { id } = useParams<RoomParams>();
    
    const history = useHistory();

    // const {user} = useAuth();
    

    const {title, questions } = useRoom(id);

    const handleEndRoom = async () => {
        await database.ref(`rooms/${id}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

    const handleDeleteQuestion = async (questionId: string) => {
        if(window.confirm('Tem certeza que deseja excluir essa perunta?')){
            await database.ref(`rooms/${id}/questions/${questionId}`).remove();
        }
    }

    const handleCheckQuestionAsAnswered = async (questionId: string) => {
        await database.ref(`rooms/${id}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    const handleHighlightQuestion = async (questionId: string, questionIsHighlighted: boolean) => {
        await database.ref(`rooms/${id}/questions/${questionId}`).update({
            isHighlighted: !questionIsHighlighted,
        });
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <div>
                        <RoomCode code={id} />
                        <Button isOutlined onClick={handleEndRoom} >Encerrar Sala</Button>
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
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {
                                    !question.isAnswered && (
                                       <>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                            >
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                                            >
                                                <img src={answerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                       </> 
                                    )
                                }
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="remover pergunta" />
                                </button>
                            </Question>
                        )
                    })
                }
                </div>

            </main>
        </div>
    );
}