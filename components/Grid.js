export default class Grid {
    constructor (canvas, width, height, numberOfSegments) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.numberOfSegments = numberOfSegments;

        this.setup();
    }

    setup () {
        this.canvas.style.width = `${ this.width }px`;
        this.canvas.style.height = `${ this.height }px`;
        this.width *= window.devicePixelRatio;
        this.height *= window.devicePixelRatio;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        this.segmentsWidth = this.width / this.numberOfSegments;
    }

    draw () {
        this.context.clearRect(0, 0, this.width, this.height);

        this.context.beginPath();
        this.context.moveTo(0, 0);

        for (let i = 0; i <= this.width; i += this.segmentsWidth) {
            this.context.moveTo(i, 0);
            this.context.lineTo(i, this.height);
        }

        for (let i = 0; i <= this.height; i += this.segmentsWidth) {
            this.context.moveTo(0, i);
            this.context.lineTo(this.width, i);
        }

        this.context.stroke();
    }

}
