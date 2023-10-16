const imagesLI = document.querySelector(".images");
const load_more = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-input");
const lightbox = document.querySelector(".lighthouse");
const categoryButtons = document.querySelectorAll(".category-button");
const closeLighthouse = document.querySelector(".close");

let searchTerm = null;
let pageNo = 1;
const API_key = "vmfm3Az7V1pQG0YNO3p24NoZpWFOnFTfL7kCkWoS81LmGtZmPuyeUcgm";
const url = `https://api.pexels.com/v1/curated?page=${pageNo}&per_page=15`;

const loadMoreImages = async () => {
  pageNo++;
  let Nexturl = `https://api.pexels.com/v1/curated?page=${pageNo}&per_page=15`;

  Nexturl = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${pageNo}&per_page=15`
    : Nexturl;
  getImages(Nexturl);
};

const downloadImg = (imgUrl) => {
  // Converting received img to blob, creating its download link, & downloading it
  fetch(imgUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download image!"));
};

const showLightbox = (name, img) => {
  lightbox.querySelector("img").src = img;
  lightbox.querySelector("span").innerText = name;

  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  // Hiding lightbox on close icon click
  lightbox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  images
    .map(
      (image) =>
        (imagesLI.innerHTML += ` <li class="card">
        <img onclick="showLightbox('${image.photographer}', '${image.src.large2x}')" src="${image.src.large2x}" alt="img">
                        <div class="details">
                        <div class="phographer">
                            <i class="fa-solid fa-camera"></i>
                            <span>${image.photographer}</span>

                            <p class="title">Lorem ipsum dolor sit amet</p>
                        </div>
                        <div>
                        <button onclick="downloadImg('${image.src.large2x}');"><i class="fa-solid fa-cloud-arrow-down"></i></button>
                        </div>
                        </div>
                    </li>`)
    )
    .join("");
};

const getImages = async (url) => {
  try {
    searchInput.blur();
    load_more.innerHTML = "loading images...";
    load_more.classList.add("disable");
    const res = await fetch(url, {
      headers: { Authorization: API_key },
    });
    const data = await res.json();
    generateHTML(data.photos);

    load_more.innerHTML = "load more";
    load_more.classList.remove("disable");
    console.log(data.photos);
  } catch (error) {
    console.log("there was an error", error);
  }
};
getImages(url);

const loadSearchImages = (e) => {
  e.preventDefault();
  if (e.target.value === "") return (searchTerm = null);

  if (e.key === "Enter") {
    searchTerm = e.target.value;
    imagesLI.innerHTML = "";
    let url = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${pageNo}&per_page=15`;
    getImages(url);
  }
};

categoryButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const category = this.textContent;

    console.log(category);
    filterImagesByCategory(category);
  });
});

function filterImagesByCategory(category) {
  imagesLI.innerHTML = "";
  const url = `https://api.pexels.com/v1/search?query=${category}&page=${pageNo}&per_page=15`;
  getImages(url);
}
load_more.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeLighthouse.addEventListener("click", hideLightbox);
