import TitleScene from './TitleScene.js';
import GameScene from './GameScene.js';


var gameScene = new GameScene()

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game",
    dom: {
        createContainer: true
    },
    scale: {
        mode:Phaser.Scale.NONE,
    }
};

var game = new Phaser.Game(config);

var titleScene = new TitleScene((name) => {
    gameScene.name = name
    game.scene.start('game')
})
game.scene.add('title', titleScene)
game.scene.add('game', gameScene)

game.scene.start('title')

document.getElementById("")

//for debugging on the school chromebooks they fricking banned dev console
window.onerror = function(msg, url, line) {
    document.write("Error : " + msg + "<br><br>");
    document.write("Line number : " + line + "<br><br>");
    document.write("File : " + url);
}