import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

//this code refers to Api.js
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f30ceff3-b3e8-42fb-ae90-fe3a587f05fd", // Replace with your actual token
    "Content-Type": "application/json",
  },
});

// All DOM element selections moved to the top to fix ReferenceErrors
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
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const editPostFormEl = newPostModal.querySelector(".modal__form");
const editPostNameInput = newPostModal.querySelector("#card-image-input");
const editPostDescriptionInput = newPostModal.querySelector(
  "#card-caption-input"
);
const cardList = document.querySelector(".cards__list");
//declare the x button through id
const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);
const previewImageEl = previewModal.querySelector(".modal__image");
const previewNameEl = previewModal.querySelector(".modal__caption");
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const DeleteModal = document.querySelector("#delete-modal");
const DeleteBtn = document.querySelector(".modal__delete-btn");
const CancelBtn = DeleteModal.querySelector(".modal__submit-btn");
const CloseBtnDelete = document.querySelector(".modal__close-btn-position");

//funcationality added to close button
CloseBtnDelete.addEventListener("click", function () {
  closeModal(DeleteModal);
});

//functionality added to cancel button here
CancelBtn.addEventListener("click", function () {
  closeModal(DeleteModal);
});

// Variables to store the selected card for deletion
let selectedCardId;
let selectedCard;

// 1. Loading user info from the server
api
  .getUserInfo()
  .then((userData) => {
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;
    console.log(userData);
  })
  .catch((err) => {
    console.error(err);
  });

// 2. Loading cards from the server
api
  .getInitialCards()
  .then((CardssData) => {
    CardssData.forEach((item) => {
      const cardEl = getCardElement(item);
      cardList.append(cardEl);
      console.log(CardssData);
    });
  })
  .catch((err) => {
    console.error(err);
  });

// New Functions
function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal_is-opened")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscapeKey);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscapeKey);
  modal.removeEventListener("click", handleOverlayClick);
}

// Edit Profile Button Listeners
editProfileBtn.addEventListener("click", function () {
  resetValidation(editProfileFormEl, settings, [
    editProfileNameInput,
    editProfileDescriptionInput,
  ]);
  openModal(editProfileModal);
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

//close preview button event added
previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

// New Post Button Listeners
newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

// Edit Profile adding functionality
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    });
}
editProfileFormEl.addEventListener("submit", handleProfileFormSubmit);

// New Post adding functionality
function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: editPostDescriptionInput.value,
    link: editPostNameInput.value,
  };
  api
    .addCard(inputValues)
    .then((newCardData) => {
      const cardElement = getCardElement(newCardData);
      cardList.prepend(cardElement);
      closeModal(newPostModal);
      evt.target.reset();
      enableValidation(settings);
    })
    .catch((err) => {
      console.error(err);
    });
}
editPostFormEl.addEventListener("submit", handleAddCardSubmit);

//DeleteBtn is the one we want to add event click and run api.DeleteCard
DeleteBtn.addEventListener("click", function (event) {
  event.preventDefault();
  api
    .DeleteCard({ id: selectedCardId })
    .then(() => {
      // Remove the card element from the DOM after successful deletion.
      selectedCard.remove();
      // Close the modal.
      closeModal(DeleteModal);
    })
    .catch((err) => {
      console.error(err);
    });
});

//Are you sure Modal

//Editprofileavatar (MEANT TO OPEN A MODAL)
const avatarModal = document.querySelector("#modal__avatar");
const profileavatarButton = document.querySelector(".profile__avatar-btn");
//Submit Avatar link Button (sends a api request to replace the image/avatar:image)
const SubmitButtonAvatar = document.querySelector(".submit-avatar-btn");
const editAvatarInput = document.querySelector("#Avatar-image-input");
//declared
//avatarModal = modal div
const XButtonAvatar = avatarModal.querySelector(".modal__close-btn");

//close avatar button event added
XButtonAvatar.addEventListener("click", function () {
  closeModal(avatarModal);
});

//add eventlistner to avater edit
profileavatarButton.addEventListener("click", function (event) {
  // stop the page to reload
  event.preventDefault();
  // opens avatarModal
  openModal(avatarModal);
});

SubmitButtonAvatar.addEventListener("click", function (event) {
  event.preventDefault();

  const urlavatar = editAvatarInput.value;
  console.log("Starting avatar update with:", urlavatar);
  console.log("Current profileAvatar:", profileAvatar);

  api
    .editAvatar({ avatar: urlavatar })
    .then((response) => {
      console.log("API call resolved successfully:", response);
      // Instead of reassigning, update the src attribute
      profileAvatar.src = urlavatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log("API call failed with error:", err);
      console.error("Error details:", err.response?.data || err.message);
    });
});

// Make Get Card Function
function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikebtnEl = cardElement.querySelector(".card__like-btn");
  const carddeletebtn = cardElement.querySelector(".card__delete");

  // Set the image and title from the data
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  // Set initial like state based on server data
  if (data.isLiked) {
    cardLikebtnEl.classList.add("card__like-btn_active");
  }

  // Like/Unlike functionality
  cardLikebtnEl.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikebtnEl.classList.contains(
      "card__like-btn_active"
    );
    api
      .ChangeLikes({ id: data._id, isLiked: isCurrentlyLiked })
      .then(() => {
        cardLikebtnEl.classList.toggle("card__like-btn_active");
      })
      .catch((error) => {
        console.error("Error updating like status:", error);
      });
  });

  // Delete card functionality
  carddeletebtn.addEventListener("click", function () {
    selectedCardId = data._id;
    selectedCard = cardElement;
    openModal(DeleteModal);
  });

  // Preview functionality
  cardImageEl.addEventListener("click", function () {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewNameEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

// profileAvatar
enableValidation(settings);
