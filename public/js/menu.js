function toggleMenu() {
  const menu = document.querySelector(".legion-buttons");
  const icon = document.getElementById("menuIcon");
  menu.classList.toggle("show");

  if (menu.classList.contains("show")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-bars-sort");
  } else {
    icon.classList.remove("fa-bars-sort");
    icon.classList.add("fa-bars"); 
  }
}
