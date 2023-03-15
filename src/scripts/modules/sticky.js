window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('header--sticky', window.scrollY >= 60);
});
