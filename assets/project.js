let currentPhotoIndex = 0;
let photos = document.querySelectorAll(".photo img");
const overlay = document.getElementById("photoOverlay");
const overlayImage = document.getElementById("overlayImage");

document.addEventListener("DOMContentLoaded", function () {
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  fetch("projects.json")
    .then((response) => response.json())
    .then((data) => {
      data = data.projects;
      const projectId = getQueryParam("id");
      const project = data.find((proj) => proj.id === projectId);

      if (project) {
        document.getElementById("project-title").textContent = project.title;
        document.title = project.title;
        document.getElementById("title-name").textContent = project.title;
        document.getElementById("project-description").textContent =
          project.description;

        const imagesContainer = document.getElementById("photos-section");
        shuffleArray(project.images).forEach((image) => {
          const div = document.createElement("div");
          div.classList.add("photo");
          div.onclick = () => showPhoto(div);

          const imgElement = document.createElement("img");
          imgElement.src = image;
          imgElement.alt = project.title;

          div.appendChild(imgElement);
          imagesContainer.appendChild(div);
        });

        photos = document.querySelectorAll(".photo img");

        document.querySelectorAll(".photo").forEach((photo) => {
          let randomRotation =
            (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 50 - 15) + "deg";
          let randomTranslationX =
            (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 75 - 10) + "px";
          let randomTranslationY = Math.random() * 75 - 10;

          const photoRect = photo.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (photoRect.top < windowHeight / 2) {
            randomTranslationY = randomTranslationY + "px";
          } else {
            randomTranslationY = "-" + randomTranslationY + "px";
          }

          photo.style.setProperty("--rotation", randomRotation);
          photo.style.setProperty("--translationX", randomTranslationX);
          photo.style.setProperty("--translationY", randomTranslationY);
        });
      } else {
        document.querySelector(".project-container").innerHTML =
          "<p>Project not found.</p>";
      }
    })
    .catch((error) => console.error("Error loading project data:", error));

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closePhoto();
    }
    if (event.key === "ArrowLeft") {
      changePhoto(-1);
    }
    if (event.key === "ArrowRight") {
      changePhoto(1);
    }
  });
});

function showPhoto(element) {
  currentPhotoIndex = [...photos].indexOf(element.querySelector("img"));
  overlayImage.src = element.querySelector("img").src;
  overlay.style.display = "flex";
}

function closePhoto() {
  overlay.style.display = "none";
}

function changePhoto(direction) {
  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) {
    currentPhotoIndex = photos.length - 1;
  } else if (currentPhotoIndex >= photos.length) {
    currentPhotoIndex = 0;
  }
  overlayImage.src = photos[currentPhotoIndex].src;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
