async function getData(url = 'data.json') {
    const response = await fetch(url);
    const data = await response.json();

    return data
}

class DashboardItem {
  static PERIODS = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month',
  }

  constructor(data, container = '.dashboard__content', view = 'weekly') {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this._createMarkup();
  }

  _createMarkup() {
    const {title, timeframes} = this.data;
    const id = title.toLowerCase().replace(/ /g, '-');
    const {current, previous} = timeframes[this.view];

    this.container.insertAdjacentHTML('beforeend', `
      <div class="dashboard__item dashboard__item--${id}">
        <article class="tracking-card">
          <header class="tracking-card__header">
            <h4 class="tracking-card__title">${title}</h4>
            <img class="tracking-card__menu" src="./images/icon-ellipsis.svg" alt="menu">
          </header>
          <div class="tracking-card__body">
            <div class="tracking-card__time">${current}hrs</div>
            <div class="tracking-card__prev-period">
              Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs
            </div>
          </div>
        </article>
      </div>
    `);

    this.time = this.container.querySelector(`.dashboard__item--${id} .tracking-card__time`);
    this.prev = this.container.querySelector(`.dashboard__item--${id} .tracking-card__prev-period`);
  }

  changeView(view) {
    this.view = view;
    const {current, previous} = this.data.timeframes[this.view];

    this.time.innerText = `${current}hrs`;
    this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`
  }
}

class ErrorMessage {
  constructor(err, container = '.dashboard__content') {
    this.err = err;
    this.container = document.querySelector(container);

    this.createMessage();
  }
  createMessage() {
    const message = this.err.toString().replace(/</g, '');

    this.container.insertAdjacentHTML('beforeend', `
      <div class="container--error">
        <h2 class="error">Упс, нам не удалось загрузить данные! ${message}</h2>
      </div>
    `)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getData()
    .then(data => {
      const items = data.map(item => new DashboardItem(item));

      const selectors = document.querySelectorAll('.view-selector__item');
      selectors.forEach(selector => {
        selector.addEventListener('click', function() {
          selectors.forEach(selector => {
            selector.classList.remove('view-selector__item--active');
          });
          selector.classList.add('view-selector__item--active');

          const currentView = selector.innerText.trim().toLowerCase();
          items.forEach(active => active.changeView(currentView));
        })
      })
    })
    .catch(err => {
      const sendMessage = new ErrorMessage(err);
  })
})