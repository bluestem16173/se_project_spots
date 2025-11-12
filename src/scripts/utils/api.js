class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl.replace(/\/$/, "");
    this._headers = headers;
  }

  _handle(res) {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ----- USERS -----
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._handle);
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    }).then(this._handle);
  }

  setAvatar(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    }).then(this._handle);
  }

  // ----- CARDS -----
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers,
    }).then(this._handle);
  }

  createCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    }).then(this._handle);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    });
  }

  changeLikeStatus(cardId, shouldLike) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: shouldLike ? "PUT" : "DELETE",
      headers: this._headers,
    }).then(this._handle);
  }

  // IMPORTANT: must return [user, cards]
  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }
}

export default Api;
