function play(note) {
    const a = new Audio(`../audio/${note}.mp3`);
    a.currentTime = 0;
    a.play().catch(() => { });
}