import { useEffect, useState } from "react";
import { database } from "../services/firebase";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    question: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}>


export function useRoom(id: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);

    const [title, setTitle] = useState('');

    useEffect(() => { //firebase docs events
        const roomRef = database.ref(`rooms/${id}`);

        roomRef.on('value', room => {

            const databaseRoom = room.val();

            const firebaseQuestions : FirebaseQuestion = databaseRoom.questions  ?? {};

            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return { 
                    id: key,
                    content: value.question,
                    author: value.author,
                    isAnswered: value.isAnswered,
                    isHighlighted: value.isHighlighted,
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);
        });

    }, [id]);

    return { questions, title }
}