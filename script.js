window.addEventListener('load', () => {
    const ticker = document.querySelector('.creator-ticker');
    const track = document.querySelector('.creator-track');
    if (!ticker || !track) return;

    // clone the cards until the track is long enough to loop seamlessly
    const originals = Array.from(track.children);
    const addSet = () => originals.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.tabIndex = -1;
        track.appendChild(clone);
    });

    addSet();
    const setWidth = track.children[originals.length].offsetLeft - track.children[0].offsetLeft;
    if (setWidth <= 0) return;
    while (track.scrollWidth < ticker.offsetWidth + setWidth) addSet();

    let x = 0;
    let speed = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.6;
    let dragging = false, hovering = false, moved = false;
    let startX = 0, startPos = 0;

    const tick = () => {
        if (!dragging && !hovering) x -= speed;
        x = ((x % setWidth) + setWidth) % setWidth - setWidth;   // wraps for the endless loop
        track.style.transform = `translate3d(${x}px, 0, 0)`;
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    ticker.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startPos = x;
        ticker.classList.add('dragging');
    });
    window.addEventListener('pointermove', e => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 5) moved = true;
        x = startPos + dx;
    });
    const stop = () => {
        dragging = false;
        ticker.classList.remove('dragging');
    };
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);

    ticker.addEventListener('mouseenter', () => hovering = true);
    ticker.addEventListener('mouseleave', () => hovering = false);
    ticker.addEventListener('dragstart', e => e.preventDefault());

    // don't open the link if the user was dragging
    ticker.addEventListener('click', e => {
        if (moved) {
            e.preventDefault();
            moved = false;
        }
    }, true);
});
const header = document.querySelector('.header');

const updateHeader = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 50);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();   // also runs on load, in case the page opens already scrolled

