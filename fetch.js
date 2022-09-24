const input = document.querySelector(".search-input");
const itemsList = document.querySelector(".repo-list");
const search = document.querySelector(".search");

const zeroRepo = document.createElement("p");
zeroRepo.classList.add("zero-repositories");
zeroRepo.textContent = `start input please`;
zeroRepo.style.display = "block";
search.append(zeroRepo);

//debounce fn
const debounce = (fn, debounceTime) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
};

//remove choosen item
function removeItem(listElement) {
  if (listElement) listElement.remove();
}

//add new item in choosen list
function appendItem(item) {
  const itemList = document.createElement("li");
  itemList.classList.add("added-item");

  const wrapperDiv = document.createElement("div");
  wrapperDiv.classList.add("wrapper-item");

  const nickName = document.createElement("p");
  nickName.textContent = `Name: ${item.name}`;

  const owner = document.createElement("p");
  owner.textContent = `Owner: ${item.owner.login}`;

  const stars = document.createElement("p");
  stars.textContent = `Stars: ${item.stargazers_count}`;
  const redCross = document.createElement("p");
  redCross.textContent = "×";
  redCross.classList.add("del");

  wrapperDiv.append(nickName, owner, stars);
  itemList.append(wrapperDiv, redCross);
  itemsList.prepend(itemList);
}

//get response from server
const repositories = async function () {
  const data = input.value;
  zeroRepo.style.display = "none";
  if (!data) {
    removeItem(search.querySelector(".first-five-repo"));
  } else {
    let fivePcs = [];
    const firstFiveItemsList = document.createElement("ul");
    firstFiveItemsList.classList.add("first-five-repo");
    let response = await fetch(
      `https://api.github.com/search/repositories?q=${data}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
        },
      }
    );
    let res = await response.json();
    //sort response items
    if (res.total_count === 0) {
      console.log("null");
      removeItem(search.querySelector(".first-five-repo"));
      zeroRepo.textContent = `repositories was not found`;
      zeroRepo.style.display = "block";
    } else if (!res.total_count) {
      zeroRepo.textContent = `start input please`;
      zeroRepo.style.display = "block";
    } else {
      if (data.length !== 0) {
        fivePcs = res.items.filter((el) =>
          el.name.toLocaleLowerCase().startsWith(data.toLocaleLowerCase())
        );
        fivePcs = fivePcs.slice(0, 5);
        if (search.querySelector(".first-five-repo") !== null) {
          removeItem(search.querySelector(".first-five-repo"));
        }
        search.appendChild(firstFiveItemsList);

        //show autocomplete
        fivePcs.forEach((el) => {
          const item = document.createElement("li");
          item.textContent = `${el.name}`;
          item.classList.add("suggestion");
          firstFiveItemsList.appendChild(item);
        });
      }
      //ev listener add item in choosen list
      firstFiveItemsList.addEventListener("click", (e) => {
        let el = fivePcs.filter((elem) => elem.name === e.target.innerText);
        appendItem(...el);
        removeItem(e.target.closest("ul"));
        input.value = "";
      });
    }
  }
};

//ev listener delete button
itemsList.addEventListener("click", (e) => {
  const target = e.target;
  if (target.className === "del") {
    removeItem(target.closest("li"));
  }
});

//ev listener input search
input.addEventListener("input", debounce(repositories, 300));
