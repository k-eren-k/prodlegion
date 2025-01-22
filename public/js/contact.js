document.addEventListener("DOMContentLoaded", function () {
  const socialIcons = document.querySelectorAll(".social-icon");

  socialIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      socialIcons.forEach((i) => {
        if (i !== icon) i.classList.remove("active");
      });

      this.classList.toggle("active");
    });
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".social-icon")) {
      socialIcons.forEach((icon) => icon.classList.remove("active"));
    }
  });
});
