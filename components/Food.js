export default class Food {

    constructor (grid, snake, frequency = 4000, color = '#ff5bb2') {
        this.grid = grid;
        this.snake = snake;
        this.items = [];
        this.frequency = frequency;
        this.color = color;

        this.start();
    }

    start () {
        setInterval(() => {
            if (this.items.length <= 3) this.addItem();
        }, this.frequency);
    }

    addItem () {
        const randomX = Math.floor(Math.random() * this.grid.numberOfSegments);
        const randomY = Math.floor(Math.random() * this.grid.numberOfSegments);
        const isSnakeOnRandomPosition = this.snake.segments.findIndex(segment => segment.position.x === randomX && segment.position.y === randomY) > -1;

        if (isSnakeOnRandomPosition) this.addItem();
        else {
            this.items.push({
                position: {
                    x: Math.floor(Math.random() * this.grid.numberOfSegments),
                    y: Math.floor(Math.random() * this.grid.numberOfSegments),
                },
            });
        }
    }

    removeItem (item) {
        this.items.splice(this.items.indexOf(item), 1);
    }

    draw () {
        this.grid.context.fillStyle = this.color;
        for (const item of this.items) {
            this.grid.context.fillRect(item.position.x * this.grid.segmentsWidth, item.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, this.grid.segmentsWidth);
        }
    }
}
