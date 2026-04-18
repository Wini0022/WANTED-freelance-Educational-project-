let header_button = document.querySelector(".freelance__button");
let forms = document.querySelectorAll(".account__enter");

if (header_button && forms.length) {
  header_button.addEventListener("click", () => {
    let isHidden = forms[0].style.display === "" || forms[0].style.display === "none";

    forms.forEach((form) => {
      form.style.display = isHidden ? "block" : "none";
    });
  });
}