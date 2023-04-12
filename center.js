class Center {
    constructor(id, x = 0, y = 0, settings = {}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = 2;
        this.settings = settings;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        if (this.settings.active) {
            ctx.fillStyle = 'green';
        }
        ctx.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
    }
}