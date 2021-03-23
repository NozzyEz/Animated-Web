// Variable declarations
let controller;
let curtainScene;
let pageScene;
let fashionScene;

// Selectors
const mouse = document.querySelector('.cursor');
const mouseText = document.querySelector('.cursor-text');
const burgerMenu = document.querySelector('.burger');
const logo = document.querySelector('#logo');

// Event Listeners
window.addEventListener('mousemove', cursor);
window.addEventListener('mousewheel', cursor);
window.addEventListener('mouseover', activeCursor);
burgerMenu.addEventListener('click', navToggle);

// Functions
//* Animates the sections on scroll for the main landing page
function animateMainSections() {
  // Here we initialize the controller so we can play the animations on scroll
  controller = new ScrollMagic.Controller();
  // We grab all the sections of the page so we can apply animations to each
  const curtains = document.querySelectorAll('.curtain');

  curtains.forEach((curtain, index, curtains) => {
    // For each section we grab the cover elements and the image so we can animate them
    const revealImg = curtain.querySelector('.reveal-img');
    const img = curtain.querySelector('img');
    const revealText = curtain.querySelector('.reveal-text');

    // By making a timeline object, we can have some default behaviours as well as chaining
    // animations together instead of having them all play at once.
    const curtainTimeline = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2.inOut',
      },
    });

    // .fromTo() takes it's target element as well as two objects as inputs, first object
    // specifies where the animation plays from, the other where it plays to
    curtainTimeline.fromTo(revealImg, {x: '0%'}, {x: '100%'});
    // By adding '-=1' we make the animation play earlier, in this case one second earlier, ie. at
    //the same time as above animation
    curtainTimeline.fromTo(img, {scale: 2}, {scale: 1}, '-=1');
    curtainTimeline.fromTo(revealText, {x: '0%'}, {x: '100%'}, '-=0.75');

    //  By creating a ScrollMagic scene we can trigger our animations at certain points
    curtainScene = new ScrollMagic.Scene({
      triggerElement: curtain, // we set the element as the trigger
      // Then we define where on the y-axis we want the hook, when this crosses the trigger,
      // is when we play the animation
      triggerHook: 0.25,
      reverse: false, // This makes it so the animation doesn't reserve when scrolling back up
    })
      // By adding indications we get a visual representation on the webpage
      // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'curtain'})
      // we can add the timeline of our animations so they are triggered on the correct hook, other-
      // wise they would all animation on the first trigger
      .setTween(curtainTimeline)
      // Finally we need to add it to the controller for it to work
      .addTo(controller);

    pageTimeline = gsap.timeline();
    // Here we assign the next curtain in the loop if there is one, otherwise we assign nextCurtain to null
    let nextCurtain = curtains.length - 1 === index ? null : curtains[index + 1];
    // if we have a next slide, we push it down by 50% so the current slide can linger for a bit
    pageTimeline.fromTo(nextCurtain, {y: '0%'}, {y: '50%'});
    pageTimeline.fromTo(curtain, {opacity: 1, scale: 1}, {opacity: 0, scale: 0.5});
    // we make sure to move it back afterwards so we can see it
    pageTimeline.fromTo(nextCurtain, {y: '50%'}, {y: '0%'});
    pageScene = new ScrollMagic.Scene({
      triggerElement: curtain,
      duration: '100%', // duration means for how much of the page scroll we want the animation
      triggerHook: 0, // again, triggerHook defines where on the y-axis we get triggered, 0 = top
    })
      // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'page', indent: 200})
      // By setPin() we have a static endpoint, and with the puyshFollowered disabled, we can avoid
      // section sized whitespace when we scroll
      .setPin(curtain, {pushFollowers: false})
      .setTween(pageTimeline)
      .addTo(controller);
  });
}

