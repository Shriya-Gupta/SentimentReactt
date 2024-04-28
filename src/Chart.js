import React, { useState } from 'react';
import Chart from 'chart.js/auto';

const Chartt = () => {
    const [chartInstance, setChartInstance] = useState(null);
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);

    const performQuery = async () => {
        const queryInput = document.getElementById('queryInput').value;

        if (queryInput.trim() !== '') {
            try {
                const response = await queryApi({ inputs: queryInput }); // Use queryApi instead of query
                const responseData = response[0];
                const data = responseData.map(({ label, score }) => ({ label, score }));

                const ctx = document.getElementById('myChart');
                const newChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map(row => row.label),
                        datasets: [{
                            label: 'Emotions',
                            data: data.map(row => row.score),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                setChartInstance(newChartInstance);
                showSuggestions();
            } catch (error) {
                console.error('Error performing query:', error);
            }
        } else {
            console.warn('Query input is empty');
        }
    };

    const showSuggestions = () => {
        setSuggestionsVisible(true);
    };

    const redirectToPage = (pageUrl) => {
        window.location.href = pageUrl;
    };

    const queryApi = async (data) => {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        const result = await response.json();
        return result;
    };

    const startSpeechRecognition = () => {
        const recognition = new window.webkitSpeechRecognition(); // Use window object to access webkitSpeechRecognition

        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('queryInput').value = transcript;
            performQuery();
        };
    };

    return (
        <div className="content">
            <h1>SentimentZen</h1>
            <div className="container">
                <canvas id="myChart"></canvas>
                <div className="input-container" id="textInputLabel">
                    <input type="text" id="queryInput" placeholder="How are you feeling?" />
                    <button onClick={performQuery}>Submit</button>
                </div>

                <div className="or-divider">OR</div>

                <div className="input-container">
                    <button onClick={startSpeechRecognition}>Start Speech Recognition</button>
                </div>

                {suggestionsVisible && (
                    <div id="suggestionsSection">
                        <p id="emotionText">Here are some suggestions based on your mood:</p>
                        <div className="suggestions-container">
                            <button onClick={() => redirectToPage('Page/songs.html')}>
                                <img src="imgs/song.png" alt="Songs" />
                            </button>
                            <button onClick={() => redirectToPage('Page/books.html')}>
                                <img src="imgs/book.png" alt="Books" />
                            </button>
                            <button onClick={() => redirectToPage('Page/podcast.html')}>
                                <img src="imgs/podcast.png" alt="Podcast" />
                            </button>
                            <button onClick={() => redirectToPage('Page/movies.html')}>
                                <img src="imgs/movie.png" alt="Movies" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chart;
