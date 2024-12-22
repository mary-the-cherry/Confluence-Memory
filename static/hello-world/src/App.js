import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Card, Modal, Badge, Stack, Form } from 'react-bootstrap';
import { view, invoke } from "@forge/bridge";
import './App.css';

// Define image sets and background for each topic 
const imageSets = {
    flowers: [
        'flower1.jpg',
        'flower2.jpg',
        'flower3.jpg',
        'flower4.jpg',
        'flower5.jpg',
        'flower6.jpg',
        'flower7.jpg',
        'flower8.jpg'
    ],
    animals: [
        'animals1.jpg',
        'animals2.jpg',
        'animals3.jpg',
        'animals4.jpg',
        'animals5.jpg',
        'animals6.jpg',
        'animals7.jpg',
        'animals8.jpg'
    ],
    landscapes: [
        'landscape1.jpg',
        'landscape2.jpg',
        'landscape3.jpg',
        'landscape4.jpg',
        'landscape5.jpg',
        'landscape6.jpg',
        'landscape7.jpg',
        'landscape8.jpg'
    ]
};

const backgroundImages = {
    flowers: 'bg-flowers.jpg',
    animals: 'bg-animals.jpg',
    landscapes: 'bg-landscapes.jpg',
};

function App() {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [lockBoard, setLockBoard] = useState(false);
    const [matchedCards, setMatchedCards] = useState([]);
    const [moves, setMoves] = useState(0);
    const [startTime, setStartTime] = useState(null);    
    const [elapsedTime, setElapsedTime] = useState(0);  
    const [timerActive, setTimerActive] = useState(false); 
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [context, setContext] = useState(undefined);
    const [leaderboard, setLeaderboard] = useState([]);
    const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
    const [showLeaderboardQualifiedModal, setShowLeaderboardQualifiedModal] = useState(false);
    const [playerName, setPlayerName] = useState('');

    //Messages to motivate the user to continue to work (Shows in the normal Game completed modal)
    const motivationalMessages = [
        { title: "Well done!", message: "Now that you have given your mind a quick boost, dive back into your work with fresh energy and new ideas!" },
        { title: "Congrats!", message: "A clear mind is powerful! Bring that focus back to your tasks and see the difference!" },
        { title: "Nice work!", message: "Now that you have hit reset, channel that refreshed mindset into your next steps and make great things happen!" },
        { title: "You did it!", message: "With a quick mental break, you are ready to tackle anything. Go back with clarity and confidence!" },
        { title: "Challenge complete!", message: "Now, take that renewed focus and keep making strides!You are ready for anything that comes your way!" }
    ];

    //Default config is Flowers
    const defaultConfig = {
        memoryTheme: 'flowers'
    };

    //Get the Score Board and get the Theme of the Memory from the Context
    useEffect(() => { 
        const fetchLeaderboard = async () => {
            const data = await invoke('get-leaderboard');
            setLeaderboard(data);
        };
        view.getContext().then(setContext).then(() => {console.log(context)});
        fetchLeaderboard();
    }, []);

    //After getting the Context(Theme configured in Configuration of Macro), set the Theme 
    useEffect(() => {
        resetGame();
    }, [context]);

    //Start the Timer when first card is chosen
    useEffect(() => {
        let timer;
        if (timerActive) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timerActive, startTime]);

    //Set Images of cards depending of Theme
    const config = context?.extension.config || defaultConfig; //If no context/Theme chosen, take default
    const images = imageSets[config.memoryTheme]; // Use images based on the configured topic
    const backgroundImage = backgroundImages[config.memoryTheme];

    //Set back all States
    const resetGame = () => {
        const shuffledImages = shuffle([...images, ...images]);
        console.log(context);
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
        setMatchedCards([]);
        setShowLeaderboardModal(false);
        setShowLeaderboardQualifiedModal(false);
        setPlayerName('');
    };

    //Shuffle card images 
    const shuffle = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    //Handle click on a card
    const handleCardClick = (id) => {

        if (lockBoard || flippedCards.includes(id)) return;

        if (!timerActive) {
            setStartTime(Date.now()); 
            setTimerActive(true);     
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

    //Check and handle a match
    const checkForMatch = (flippedCardIds, updatedCards) => {
        const [firstCardId, secondCardId] = flippedCardIds;
        const firstCard = updatedCards.find(card => card.id === firstCardId);
        const secondCard = updatedCards.find(card => card.id === secondCardId);

        if (firstCard.image === secondCard.image) {
            setMatchedCards([...matchedCards, firstCardId, secondCardId]);
            if (matchedCards.length + 2 === cards.length) {
                handleGameComplete();
            } else {
                resetFlippedCards();
            }
        } else {
            setTimeout(() => unflipCards(firstCardId, secondCardId), 3000);
        }
        setMoves(moves + 1);
    };

    //Handle a completed Game
    const handleGameComplete = async () => {

        setTimerActive(false);

        const newEntry = { name: 'Anonymous', moves, time: elapsedTime };

        const updatedLeaderboard = [...leaderboard, newEntry]
            .sort((a, b) => a.moves - b.moves || a.time - b.time)
            .slice(0, 10);

        const qualifies = updatedLeaderboard.some(
            (entry) => entry.moves === moves && entry.time === elapsedTime
        );

        //If user qualifies show modal to add name, otherwise show motivational Modal
        if (qualifies) {
            setShowLeaderboardQualifiedModal(true); 
        } else {
            displayRandomMessage();  
            setShowModal(true);
        }
    };

    //Unflip the Cards
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

    // Display random message after completing the game
    const displayRandomMessage = () => {
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        setModalTitle(randomMessage.title);
        setModalMessage(randomMessage.message);
        console.log(elapsedTime);
    };

    //Saves Score if you are in the TopTen
    const handleSaveScore = async () => {
        const newEntry = { name: playerName, moves, time: elapsedTime };
        const updatedLeaderboard = await invoke('save-score', { payload: newEntry });
        console.log(`Updated Leaderboard ${JSON.stringify(updatedLeaderboard)}`);
        setLeaderboard(updatedLeaderboard); 
        setShowLeaderboardQualifiedModal(false);
        resetGame();
    };


    return (
        <div>
            <Container>
                <Row className="justify-content-center text-center">
                    <Col xs="auto">
                        <h1 className="m-2">Memory Pause</h1>
                        <h4 className="m-2">Take a moment to refresh and refocus with a quick memory challenge.</h4>
                    </Col>
                </Row>
                <Row className="justify-content-center text-center">
                    <Col>
                        <Badge bg="secondary m-2" className="justify-content-center">
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
                    </Col>
                </Row>
                <Row className="justify-content-center p-2">
                    <div className="grid">
                        {cards.map((card, index) => (
                            <Card
                                className={`memory-card ${card.flipped ? 'flipped' : ''}`}
                                style={{ width: '20vw', height: '20vw' }}
                                onClick={() => handleCardClick(card.id)}
                            >
                                {card.flipped ? (
                                    <img src={card.image} alt="Memory card" style={{ width: 'auto', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} />
                                ) : (
                                    <img src={backgroundImage} alt="Memory card" style={{ width: 'auto', height: '100%', objectFit: 'cover', objectPosition: '50% 50%' }} />
                                )}

                            </Card>
                        ))}
                    </div>
                </Row>
                <Row className="justify-content-center text-center">
                    <Button variant="secondary" onClick={() => setShowLeaderboardModal(true)} className="ms-2">View Leaderboard</Button>
                </Row>
            </Container>
            {/* Save Score Modal */}
            <Modal show={showLeaderboardQualifiedModal} onHide={() => setShowLeaderboardQualifiedModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Congratulations!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You made it to the leaderboard!</p>
                    <p>Your score: {moves} moves in {elapsedTime} seconds.</p>
                    <Form>
                        <Form.Group>
                            <Form.Label>Enter your name:</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault(); // Prevent form submission
                                        if (playerName.trim()) {
                                            handleSaveScore(); // Save score on Enter key press
                                        }
                                    }
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveScore} disabled={!playerName.trim()}>
                        Save Score
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Leaderboard Modal */}
            <Modal show={showLeaderboardModal} onHide={() => setShowLeaderboardModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Leaderboard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {leaderboard.length === 0 ? (
                        <p>No scores yet! Be the first to make it to the leaderboard!</p>
                    ) : (
                        <ul className="list-group">
                            {leaderboard.map((entry, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{index + 1}. {entry.name}</span>
                                    <span>{entry.moves} moves, {entry.time}s</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLeaderboardModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Memory Done Model */}
            <Modal show={showModal} onHide={resetGame} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>You completed the game in {moves} moves and {elapsedTime} seconds.</p>
                    <p>Sadly you did not made it to the leaderboard. But... </p>
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