//* Animate scroll for the fashion page
function animateFashion() {
  controller = new ScrollMagic.Controller();
  slides = document.querySelectorAll('.detail-slide');

  slides.forEach((slide, index, slides) => {
    const slideTimeline = gsap.timeline({
      defaults: {
        duration: 1,
      },
    });

    let nextSlide = slides.length - 1 === index ? null : slides[index + 1];
    const nextImg = nextSlide.querySelector('img');

    slideTimeline.fromTo(slide, {opacity: 1}, {opacity: 0});
    slideTimeline.fromTo(nextSlide, {opacity: 0}, {opacity: 1}, '-=1');
    slideTimeline.fromTo(nextImg, {x: '150%'}, {x: '0%'}, '-=1');

    fashionScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '70%',
      triggerHook: 0,
    })
      .setPin(slide, {pushFollowers: false})
      .setTween(slideTimeline)
      // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'fashion'})
      .addTo(controller);
  });
}

//* Navigation bar is animated seperately so it doesn't play more than once on pageload
function animateNav() {
  const nav = document.querySelector('.nav-header');

  const timeline = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power2.inOut',
    },
  });
  timeline.fromTo(nav, {y: '-100%'}, {y: '0%'});
}

//* Function to move our custom cursor around with mouse movement and scroll
function cursor(e) {
  // console.log(e);
  mouse.style.top = e.pageY + 'px';
  mouse.style.left = e.pageX + 'px';
}

//* Changes the behaviour of the cursor depending on which element is hovered
function activeCursor(e) {
  const item = e.target;
  // console.log(item);
  if (item.id === 'logo') {
    mouse.classList.add('nav-active');
  } else if (item.classList.contains('burger')) {
    mouse.classList.add('nav-active');
    // mouseText.innerText = 'Menu';
  } else if (item.classList.contains('explore')) {
    mouse.classList.add('exp-active');
    mouseText.innerText = 'Tap';
    gsap.to('.title-swipe', 1, {y: '0%'});
  } else {
    mouse.classList.remove('nav-active');
    mouse.classList.remove('exp-active');
    mouseText.innerText = '';
    gsap.to('.title-swipe', 1, {y: '100%'});
  }
}

//* Animation to explode the navigation menu when the burger element is clicked, or imploded if it's clicked again
function navToggle(e) {
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    gsap.to('.line1', 0.5, {rotate: '45', y: 3.1, background: '#1e1f22'});
    gsap.to('.line2', 0.5, {rotate: '-45', y: -3.1, background: '#1e1f22'});
    gsap.to('#logo', 0.5, {color: '#1e1f22'});
    gsap.to('.nav-bar', 1, {clipPath: 'circle(2500px at 100% -10%)'});
    mouse.classList.add('burger-active');
    document.body.classList.add('hide');
  } else {
    e.target.classList.remove('active');
    gsap.to('.line1', 0.5, {rotate: '0', y: 0, background: 'rgb(226, 225, 225)'});
    gsap.to('.line2', 0.5, {rotate: '0', y: 0, background: 'rgb(226, 225, 225)'});
    gsap.to('#logo', 0.5, {color: 'rgb(226, 225, 225)'});
    gsap.to('.nav-bar', 1, {clipPath: 'circle(50px at 100% -10%)'});
    mouse.classList.remove('burger-active');
    document.body.classList.remove('hide');
  }
}

//* BarbaJS initialization and page transistions
barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        logo.href = './index.html';
        animateMainSections();
        animateNav();
        // console.log(logo);
      },
      beforeLeave() {
        logo.href = '../index.html';
        curtainScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: 'fashion',
      beforeEnter() {
        logo.href = '../index.html';
        animateFashion();
        animateNav();
        // console.log(logo);
      },
      beforeLeave() {
        fashionScene.destroy();
        controller.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({current, next}) {
        let done = this.async();
        const timeline = gsap.timeline({
          defaults: {
            ease: 'power2.inOut',
          },
        });
        timeline.fromTo(current.container, 1, {opacity: 1}, {opacity: 0});
        timeline.fromTo('.swipe', 0.75, {x: '-100%'}, {x: '0%', onComplete: done}, '-=0.5');
      },
      enter({current, next}) {
        let done = this.async();
        window.scrollTo(0, 0);
        const timeline = gsap.timeline({
          defaults: {
            ease: 'power2.inOut',
          },
        });
        timeline.fromTo('.swipe', 0.75, {x: '0%'}, {x: '100%', stagger: 0.25, onComplete: done});
        timeline.fromTo(next.container, 1, {opacity: 0}, {opacity: 1});
      },
    },
  ],
});

// Initialization of the app
