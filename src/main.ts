import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket as BasketModel } from './components/Models/Basket';
import { Order } from './components/Models/Order'; // Добавляем импорт Order
import { WebLarekApi } from './components/Api/WebLarekApi';
import { API_URL } from './utils/constants';
import { Catalog } from './components/Views/Catalog';
import { Modal } from './components/Views/Modal';
import { Basket } from './components/Views/Basket';
import { BasketCounter } from './components/Views/BasketCounter';
import { Card } from './components/Views/Card';
import { ensureElement, cloneTemplate } from './utils/utils';
import { OrderForm } from './components/Views/OrderForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { IOrder } from './types';

// Инициализация моделей
const productsModel = new Products();
const basketModel = new BasketModel();
const orderModel = new Order(); // Инициализируем orderModel

// Инициализация API
const api = new WebLarekApi(API_URL);

// Инициализация представлений
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const catalogView = new Catalog(galleryContainer);

const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modalView = new Modal(modalContainer);

const basketContainer = cloneTemplate<HTMLElement>('#basket');
const basketView = new Basket(basketContainer);

const basketCounter = new BasketCounter(ensureElement<HTMLElement>('.header__basket'));

// Функция для отображения товаров в каталоге
function renderCatalog(products: any[]) {
  catalogView.items = products; // Здесь используется catalogView
  
  // Добавляем обработчики событий для каждой карточки
  const cards = galleryContainer.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const productId = card.getAttribute('data-id');
      if (productId) {
        const product = productsModel.getItem(productId);
        if (product) {
          showProductModal(product);
        }
      }
    });
  });
}

// Функция для отображения модального окна товара
function showProductModal(product: any) {
  const cardPreview = new Card(cloneTemplate<HTMLElement>('#card-preview'));
  cardPreview.title = product.title;
  cardPreview.price = product.price;
  cardPreview.category = product.category;
  cardPreview.image = product.image;
  cardPreview.description = product.description;
  
  // Проверяем, есть ли товар уже в корзине
  const isInBasket = basketModel.getItems().some(item => item.id === product.id);
  
  if (isInBasket) {
    cardPreview.buttonText = 'Удалить из корзины';
    cardPreview.buttonDisabled = false;
  } else {
    cardPreview.buttonText = product.price !== null ? 'В корзину' : 'Недоступно';
    cardPreview.buttonDisabled = product.price === null;
  }
  
  // Добавляем обработчик кнопки "В корзину" / "Удалить из корзины"
  const button = cardPreview.button;
  if (button) {
    button.addEventListener('click', () => {
      if (isInBasket) {
        // Удаляем товар из корзины
        basketModel.removeItem(product.id);
        updateBasket();
        updateBasketView();
        modalView.close();
      } else if (product.price !== null) {
        // Добавляем товар в корзину
        basketModel.addItem(product);
        updateBasket();
        modalView.close();
      }
    });
  }
  
  modalView.content = cardPreview.render();
  modalView.open();
}

// Функции обновления состояния корзины
function updateBasket() {
  basketCounter.count = basketModel.getItems().length;
}

function updateBasketView() {
  basketView.items = basketModel.getItems();
  basketView.total = basketModel.getTotal();
  basketView.buttonDisabled = basketModel.getItems().length === 0;
}

// Загрузка и отображение товаров
api.getProducts()
  .then(products => {
    console.log('Товары с сервера:', products);
    productsModel.setItems(products);
    renderCatalog(productsModel.getItems());
  })
  .catch(error => {
    console.error('Ошибка при загрузке данных с сервера:', error);
  });

// Обработчик клика по иконке корзины
const basketButton = ensureElement<HTMLElement>('.header__basket');
basketButton.addEventListener('click', () => {
  updateBasketView();
  modalView.content = basketView.render();
  modalView.open();
});

// Обработчик удаления товара из корзины
basketView.getContainer().addEventListener('basket:remove', ((event: CustomEvent) => {
  basketModel.removeItem(event.detail.id);
  updateBasket();
  updateBasketView();
}) as EventListener);

// Инициализация корзины
updateBasket();

// Инициализация форм
const orderFormContainer = cloneTemplate<HTMLElement>('#order');
const orderFormView = new OrderForm(orderFormContainer);

const contactsFormContainer = cloneTemplate<HTMLElement>('#contacts');
const contactsFormView = new ContactsForm(contactsFormContainer);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Обработчик кнопки оформления заказа в корзине
basketView.getContainer().addEventListener('click', (event: Event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('basket__button')) {
    showOrderForm();
  }
});

// Обработчик отправки формы заказа
orderFormView.getContainer().addEventListener('submit', (event: Event) => {
  event.preventDefault();
  showContactsForm();
});

// Обработчик отправки формы контактов
contactsFormView.getContainer().addEventListener('submit', (event: Event) => {
  event.preventDefault();
  submitOrder();
});

function showOrderForm() {
  orderFormView.validateForm();
  modalView.content = orderFormView.render();
  modalView.open();
}

function showContactsForm() {
  const orderData = orderFormView.values;
  orderModel.setOrderForm(orderData);
  contactsFormView.validateForm();
  modalView.content = contactsFormView.render();
  modalView.open();
}

function submitOrder() {
  const contactsData = contactsFormView.values;
  orderModel.setOrderForm(contactsData);
  
  const orderData: IOrder = {
    address: orderModel.address,
    email: orderModel.email,
    phone: orderModel.phone,
    payment: orderModel.payment as 'card' | 'cash', // Явное приведение типа
    items: basketModel.getItems().map(item => item.id),
    total: basketModel.getTotal()
  };

  api.createOrder(orderData)
    .then((result) => {
      showSuccess(result.total);
      basketModel.clearBasket();
      orderModel.clearOrder();
      updateBasket();
    })
    .catch((error) => {
      console.error('Ошибка при оформлении заказа:', error);
      // Для отображения ошибки нужно добавить публичный метод в ContactsForm
    });
}

function showSuccess(total: number) {
  const successElement = successTemplate.content.cloneNode(true) as DocumentFragment;
  const successContainer = successElement.querySelector('.order-success') as HTMLElement;
  const description = successContainer.querySelector('.order-success__description');
  const closeButton = successContainer.querySelector('.order-success__close');
  
  if (description) {
    description.textContent = `Списано ${total} синапсов`;
  }
  
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modalView.close();
    });
  }
  
  modalView.content = successContainer;
  modalView.open();
}

// Обработчик закрытия модального окна
modalView.getContainer().addEventListener('click', (event: Event) => {
  const target = event.target as HTMLElement;
  if (target === modalView.getContainer() || target.classList.contains('modal__close')) {
    modalView.close();
  }
});

// Предотвращаем скроллинг при открытом модальном окне
modalView.getContainer().addEventListener('wheel', (event: Event) => {
  event.preventDefault();
}, { passive: false });