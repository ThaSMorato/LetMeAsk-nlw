import { useHistory } from 'react-router-dom'
import IllustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";
import GoogleIconImg from "../assets/images/google-icon.svg";
import '../styles/auth.scss';
import { Button } from "../components/Button";

export function Home () {
    const history = useHistory();

    const navigateToNewRoom = () => {
        history.push('/rooms/new');
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
                    <button onClick={navigateToNewRoom} className="create-room">
                        <img src={GoogleIconImg} alt="Logo Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        ou entre em uma sala
                    </div>
                    <form action="">
                        <input 
                            type="text" 
                            placeholder="Digite o codigo da sala" 
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