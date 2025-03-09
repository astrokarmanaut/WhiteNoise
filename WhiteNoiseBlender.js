<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>White Noise Mixer</title>
    <script src="https://www.youtube.com/iframe_api"></script>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        .control { margin: 10px; }
        .volume-slider { width: 300px; }
    </style>
</head>
<body>
    <h1>White Noise Mixer</h1>
    <div id="audio-controls"></div>
    
    <script>
        const sources = [null, null, null, null]; // Store audio elements

        function addAudioControl(index) {
            const container = document.createElement("div");
            container.className = "control";
            
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Enter stream URL or YouTube link";
            
            const playButton = document.createElement("button");
            playButton.textContent = "Play";
            
            const stopButton = document.createElement("button");
            stopButton.textContent = "Stop";
            
            const volumeSlider = document.createElement("input");
            volumeSlider.type = "range";
            volumeSlider.min = 0;
            volumeSlider.max = 1;
            volumeSlider.step = 0.01;
            volumeSlider.className = "volume-slider";
            volumeSlider.value = 0.5;
            
            playButton.onclick = () => startAudio(index, input.value);
            stopButton.onclick = () => stopAudio(index);
            volumeSlider.oninput = (e) => adjustVolume(index, e.target.value);
            
            container.appendChild(input);
            container.appendChild(playButton);
            container.appendChild(stopButton);
            container.appendChild(volumeSlider);
            document.getElementById("audio-controls").appendChild(container);
        }

        function startAudio(index, url) {
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                if (sources[index]) sources[index].destroy();
                const videoId = extractYouTubeID(url);
                sources[index] = new YT.Player(`yt-player-${index}`, {
                    height: '0',
                    width: '0',
                    videoId: videoId,
                    playerVars: { 'autoplay': 1, 'controls': 0 },
                    events: {
                        'onReady': (event) => event.target.setVolume(50)
                    }
                });
            } else {
                if (sources[index]) sources[index].pause();
                sources[index] = new Audio(url);
                sources[index].loop = true;
                sources[index].volume = 0.5;
                sources[index].play();
            }
        }

        function stopAudio(index) {
            if (sources[index]) {
                if (typeof sources[index].pause === 'function') {
                    sources[index].pause();
                } else {
                    sources[index].destroy();
                }
                sources[index] = null;
            }
        }

        function adjustVolume(index, value) {
            if (sources[index]) {
                if (typeof sources[index].setVolume === 'function') {
                    sources[index].setVolume(value * 100);
                } else {
                    sources[index].volume = value;
                }
            }
        }

        function extractYouTubeID(url) {
            const match = url.match(/[\?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
            return match ? match[1] : null;
        }
        
        for (let i = 0; i < 4; i++) {
            addAudioControl(i);
        }
    </script>
</body>
</html>
