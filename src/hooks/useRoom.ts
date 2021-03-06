import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type FirebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    question: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string;
    }>;
}>


export function useRoom(id: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const {user} = useAuth();
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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }
            });

            setTitle(databaseRoom.title);
            setQuestions(parsedQuestion);
        });

        return () => {
            roomRef.off('value');
        }

    }, [id, user?.id]);

    return { questions, title }
}