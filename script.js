function startListening() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        document.getElementById('prompt').value = event.results[0][0].transcript;
    };
    recognition.start();
}

function ask() {
    var prompt = document.getElementById('prompt').value;
    if (prompt.trim() !== '') {
        // Simulating chatbot response (since there's no backend)
        var botResponse = "I am a simple chatbot. You said: " + prompt;

        document.getElementById('bot-response').innerHTML = botResponse;

        var synth = window.speechSynthesis;
        var utterance = new SpeechSynthesisUtterance(botResponse);
        synth.speak(utterance);
    }
}
