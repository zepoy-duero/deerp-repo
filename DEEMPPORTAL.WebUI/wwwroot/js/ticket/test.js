const bubbleBtn = document.getElementById("draggableBubble");
let isDragging = false;
let offsetX, offsetY;
$(async function () {
    bubbleBtn.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    // Mobile Touch Events
    bubbleBtn.addEventListener("touchstart", dragStart, { passive: false });
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("touchend", dragEnd);
})
function dragStart(e) {
    // Prevent default touch scrolling when dragging on mobile
    if (e.type === "touchstart") {
        offsetX = e.touches[0].clientX - bubbleBtn.getBoundingClientRect().left;
        offsetY = e.touches[0].clientY - bubbleBtn.getBoundingClientRect().top;
    } else {
        offsetX = e.clientX - bubbleBtn.getBoundingClientRect().left;
        offsetY = e.clientY - bubbleBtn.getBoundingClientRect().top;
    }
    isDragging = true;
}

// Function to handle moving the element
function dragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

    // Calculate new positions relative to viewport boundary limits
    let left = clientX - offsetX;
    let top = clientY - offsetY;

    // Boundary constraints to keep it inside the screen
    left = Math.max(0, Math.min(left, window.innerWidth - bubbleBtn.offsetWidth));
    top = Math.max(0, Math.min(top, window.innerHeight - bubbleBtn.offsetHeight));

    // Apply styles to override default bottom/right placement
    bubbleBtn.style.left = left + "px";
    bubbleBtn.style.top = top + "px";
    bubbleBtn.style.bottom = "auto";
    bubbleBtn.style.right = "auto";
}

// Function to end drag
function dragEnd() {
    isDragging = false;
}

// Desktop Mouse Events
