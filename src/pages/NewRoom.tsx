import {Link} from 'react-router-dom'
import IllustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";
import '../styles/auth.scss';
import { Button } from "../components/Button";
// import { useAuth } from '../hooks/useAuth';

export function NewRoom () {

    // const {user} = useAuth();

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
                    <form action="">
                        <input 
                            type="text" 
                            placeholder="Nome da sala" 
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