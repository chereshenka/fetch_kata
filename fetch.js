let input = document.querySelector(".search-input");
let itemsList = document.querySelector(".repo-list");
let firstFiveItemsList = document.querySelector(".first-five-repo");
let totalRepo = document.querySelector(".result-count");

const debounce = (fn, debounceTime) => {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, arguments), debounceTime);
  };
};
function removeItem(listElement) {
  listElement.remove();
}

function appendItem(item) {
  let itemList = document.createElement("li");
  itemList.innerHTML = `<p>Name: ${item.name}</p><p>NickName: ${item.owner.login}</p><p>Stars: ${item.stargazers_count}</p><button class='del'>remove</button>
  `;
  itemsList.prepend(itemList);
}

let repositories = async function getRepos() {
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${input.value}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );
  let res = await response.json();
  totalRepo.textContent = `total repositories:${res.total_count}`;
  let fivePcs = res.items.slice(0, 5);
  firstFiveItemsList.innerHTML = "";
  fivePcs.forEach((el) => {
    let item = document.createElement("li");
    item.textContent = `${el.name}`;
    firstFiveItemsList.appendChild(item);
  });
  firstFiveItemsList.addEventListener("click", (e) => {
    let el = fivePcs.filter((elem) => elem.name === e.target.innerText);
    appendItem(...el);
    firstFiveItemsList.innerHTML = "";
    input.value = "";
    totalRepo.textContent = `total repositories: 0`;
  });
};

itemsList.addEventListener("click", (e) => {
  let target = e.target;
  if (target.className === "del") {
    removeItem(target.closest("li"));
  }
});

input.addEventListener("keyup", debounce(repositories, 500));
