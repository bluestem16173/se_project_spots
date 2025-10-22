const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

(async () => {
  try {
    const indexJs = fs.readFileSync(path.join(__dirname, 'index.js'), 'utf8');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Smoke Test</title>
</head>
<body>
  <!-- profile -->
  <button class="profile__edit-btn">Edit</button>
  <div id="edit-profile-modal" class="modal">
    <button class="modal__close-btn">Close</button>
    <form class="modal__form">
      <input id="profile-name-input" />
      <input id="profile-description-input" />
      <button type="submit">Save</button>
    </form>
  </div>
  <h1 class="profile__name">Test Name</h1>
  <div class="profile__description">Desc</div>

  <!-- preview modal -->
  <div id="preview-modal" class="modal">
    <img class="modal__image" />
    <div class="modal__caption"></div>
    <button class="modal__close">close</button>
  </div>

  <!-- new post modal -->
  <button class="profile__add-btn">Add</button>
  <div id="new-post-modal" class="modal">
    <button class="modal__close-btn">Close</button>
    <form class="modal__form">
      <input id="profile-caption-input" name="caption" />
      <input id="card-image-input" name="link" />
      <button type="submit">Add</button>
    </form>
  </div>

  <!-- card template -->
  <template id="card-template">
    <div class="card">
      <img class="card__image" />
      <div class="card__content">
        <h2 class="card__title"></h2>
        <button class="card__like-btn" type="button"></button>
      </div>
    </div>
  </template>

  <div class="cards__list"></div>

  <script>
  ${indexJs}
  </script>
</body>
</html>`;

    const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });

    // wait a tick for DOMContentLoaded handlers to run
    await new Promise((res) => setTimeout(res, 50));

    const { document } = dom.window;

    const cardsList = document.querySelector('.cards__list');
    if (!cardsList) throw new Error('cards__list not found');

    const initialCount = cardsList.children.length;

    console.log('Initial cards rendered:', initialCount);

    // find new post modal controls
    const addBtn = document.querySelector('.profile__add-btn');
    const newPostModal = document.getElementById('new-post-modal');
    const captionInput = document.getElementById('profile-caption-input');
    const linkInput = document.getElementById('card-image-input');
    const form = newPostModal.querySelector('.modal__form');

    if (!form) throw new Error('add card form not found');

    // open modal
    addBtn.click();

    // fill and submit
    captionInput.value = 'SmokeTest Place';
    linkInput.value = 'https://example.com/image.jpg';

    const submitEvent = new dom.window.Event('submit', { bubbles: true, cancelable: true });

    form.dispatchEvent(submitEvent);

    // wait for handlers
    await new Promise((res) => setTimeout(res, 50));

    const newCount = cardsList.children.length;

    const newFirst = cardsList.firstElementChild;
    const title = newFirst ? newFirst.querySelector('.card__title').textContent : null;

    console.log('After add, cards:', newCount, 'first title:', title);

    const added = newCount === initialCount + 1 && title === 'SmokeTest Place';

    if (added) {
      console.log('SMOKE TEST: PASS');
      process.exit(0);
    } else {
      console.error('SMOKE TEST: FAIL');
      process.exit(2);
    }
  } catch (err) {
    console.error('SMOKE TEST: ERROR', err && err.stack ? err.stack : err);
    process.exit(3);
  }
})();
