export default class Snake {
    constructor (grid, x, y, length = 1, direction = { x: 1, y: 0 }, color = '#62d323') {
        this.grid = grid;
        this.initialLength = length;
        this.direction = direction;
        this.segments = this.createSegments(x, y, direction, length);
        console.log(this.segments);
        this.color = color;
        this.turns = [];
        this.hasCollision = false;
    }

    get headPosition () {
        return this.segments[0].position;
    }

    get headDirection () {
        return this.segments[0].direction;
    }

    get footPosition () {
        return this.segments[this.segments.length - 1].position;
    }

    get footDirection () {
        return this.segments[this.segments.length - 1].direction;
    }

    createSegments (baseX, baseY, direction, length) {
        console.log(length);
        return [...Array(length)].map((_, i) => ({
            position: {
                x: baseX - i,
                y: baseY,
            },
            direction,
        }));
    }

    addSegments (amount = 1) {
        const position = {
            ...this.footPosition,
        };
        if (this.footDirection.x === 1) position.x -= 1;
        else if (this.footDirection.x === -1) position.x += 1;
        else if (this.footDirection.y === 1) position.y -= 1;
        else if (this.footDirection.y === -1) position.y += 1;

        this.segments.push({
            position,
            direction: {
                ...this.footDirection,
            },
        });
    }

    onTurnUp () {
        if (this.headDirection.y === -1 || this.headDirection.y === 1) return;
        const head = { ...this.segments[0] };
        const position = head.position;
        this.turns.push({
            position: {
                ...position,
            },
            direction: {
                x: 0,
                y: -1,
            },
        });
    }

    onTurnDown () {
        if (this.headDirection.y === 1 || this.headDirection.y === -1) return;
        this.turns.push({
            position: {
                ...this.headPosition,
            },
            direction: {
                x: 0,
                y: 1,
            },
        });
    }

    onTurnLeft () {
        if (this.headDirection.x === 1 || this.headDirection.x === -1) return;
        this.turns.push({
            position: {
                ...this.headPosition,
            },
            direction: {
                x: -1,
                y: 0,
            },
        });
    }

    onTurnRight () {
        if (this.headDirection.x === -1 || this.headDirection.x === 1) return;
        this.turns.push({
            position: {
                ...this.headPosition,
            },
            direction: {
                x: 1,
                y: 0,
            },
        });
    }

    getSegmentTurnDirection (turn, segment, segmentIndex) {
        if (turn.direction.y === 1 && this.segments[segmentIndex + 1]?.position.x -1 === segment.position.x) return 'right-to-bottom';
        else if (turn.direction.x === 1 && this.segments[segmentIndex + 1]?.position.y - 1 === segment.position.y) return 'bottom-to-right';
        else if (turn.direction.y === 1 && this.segments[segmentIndex + 1]?.position.x + 1 === segment.position.x) return 'left-to-bottom';
        else if (turn.direction.x === -1 && this.segments[segmentIndex + 1]?.position.y - 1 === segment.position.y) return 'bottom-to-left';
        else if (turn.direction.y === -1 && this.segments[segmentIndex + 1]?.position.x + 1 === segment.position.x) return 'left-to-top';
        else if (turn.direction.x === -1 && this.segments[segmentIndex + 1]?.position.y + 1 === segment.position.y) return 'top-to-left';
        else if (turn.direction.y === -1 && this.segments[segmentIndex + 1]?.position.x -1 === segment.position.x) return 'right-to-top';
        else if (turn.direction.x === 1 && this.segments[segmentIndex + 1]?.position.y + 1 === segment.position.y) return 'top-to-right';
        else return null;
    }

    update () {
        this.segments.forEach((segment, iSegment) => {
            const turnOnThisSegment = this.turns.find(turn => segment.position.x === turn.position.x && segment.position.y === turn.position.y);
            if (turnOnThisSegment) {
                segment.direction = {
                    ...turnOnThisSegment.direction,
                };
                if (iSegment === this.segments.length - 1) this.turns.splice(this.turns.indexOf(turnOnThisSegment), 1);
            }

            segment.position.x += segment.direction.x;
            segment.position.y += segment.direction.y;

            if (segment.position.x === this.grid.numberOfSegments) segment.position.x = 0;
            if (segment.position.x === -1) segment.position.x = this.grid.numberOfSegments;
            if (segment.position.y === this.grid.numberOfSegments) segment.position.y = 0;
            if (segment.position.y === -1) segment.position.y = this.grid.numberOfSegments;

            this.hasCollision = this.segments.slice(1, this.segments.length).findIndex(segment => segment.position.x === this.headPosition.x && segment.position.y === this.headPosition.y) > -1;
        });
    }

    draw () {
        this.grid.context.fillStyle = this.color;
        this.grid.context.strokeStyle = this.color;
        this.segments.forEach((segment, index) => {
            const turnOnThisSegment = this.turns.find(turn => segment.position.x === turn.position.x && segment.position.y === turn.position.y);
            const turnDirection = turnOnThisSegment ? this.getSegmentTurnDirection(turnOnThisSegment, segment, index) : null;
            if (index === 0) {
                this.grid.context.fillRect(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, this.grid.segmentsWidth);
            } else if (index === this.segments.length - 1) {
                this.grid.context.fillRect(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, this.grid.segmentsWidth);
            } else if (!turnDirection) {
                this.grid.context.fillRect(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, this.grid.segmentsWidth);
            } else if (turnDirection === 'right-to-bottom' || turnDirection === 'bottom-to-right') {
                this.grid.context.beginPath();
                this.grid.context.moveTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.arc(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth, this.grid.segmentsWidth, Math.PI, 1.5 * Math.PI);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.closePath();
                this.grid.context.fill();
            } else if (turnDirection === 'left-to-bottom' || turnDirection === 'bottom-to-left') {
                this.grid.context.beginPath();
                this.grid.context.moveTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.arc(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth, this.grid.segmentsWidth, 1.5 * Math.PI, 2 * Math.PI);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.closePath();
                this.grid.context.fill();
            } else if (turnDirection === 'left-to-top' || turnDirection === 'top-to-left') {
                this.grid.context.beginPath();
                this.grid.context.moveTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.arc(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, 0, 0.5 * Math.PI);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.closePath();
                this.grid.context.fill();
            } else if (turnDirection === 'right-to-top' || turnDirection === 'top-to-right') {
                this.grid.context.beginPath();
                this.grid.context.moveTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth + this.grid.segmentsWidth);
                this.grid.context.arc(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth, this.grid.segmentsWidth, Math.PI / 2, Math.PI);
                this.grid.context.lineTo(segment.position.x * this.grid.segmentsWidth + this.grid.segmentsWidth, segment.position.y * this.grid.segmentsWidth);
                this.grid.context.closePath();
                this.grid.context.fill();
            }
        });
    }
}
