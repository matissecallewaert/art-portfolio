document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("carousel");
  const scrollLeftButton = document.getElementById("scroll-left");
  const scrollRightButton = document.getElementById("scroll-right");
  let containerWidth;
  const buttonWidth = scrollLeftButton.offsetWidth + 10; // Including margin

  let arrow = document.createElement("div");
  let icon = document.createElement("i");
  icon.classList.add("fas", "fa-arrow-down");
  arrow.appendChild(icon);
  arrow.classList.add("arrow");
  document.body.appendChild(arrow);

  let lastScrollPosition = 0;

  window.addEventListener("scroll", function () {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    // Scroll down
    if (scrollPosition > lastScrollPosition) {
      if (scrollPosition < windowHeight) {
        window.scrollTo({ top: windowHeight, behavior: "smooth" });
        arrow.style.transform = "rotate(180deg)";
        arrow.style.top = "100%";
      }
    }
    // Scroll up
    else {
      if (scrollPosition > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        arrow.style.transform = "rotate(0deg)";
        arrow.style.top = "calc(100% - 50px)";
      }
    }

    lastScrollPosition = scrollPosition;
  });

  fetch("/project/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const nametag = document.getElementById("name");
      nametag.textContent = data.name;
      const nametitle = document.getElementById("title-name");
      nametitle.textContent += data.name;
      const description = document.getElementById("description");
      description.textContent = data.description;
      const button1 = document.getElementById("button1");
      button1.textContent = data.button_1_name;
      button1.href = "mailto:" + data.button_1_email;
      const button2 = document.getElementById("button2");
      button2.textContent = data.button_2_name;
      button2.href = data.button_2_link;
      const button3 = document.getElementById("button3");
      button3.textContent = data.button_3_name;
      button3.href = data.button_3_link;

      const homeImage = document.getElementById("home-image");
      homeImage.src = data.home_image;

      for (project in data.projects) {
        const link = document.createElement("a");
        link.href = `/project?id=${data.projects[project].id}`;
        link.classList.add("link-wrapper");

        const div = document.createElement("div");
        div.classList.add("container");

        const img = document.createElement("img");
        img.src = data.projects[project].images[0];
        img.alt = data.projects[project].title;

        const textDiv = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = data.projects[project].title;

        const p = document.createElement("p");
        p.textContent = data.projects[project].description.slice(0, 50) + "...";

        textDiv.appendChild(title);
        textDiv.appendChild(p);

        div.appendChild(img);
        div.appendChild(textDiv);

        link.appendChild(div);

        carousel.appendChild(link);
      }

      containerWidth = document.querySelector(".container").offsetWidth + 10; // Including margin
      // Initial setup
      updateCarouselWidth();
    })
    .catch((error) => console.error("Error loading project data:", error));

  function updateCarouselWidth() {
    const viewportWidth =
      document.documentElement.clientWidth - 2 * buttonWidth - 10; // 20px margin on each side
    const visibleContainers = Math.floor(viewportWidth / containerWidth);
    const newCarouselWidth = visibleContainers * containerWidth; // 10px margin on the right
    carousel.style.width = newCarouselWidth + "px";
    checkButtons();
  }

  // Check if the scroll buttons should be enabled or disabled
  function checkButtons() {
    scrollLeftButton.disabled = carousel.scrollLeft === 0;
    scrollRightButton.disabled =
      carousel.scrollWidth - carousel.clientWidth <= carousel.scrollLeft;
  }

  scrollLeftButton.addEventListener("click", function () {
    const newScrollPosition = Math.max(0, carousel.scrollLeft - containerWidth);
    carousel.scrollTo({ left: newScrollPosition, behavior: "smooth" });
  });

  scrollRightButton.addEventListener("click", function () {
    const newScrollPosition = Math.min(
      carousel.scrollWidth - carousel.clientWidth,
      carousel.scrollLeft + containerWidth
    );
    carousel.scrollTo({ left: newScrollPosition, behavior: "smooth" });
  });

  // Adjust carousel width and button states on window resize
  window.addEventListener("resize", function () {
    updateCarouselWidth();
  });

  // Re-check button state on scroll
  carousel.addEventListener("scroll", checkButtons);
});

window.addEventListener("resize", function () {
  if (window.innerWidth < 860) {
    const aboutDiv = document.querySelector(".about > div");
    const aboutHeight = aboutDiv.offsetHeight;
    const img = aboutDiv.querySelector("img");

    if (img !== null) {
      img.style.height = `calc(100vh - ${aboutHeight}px)`;
    }
  }
});

window.dispatchEvent(new Event("resize"));
