const button = document.getElementById("scroll-top-button");
const circle = document.querySelector(".progress-ring__circle");
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = circumference;

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function handleScroll() {
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const scrollPosition = window.pageYOffset;
  const scrollPercentage = (scrollPosition / totalHeight) * 100;

  setProgress(scrollPercentage);

  if (scrollPosition > 100) {
    button.classList.add("visible");
  } else {
    button.classList.remove("visible");
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.addEventListener("scroll", handleScroll);
button.addEventListener("click", scrollToTop);
