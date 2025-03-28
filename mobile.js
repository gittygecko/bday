let highestZ = 1;

class Paper {
    holdingPaper = false;
    touchStartX = 0;
    touchStartY = 0;
    touchX = 0;
    touchY = 0;
    prevTouchX = 0;
    prevTouchY = 0;
    velX = 0;
    velY = 0;
    rotation = Math.random() * 30 - 15;
    currentPaperX = 0;
    currentPaperY = 0;
    rotating = false;

    init(paper) {
        // Helper to calculate touch or mouse position
        const getPos = (e) => {
            const isTouch = e.touches && e.touches.length > 0;
            return isTouch ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
        };

        // Handle mouse/touch movement
        const onMove = (e) => {
            const { x, y } = getPos(e);

            if (!this.rotating) {
                this.touchX = x;
                this.touchY = y;

                this.velX = this.touchX - this.prevTouchX;
                this.velY = this.touchY - this.prevTouchY;
            }

            const dirX = x - this.touchStartX;
            const dirY = y - this.touchStartY;
            const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
            const dirNormalizedX = dirX / dirLength;
            const dirNormalizedY = dirY / dirLength;

            const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
            let degrees = 180 * angle / Math.PI;
            degrees = (360 + Math.round(degrees)) % 360;

            if (this.rotating) {
                this.rotation = degrees;
            }

            if (this.holdingPaper) {
                if (!this.rotating) {
                    this.currentPaperX += this.velX;
                    this.currentPaperY += this.velY;
                }
                this.prevTouchX = this.touchX;
                this.prevTouchY = this.touchY;

                paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
            }
        };

        // Attach move listeners for both mouse and touch
        paper.addEventListener('mousemove', onMove);
        paper.addEventListener('touchmove', onMove);

        // Handle start of dragging or rotation for both mouse and touch
        paper.addEventListener('mousedown', (e) => {
            if (this.holdingPaper) return;

            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            const { x, y } = getPos(e);
            this.touchStartX = x;
            this.touchStartY = y;
            this.prevTouchX = this.touchStartX;
            this.prevTouchY = this.touchStartY;

            if (e.button === 2 || (e.touches && e.touches.length === 2)) {
                this.rotating = true;
            }
        });

        // Handle touchstart (for mobile)
        paper.addEventListener('touchstart', (e) => {
            if (this.holdingPaper) return;

            this.holdingPaper = true;
            paper.style.zIndex = highestZ;
            highestZ += 1;

            const { x, y } = getPos(e);
            this.touchStartX = x;
            this.touchStartY = y;
            this.prevTouchX = this.touchStartX;
            this.prevTouchY = this.touchStartY;

            // For rotating on two-finger touch
            if (e.touches && e.touches.length === 2) {
                this.rotating = true;
            }
        });

        // Handle touchend or mouseup (to stop dragging or rotation)
        const stopDragging = () => {
            this.holdingPaper = false;
            this.rotating = false;
        };

        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);

        // Prevent default behavior for right-click or long touch
        paper.addEventListener('contextmenu', (e) => e.preventDefault());
        paper.addEventListener('touchstart', (e) => e.preventDefault()); // Disable default touch behavior like scrolling
    }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
});
