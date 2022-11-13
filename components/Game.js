export default class Game {
    constructor (grid, snake, food, fps = 10, debug = false) {
        this.grid = grid;
        this.snake = snake;
        this.food = food;

        this.options = {
            debug,
        };

        this.state = {
            paused: false,
        };

        this.fps = fps;
        this.time = {
            interval: 1000 / this.fps,
            now: null,
            delta: null,
            then: null,
        };
        this.RAQ = null;

        this.score = {
            best: parseInt(window.localStorage.getItem('snake-best') ?? 0),
            current: 0,
        };
        this.elements = {
            bestScore: document.querySelector('.js-best-score'),
            currentScore: document.querySelector('.js-current-score'),
            startButton: document.querySelector('.js-start-button'),
        };

        this.elements.bestScore.innerHTML = `${ this.score.best }`;

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.update = this.update.bind(this);
    }

    start () {
        this.addEvents();
        this.time.then = performance.now();
        this.RAQ = requestAnimationFrame(this.update);
    }

    end () {
        cancelAnimationFrame(this.RAQ);
        this.elements.startButton.removeAttribute('disabled');
        alert('you lose');
    }

    addEvents () {
        document.addEventListener('keydown', this.onKeyDown);
        if (this.options.debug) {
            document.addEventListener('click', this.onClick);
        }
    }

    onKeyDown (e) {
        if (e.keyCode === 90) this.snake.onTurnUp();
        if (e.keyCode === 83) this.snake.onTurnDown();
        if (e.keyCode === 81) this.snake.onTurnLeft();
        if (e.keyCode === 68) this.snake.onTurnRight();
    }

    onClick() {
        this.state.paused = !this.state.paused;
    }

    checkIsOnFoodItem () {
        for (const foodItem of this.food.items) {
            if (this.snake.headPosition.x === foodItem.position.x && this.snake.headPosition.y === foodItem.position.y) {
                this.snake.addSegments(1);
                this.food.removeItem(foodItem);
            }
        }
    }

    updateCurrentScore (snakeGrowLength) {
        this.score.current = snakeGrowLength * 10;
        this.elements.currentScore.innerHTML = this.score.current;
    }

    updateBestScore () {
        if (this.score.current >= this.score.best) {
            this.score.best = this.score.current;
            this.elements.bestScore.innerHTML = `${ this.score.best }`;
            window.localStorage.setItem('snake-best', `${ this.score.best }`);
        }
    }

    update () {
        this.RAQ = requestAnimationFrame(this.update);

        if (this.state.paused) return;

        this.time.now = performance.now();
        this.time.delta = this.time.now - this.time.then;

        if (this.time.delta < this.time.interval) return;

        this.time.then = this.time.now - (this.time.delta % this.time.interval);

        this.snake.update();
        if (this.snake.hasCollision) this.end();
        this.checkIsOnFoodItem();

        this.updateCurrentScore(this.snake.segments.length - this.snake.initialLength);
        this.updateBestScore();

        this.grid.draw();
        this.snake.draw();
        this.food.draw();
    }
}
