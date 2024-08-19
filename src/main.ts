import { 
    clearUserProfilePicChoice, 
    registerChecker, 
    modifyClassOnElements, 
    getCookie, 
    setCookie, 
    deleteCookie 
  } from "./modules/utilities.ts";
  import { 
    getUsers, 
    register, 
    deleteUser, 
    postComment 
  } from "./modules/db.ts";
  import { 
    applyProfilePic, 
    displayProfilePages, 
    displayUsersInAside, 
    displayUserComments, 
    displayAllComments 
  } from "./modules/display.ts";
  import { errorMessageLoginRegisterPage } from './modules/error.ts';
  
  // @ts-ignore
  import morteza1 from './images/morteza1.png';
  // @ts-ignore
  import morteza2 from './images/morteza2.png';
  // @ts-ignore
  import morteza3 from './images/morteza3.png';
  // @ts-ignore
  import avatar from './images/avatar.svg';
  
  // @ts-ignore
  (window as any).buildedImagesPath = {
      './images/morteza1.png': morteza1,
      './images/morteza2.png': morteza2,
      './images/morteza3.png': morteza3,
      './images/avatar.svg': avatar
  };
  
  
  const elements = {
    logInRegisterPage: document.getElementById("log-in-register-page") as HTMLDivElement,
    logInDiv: document.getElementById("log-in-div") as HTMLDivElement,
    logInForm: document.getElementById("log-in-form") as HTMLFormElement,
    logInUserInput: document.getElementById("log-in-username") as HTMLInputElement,
    logInPasswordInput: document.getElementById("log-in-password") as HTMLInputElement,
    registerDiv: document.getElementById("register-div") as HTMLDivElement,
    registerForm: document.getElementById("register-form") as HTMLFormElement,
    registerUsernameInput: document.getElementById("register-username") as HTMLInputElement,
    registerPasswordInput: document.getElementById("register-password") as HTMLInputElement,
    confirmPasswordInput: document.getElementById("confirm-password") as HTMLInputElement,
    profileImageDiv: document.getElementById("profile-images-div") as HTMLDivElement,
    profileImgElements: [
      document.getElementById("profile-images-one") as HTMLImageElement,
      document.getElementById("profile-images-two") as HTMLImageElement,
      document.getElementById("profile-images-three") as HTMLImageElement
    ],
    navBar: document.getElementById("nav-bar") as HTMLDivElement,
    homePageDiv: document.getElementById("home-page") as HTMLDivElement,
    headerNavbar: document.getElementById("header-bar") as HTMLDivElement,
    mobileGamesDiv: document.getElementById("mobile-games-forum") as HTMLDivElement,
    moviesTVShowsDiv: document.getElementById("movies-tv-shows-forum") as HTMLDivElement,
    eSportsDiv: document.getElementById("e-sport-forum") as HTMLDivElement,
    profileDiv: document.getElementById("profile-page") as HTMLDivElement,
    deleteAccountButton: document.getElementById("delete-button") as HTMLButtonElement,
    logOutButton: document.getElementById("log-out-button") as HTMLButtonElement,
    usernamePElement: document.getElementById("logged-in-username") as HTMLParagraphElement,
    asideDiv: document.querySelector("aside") as HTMLDivElement,
    esportsCommentForm: document.querySelector("#esports-form") as HTMLFormElement,
    categoryEsports: document.querySelector("#esports-title") as HTMLLIElement,
    esportCommentInput: document.querySelector("#e-sports-comment") as HTMLInputElement,
    moviesCommentForm: document.querySelector("#movies-tv-shows-form") as HTMLFormElement,
    categoryMovies: document.querySelector("#movies-title") as HTMLLIElement,
    moviesCommentInput: document.querySelector("#movies-tv-shows-comment") as HTMLInputElement,
    mobileGameCommentForm: document.querySelector("#mobile-games-form") as HTMLFormElement,
    categoryMobileGame: document.querySelector("#mobile-games-title") as HTMLLIElement,
    mobileGamesCommentInput: document.querySelector("#mobile-games-comment") as HTMLInputElement
  };
  
 
  let chosenImage: string = "";
  let loggedInUser: string = "";
  let selectedUser: string = "";
  let userId: string = "";
  
  
  const authToken = getCookie("authToken");
  if (authToken) {
      loggedInUser = authToken;
      initializeLoggedInState();
  }
  
  
  async function initializeLoggedInState(): Promise<void> {
      modifyClassOnElements("add", "hidden", elements.logInDiv);
      modifyClassOnElements("remove", "hidden", elements.navBar, elements.homePageDiv, elements.asideDiv);
      displayUsersInAside();
      try {
          const userObj = await getUsers();
          await updateUserProfile(userObj, loggedInUser);
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
  }
  
 
  async function loginChecker(user: string, pass: string): Promise<boolean> {
      try {
          const users = await getUsers();
          const currentUser = Object.values(users).find((u: any) => u.username === user && u.password === pass);
          if (currentUser) {
              setCookie("authToken", user, 1);
              return true;
          }
          errorMessageLoginRegisterPage("Wrong username or password!");
          return false;
      } catch (error) {
          console.error("Error checking login:", error);
          return false;
      }
  }
  
 
  function handleLogOut(): void {
      deleteCookie("authToken");
      loggedInUser = "";
      userId = "";
      modifyClassOnElements("remove", "hidden", elements.logInDiv);
      modifyClassOnElements("add", "hidden", elements.navBar, elements.homePageDiv, elements.asideDiv);
      elements.asideDiv.innerHTML = "";
  }
  
  
  function toggleLoginRegisterPages(): void {
      elements.logInForm.reset();
      elements.registerForm.reset();
      elements.logInDiv.classList.toggle("hidden");
      elements.registerDiv.classList.toggle("hidden");
  
      const errorMessagePEl = document.getElementById("error-message") as HTMLParagraphElement;
      if (errorMessagePEl) errorMessagePEl.remove();
  
      clearUserProfilePicChoice();
  }
  
  
  function handleProfileImageClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.id !== "profile-images-div") {
          elements.profileImgElements.forEach((imgElement, index) => {
              const isSelected = target.id === `profile-images-${index + 1}`;
              imgElement.classList.toggle("user-choice", isSelected);
              if (isSelected) {
                  chosenImage = `./images/morteza${index + 1}.png`;
              }
          });
      }
  }
  
  
  async function handleHeaderNavbarClick(event: MouseEvent): Promise<void> {
      const target = event.target as HTMLElement;
      switch (target.innerText) {
          case "Mobile Games":
              modifyClassOnElements("remove", "hidden", elements.mobileGamesDiv);
              modifyClassOnElements("add", "hidden", elements.moviesTVShowsDiv, elements.eSportsDiv, elements.homePageDiv, elements.profileDiv);
              await displayAllComments(loggedInUser);
              break;
          case "Movies/TV-Shows":
              modifyClassOnElements("remove", "hidden", elements.moviesTVShowsDiv);
              modifyClassOnElements("add", "hidden", elements.mobileGamesDiv, elements.eSportsDiv, elements.homePageDiv, elements.profileDiv);
              await displayAllComments(loggedInUser);
              break;
          case "E-Sports":
              modifyClassOnElements("remove", "hidden", elements.eSportsDiv);
              modifyClassOnElements("add", "hidden", elements.mobileGamesDiv, elements.moviesTVShowsDiv, elements.homePageDiv, elements.profileDiv);
              await displayAllComments(loggedInUser);
              break;
          default:
              if (target.id === "logo" && !elements.navBar.classList.contains("hidden")) {
                  modifyClassOnElements("remove", "hidden", elements.homePageDiv);
                  modifyClassOnElements("add", "hidden", elements.mobileGamesDiv, elements.moviesTVShowsDiv, elements.eSportsDiv, elements.profileDiv);
              } else if (target.id === "logged-in-profile-pic") {
                  selectedUser = loggedInUser;
                  await displayUserComments(selectedUser, loggedInUser);
                  modifyClassOnElements("remove", "hidden", elements.profileDiv);
                  modifyClassOnElements("add", "hidden", elements.homePageDiv, elements.eSportsDiv, elements.mobileGamesDiv, elements.moviesTVShowsDiv);
                  await displayProfilePages(loggedInUser, loggedInUser);
              }
              break;
      }
  }
  
 
  async function handleUserClick(event: MouseEvent): Promise<void> {
      const target = event.target as HTMLElement;
      if (target.classList.contains("users")) {
          selectedUser = target.innerText;
          await displayUserComments(selectedUser, loggedInUser);
          modifyClassOnElements("remove", "hidden", elements.profileDiv);
          modifyClassOnElements("add", "hidden", elements.homePageDiv, elements.eSportsDiv, elements.mobileGamesDiv, elements.moviesTVShowsDiv);
          await displayProfilePages(selectedUser, loggedInUser);
      }
  }
  
  
  async function handleDeleteAccount(): Promise<void> {
      try {
          const users = await getUsers();
          const userKey = Object.keys(users).find(key => users[key].username === loggedInUser);
          if (userKey) {
              await deleteUser(userKey);
          }
          modifyClassOnElements("remove", "hidden", elements.logInDiv);
          modifyClassOnElements("add", "hidden", elements.deleteAccountButton, elements.navBar, elements.homePageDiv, elements.eSportsDiv, elements.mobileGamesDiv, elements.moviesTVShowsDiv, elements.profileDiv, elements.asideDiv);
          elements.asideDiv.innerHTML = "";
      } catch (error) {
          console.error("Error deleting account:", error);
      }
  }
  
 
  async function commentHandler(event: SubmitEvent, categoryText: HTMLElement, commentInput: HTMLInputElement): Promise<void> {
      event.preventDefault();
      const category = categoryText.innerText;
      const context = commentInput.value;
      const username = loggedInUser;
  
      try {
          const users = await getUsers();
          const userKey = Object.keys(users).find(key => users[key].username === loggedInUser);
          if (userKey) {
              await postComment(userKey, category, context, username);
              await displayAllComments(loggedInUser);
              commentInput.value = "";
          }
      } catch (error) {
          console.error("Error posting comment:", error);
      }
  }
  
 
  async function updateUserProfile(userObj: any, username: string): Promise<void> {
      try {
          const profilePicElement = document.getElementById("logged-in-profile-pic") as HTMLImageElement;
          const currentUser = Object.values(userObj).find((user: any) => user.username === username);
          if (currentUser) {
              
              profilePicElement.src = (window as any).buildedImagesPath[currentUser.profilepic];
          }
      } catch (error) {
          console.error("Error updating user profile:", error);
      }
  }
  
  
  elements.logOutButton.addEventListener("click", handleLogOut);
  elements.logInRegisterPage.addEventListener("click", toggleLoginRegisterPages);
  elements.profileImageDiv.addEventListener("click", handleProfileImageClick);
  elements.headerNavbar.addEventListener("click", handleHeaderNavbarClick);
  elements.deleteAccountButton.addEventListener("click", handleDeleteAccount);
  elements.asideDiv.addEventListener("click", handleUserClick);
  
  elements.esportsCommentForm.addEventListener("submit", event => commentHandler(event, elements.categoryEsports, elements.esportCommentInput));
  elements.moviesCommentForm.addEventListener("submit", event => commentHandler(event, elements.categoryMovies, elements.moviesCommentInput));
  elements.mobileGameCommentForm.addEventListener("submit", event => commentHandler(event, elements.categoryMobileGame, elements.mobileGamesCommentInput));
  
  elements.logInForm.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();
      const username = elements.logInUserInput.value.trim();
      const password = elements.logInPasswordInput.value.trim();
  
      if (await loginChecker(username, password)) {
          loggedInUser = username;
          elements.usernamePElement.innerText = loggedInUser;
          try {
              const userObj = await getUsers();
              await updateUserProfile(userObj, loggedInUser);
              modifyClassOnElements("add", "hidden", elements.logInDiv);
              modifyClassOnElements("remove", "hidden", elements.navBar, elements.homePageDiv, elements.asideDiv);
              displayUsersInAside();
          } catch (error) {
              console.error("Error during login:", error);
          }
          elements.logInForm.reset();
      }
  });
  
  elements.registerForm.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();
      const username = elements.registerUsernameInput.value.trim();
      const password = elements.registerPasswordInput.value.trim();
      const confirmPassword = elements.confirmPasswordInput.value.trim();
  
      if (await registerChecker(username, password, confirmPassword)) {
          try {
              await register(username, password, chosenImage);
              loggedInUser = username;
              elements.usernamePElement.innerText = loggedInUser;
              const userObj = await getUsers();
              await updateUserProfile(userObj, loggedInUser);
              modifyClassOnElements("remove", "hidden", elements.navBar, elements.homePageDiv, elements.asideDiv);
              modifyClassOnElements("add", "hidden", elements.registerDiv);
              displayUsersInAside();
          } catch (error) {
              console.error("Error during registration:", error);
          }
          elements.registerForm.reset();
      }
  });
  