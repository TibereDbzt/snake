import './style.css'
import Grid from './components/Grid';
import Snake from './components/Snake';
import Food from './components/Food';
import Game from './components/Game';

const onClickStart = (canvas, startButton) => {
    startButton.setAttribute('disabled', '');

    const grid = new Grid(canvas, 600, 600, 15);
    const snake = new Snake(grid, Math.floor(grid.numberOfSegments / 2), Math.floor(grid.numberOfSegments / 2), 7);
    const food = new Food(grid, snake);
    const game = new Game(grid, snake, food, 12);

    game.start();
};

const onLoad = () => {
    const canvas = document.getElementById('canvas');
    const startButton = document.querySelector('.js-start-button');

    startButton.addEventListener('click', () => onClickStart(canvas, startButton))
};

window.addEventListener('load', onLoad);
