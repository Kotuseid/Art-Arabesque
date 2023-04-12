class Line {
    constructor(x = [], y = [], centers = [], color, width) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.centers = [];
        for (let i = 0; i < centers.length; i++) {
            this.centers.push(new Center(centers[i].id, centers[i].x, centers[i].y, clone(centers[i].settings)));
        }
    }

    draw(ctx) {
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;


        if (this.centers[0]) {
            for (let i = 0; i < this.centers.length; i++) {
                for (let j = 0; j < this.centers[i].settings.rotations; j++) {
                    ctx.save();

                    ctx.translate(this.centers[i].x, this.centers[i].y);
                    ctx.rotate((Math.PI * 2 / this.centers[i].settings.rotations) * j);
                    ctx.translate(-this.centers[i].x, -this.centers[i].y)

                    ctx.beginPath();

                    ctx.moveTo(this.x[0], this.y[0]);

                    for (let i = 1; i < this.x.length; i++) {
                        ctx.lineTo(this.x[i], this.y[i]);
                    }

                    ctx.stroke();

                    ctx.translate(this.centers[i].x, this.centers[i].y);
                    ctx.scale(-1, 1);
                    ctx.translate(-this.centers[i].x, -this.centers[i].y)


                    ctx.beginPath();

                    ctx.moveTo(this.x[0], this.y[0]);

                    for (let i = 1; i < this.x.length; i++) {
                        ctx.lineTo(this.x[i], this.y[i]);
                    }

                    ctx.stroke();
                    ctx.restore();

                }
            }
        } else {
            ctx.beginPath();

            ctx.moveTo(this.x[0], this.y[0]);

            for (let i = 1; i < this.x.length; i++) {
                ctx.lineTo(this.x[i], this.y[i]);
            }

            ctx.stroke();
        }
    }
}

