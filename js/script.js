// 모든 작품 데이터
let allArtworks = [];

// 현재 선택된 카테고리
let selectedCategory = "전체";

// 현재 검색어
let searchKeyword = "";

// 현재 정렬 방식
let selectedSort = "recommended";


// HTML 요소 선택
const artworkList = document.querySelector("#artworkList");
const categoryList = document.querySelector("#categoryList");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const emptyMessage = document.querySelector("#emptyMessage");
const resetBtn = document.querySelector("#resetBtn");


// JSON 데이터 가져오기
async function loadArtworks() {

    try {

        const response = await fetch("./data/artworks.json");

        // 데이터를 정상적으로 가져오지 못한 경우
        if (!response.ok) {
            throw new Error("작품 데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();

        allArtworks = data;

        renderArtworks();

    } catch (error) {

        console.error(error);

        resultCount.textContent = "데이터를 불러오지 못했습니다.";

        artworkList.innerHTML = `
            <div class="error-message">
                작품 정보를 불러오지 못했습니다.<br>
                Live Server로 실행했는지 확인해주세요.
            </div>
        `;

    }

}


// 카드 목록 출력
function displayArtworks(artworks) {

    artworkList.innerHTML = "";

    // 검색 결과가 없을 때
    if (artworks.length === 0) {

        emptyMessage.classList.add("show");
        return;

    }

    emptyMessage.classList.remove("show");

    artworks.forEach(function (artwork) {

        const card = document.createElement("article");

        card.classList.add("artwork-card");

        card.innerHTML = `
            <div class="artwork-image-box">

                <img
                    src="${artwork.image}"
                    alt="${artwork.title}"
                    class="artwork-image"
                >

                <span class="category-badge">
                    ${artwork.category}
                </span>

                <button
                    type="button"
                    class="like-btn"
                    data-id="${artwork.id}"
                    aria-label="${artwork.title} 찜하기"
                >
                    ♡
                </button>

            </div>

            <div class="artwork-info">

                <div class="artwork-top">

                    <p class="artist">
                        ${artwork.artist}
                    </p>

                    <span class="rating">
                        ★ ${artwork.rating}
                    </span>

                </div>

                <h3 class="artwork-title">
                    ${artwork.title}
                </h3>

                <p class="artwork-description">
                    ${artwork.description}
                </p>

                <div class="artwork-meta">
                    <span>${artwork.size}</span>
                    <span>${artwork.material}</span>
                    <span>${artwork.year}</span>
                </div>

                <div class="price-area">

                    <p class="price">
                        월
                        <strong>
                            ${artwork.price.toLocaleString()}
                        </strong>
                        원
                    </p>

                    <span class="view-count">
                        렌탈 ${artwork.rentalCount}회
                    </span>

                </div>

            </div>
        `;

        artworkList.append(card);

    });

}


// 필터링과 정렬을 한 번에 처리
function renderArtworks() {

    // 원본 배열을 복사
    let result = [...allArtworks];


    // 1. 카테고리 필터링
    if (selectedCategory !== "전체") {

        result = result.filter(function (artwork) {

            return artwork.category === selectedCategory;

        });

    }


    // 2. 검색 필터링
    if (searchKeyword !== "") {

        result = result.filter(function (artwork) {

            const title = artwork.title.toLowerCase();
            const artist = artwork.artist.toLowerCase();
            const keyword = searchKeyword.toLowerCase();

            return (
                title.includes(keyword) ||
                artist.includes(keyword)
            );

        });

    }


    // 3. 정렬
    if (selectedSort === "priceLow") {

        result.sort(function (a, b) {
            return a.price - b.price;
        });

    } else if (selectedSort === "priceHigh") {

        result.sort(function (a, b) {
            return b.price - a.price;
        });

    } else if (selectedSort === "rating") {

        result.sort(function (a, b) {
            return b.rating - a.rating;
        });

    } else if (selectedSort === "popular") {

        result.sort(function (a, b) {
            return b.rentalCount - a.rentalCount;
        });

    } else {

        // 추천순
        result.sort(function (a, b) {
            return b.recommendedScore - a.recommendedScore;
        });

    }


    // 결과 개수 출력
    resultCount.innerHTML = `
        총 <strong>${result.length}</strong>개의 작품이 있습니다.
    `;


    // 화면 출력
    displayArtworks(result);

}


// 카테고리 버튼 클릭
categoryList.addEventListener("click", function (event) {

    const clickedButton = event.target.closest(".category-btn");

    // 카테고리 버튼이 아닌 곳을 클릭한 경우
    if (!clickedButton) {
        return;
    }


    // 모든 카테고리 버튼의 active 제거
    const categoryButtons =
        document.querySelectorAll(".category-btn");

    categoryButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    // 클릭한 버튼에 active 추가
    clickedButton.classList.add("active");


    // 선택한 카테고리 저장
    selectedCategory = clickedButton.dataset.category;


    // 작품 다시 출력
    renderArtworks();

});


// 검색 폼 제출
searchForm.addEventListener("submit", function (event) {

    // 폼의 기본 새로고침 막기
    event.preventDefault();

    // 입력한 검색어 저장
    searchKeyword = searchInput.value.trim();

    renderArtworks();

});


// 입력과 동시에 실시간 검색
searchInput.addEventListener("input", function () {

    searchKeyword = searchInput.value.trim();

    renderArtworks();

});


// 정렬 변경
sortSelect.addEventListener("change", function () {

    selectedSort = sortSelect.value;

    renderArtworks();

});


// 찜 버튼 클릭
artworkList.addEventListener("click", function (event) {

    const likeButton = event.target.closest(".like-btn");

    if (!likeButton) {
        return;
    }

    likeButton.classList.toggle("active");


    if (likeButton.classList.contains("active")) {

        likeButton.textContent = "♥";

    } else {

        likeButton.textContent = "♡";

    }

});


// 초기화 버튼
resetBtn.addEventListener("click", function () {

    selectedCategory = "전체";
    searchKeyword = "";
    selectedSort = "recommended";

    searchInput.value = "";
    sortSelect.value = "recommended";


    // 카테고리 버튼 초기화
    const categoryButtons =
        document.querySelectorAll(".category-btn");

    categoryButtons.forEach(function (button) {

        button.classList.remove("active");

        if (button.dataset.category === "전체") {

            button.classList.add("active");

        }

    });

    renderArtworks();

});


// 페이지 실행 시 JSON 데이터 불러오기
loadArtworks();