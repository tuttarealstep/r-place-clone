export default class Sound {
    static highlight() {
        let audio = new Audio('./media/highlight.mp3');
        audio.play();
    }

    static closePalette() {        
        let audio = new Audio('./media/close-pallette.mp3');
        audio.play();
    }

    static selectColor() {
        let audio = new Audio('./media/select-color.mp3');
        audio.play();
    }

    static invalid() {
        let audio = new Audio('./media/invalid.mp3');
        audio.play();
    }
}