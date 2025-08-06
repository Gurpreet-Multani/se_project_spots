import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

//New Functions
function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

//Edit Profile Button
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileFormEl = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

//Name & Description Elements
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

//New Post Button
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
// new code added here stage 9
// `cardSubmitBtn` is not used so it was removed to reduce clutter
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
//select form and both inputs
const editPostFormEl = newPostModal.querySelector(".modal__form");
const editPostNameInput = newPostModal.querySelector("#card-image-input");
const editPostDescriptionInput = newPostModal.querySelector(
  "#card-caption-input"
);

editProfileBtn.addEventListener("click", function () {
  openModal(editProfileModal);
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

//Edit Profile adding functionally
function handleProfileFormSubmit(evt) {
  evt.preventDefault();

  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;

  // Close the modal.
  closeModal(editProfileModal);
}

// Set the submit listener.
editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);

//New Post adding functionally
function handleAddCardSubmit(evt) {
  evt.preventDefault();

  // Spot stage 8
  const inputValues = {
    // FIXED: Swapped inputs to match the HTML
    name: editPostDescriptionInput.value,
    link: editPostNameInput.value,
  };

  const cardElement = getCardElement(inputValues);
  cardList.prepend(cardElement);

  // Close the modal.
  closeModal(newPostModal);
  evt.target.reset();
  // Call this after resetting the form to disable the button
  enableValidation(settings);
}

// Create the submit listener.
editPostFormEl.addEventListener("submit", handleAddCardSubmit);

//Spot stage 8
//working with temp down here
//------------------------------------------------------------------------------------

// FIXED: Added `const` to declare the variable
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

//Make Get Card Function
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikebtnEl = cardElement.querySelector(".card__like-btn");
  cardLikebtnEl.addEventListener("click", () => {
    cardLikebtnEl.classList.toggle("card__like-btn_active");
  });

  const carddeletebtn = cardElement.querySelector(".card__delete");
  carddeletebtn.addEventListener("click", function () {
    carddeletebtn.closest(".card").remove();
  });

  //preview open
  cardImageEl.addEventListener("click", function () {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewNameEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

const cardList = document.querySelector(".cards__list");

initialCards.forEach(function (item) {
  const cardElement = getCardElement(item);
  cardList.append(cardElement);
});

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewNameEl = previewModal.querySelector(".modal__caption");

//Close button
previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

enableValidation(settings);
