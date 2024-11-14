import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, Modal, Badge, Stack } from 'react-bootstrap';
import './App.css';

// Array of image URLs
const images = [
    'img1.jpg',
    'img2.jpg',
    'img3.jpg',
    'img4.jpg',
    'img5.jpg',
    'img6.jpg',
    'img7.jpg',
    'img8.jpg'
];

function App() {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);    // Startzeit
    const [elapsedTime, setElapsedTime] = useState(0);   // Verstrichene Zeit in Sekunden
    const [timerActive, setTimerActive] = useState(false); // Steuerung des Timers
    const [showModal, setShowModal] = useState(false); // Kontrolliert die Sichtbarkeit des Modals
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');


    const motivationalMessages = [
        { title: "Well done!", message: "Now that you have given your mind a quick boost, dive back into your work with fresh energy and new ideas!" },
        { title: "Congrats!", message: "A clear mind is powerful! Bring that focus back to your tasks and see the difference!" },
        { title: "Nice work!", message: "Now that you have hit reset, channel that refreshed mindset into your next steps and make great things happen!" },
        { title: "You did it!", message: "With a quick mental break, you are ready to tackle anything. Go back with clarity and confidence!" },
        { title: "Challenge complete!", message: "Now, take that renewed focus and keep making strides!You are ready for anything that comes your way!" }
    ];


      useEffect(() => {
          resetGame();
      }, []);

    // Startet den Timer, wenn die erste Karte aufgedeckt wird
    useEffect(() => {
        let timer;
        if (timerActive) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000)); // Aktuelle Zeit in Sekunden
            }, 1000);
        }
        return () => clearInterval(timer); // Timer bereinigen, wenn der Timer inaktiv ist
    }, [timerActive, startTime]);


    const resetGame = () => {
        const shuffledImages = shuffle([...images, ...images]);
        const initialCards = shuffledImages.map((image, index) => ({
            id: index,
            image,
            flipped: false,
            matched: false
        }));
        setCards(initialCards);
        setFlippedCards([]);
        setLockBoard(false);
        setStartTime(null);
        setElapsedTime(0);
        setTimerActive(false);
        setShowModal(false);
        setMoves(0);
    };

    const shuffle = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    //Test --> Must be removed
    const testModal = () => {
        displayRandomMessage();
        setShowModal(true);
    };

    const handleCardClick = (id) => {

        if (lockBoard || flippedCards.includes(id)) return;

        if (!timerActive) {
            setStartTime(Date.now());  // Startzeit festlegen
            setTimerActive(true);      // Timer aktivieren
        }

        const newFlippedCards = [...flippedCards, id];
        setFlippedCards(newFlippedCards);

        const updatedCards = cards.map(card => {
            if (card.id === id) {
                return { ...card, flipped: true };
            }
            return card;
        });

        setCards(updatedCards);

        if (newFlippedCards.length === 2) {
            setLockBoard(true);
            checkForMatch(newFlippedCards, updatedCards);
        }
    };

    const checkForMatch = (flippedCardIds, updatedCards) => {
        const [firstCardId, secondCardId] = flippedCardIds;
        const firstCard = updatedCards.find(card => card.id === firstCardId);
        const secondCard = updatedCards.find(card => card.id === secondCardId);

        if (firstCard.image === secondCard.image) {
            setMatchedCards([...matchedCards, firstCardId, secondCardId]);
            if (matchedCards.length + 2 === cards.length) {
                setTimerActive(false);  // Timer stoppen, wenn alle Paare gefunden sind
                displayRandomMessage();  // Setzt eine zufällige Nachricht für das Modal
                setShowModal(true);     // Pop-up anzeigen
            }
            resetFlippedCards();
        } else {
            setTimeout(() => unflipCards(firstCardId, secondCardId), 3000);
        }
        setMoves(moves + 1);
    };

    const unflipCards = (firstCardId, secondCardId) => {
        const updatedCards = cards.map(card => {
            if (card.id === firstCardId || card.id === secondCardId) {
                return { ...card, flipped: false };
            }
            return card;
        });
        setCards(updatedCards);
        resetFlippedCards();
    };

    const resetFlippedCards = () => {
        setFlippedCards([]);
        setLockBoard(false);
    };

    // Zufällige Nachricht setzen
    const displayRandomMessage = () => {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        setModalTitle(randomMessage.title);
        console.log(randomMessage.title);
        setModalMessage(randomMessage.message);
        console.log(randomMessage.message)
    };

    return (
        <div>
            <Container className="game-container">
                <Row className="justify-content-center text-center">
                    <Col xs="auto">
                        <h1 className="m-2">Memory Pause</h1>
                        <h3 className="m-2">Take a moment to refresh and refocus with a quick memory challenge.</h3>
                    </Col>
                </Row>
                <Row className="m-4">
                    <Stack direction="horizontal" className="justify-content-center">
                        <Badge bg="primary" className="justify-content-center">
                            <Row>
                                <Col className="text-start">
                                    <p className="mt-1 mb-1 pb-1"> Moves: </p>
                                    <p className="mb-1  mt-0 pt-0"> Time: </p>
                                </Col>
                                <Col className="text-center">
                                    <p className="mt-1 mb-1 pb-1">  {moves} </p>
                                    <p className="mb-1  mt-0 pt-0"> {elapsedTime} seconds</p>
                                </Col>
                            </Row>
                        </Badge>
                    </Stack>
                </Row>
                <Row className="justify-content-center">
                    <div className="grid">
                        {cards.map((card, index) => (
                            <Card
                                //className="m-2 p-0"
                                className={`memory-card ${card.flipped ? 'flipped' : ''}`}
                                style={{ width: '20vw', height: '20vw' }}
                                onClick={() => handleCardClick(card.id)}
                            >
                                {card.flipped ? (
                                    <img src={card.image} alt="Memory card" style={{ width: 'auto', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} />
                                ) : (
                                        <img src="test.png" alt="Memory card" style={{ width: 'auto', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} />
                                )}
                                
                            </Card>
                        ))}
                    </div>
                </Row>
                <Button onClick={() => testModal()}>Test Modal</Button>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You completed the game in {moves} moves and {elapsedTime} seconds.</p>
                    <p>{modalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={resetGame}>
                        Play Again
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
  );
}

export default App;
