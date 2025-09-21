import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Basket as BasketModel } from './components/Models/Basket';
import { Order } from './components/Models/Order';
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
import { SuccessMessage } from './components/Views/SuccessMessage';
import { IOrder, IProduct } from './types';

// Инициализация моделей
const productsModel = new Products();
const basketModel = new BasketModel();
const orderModel = new Order();

// Инициализация API
const api = new WebLarekApi(API_URL);

// Инициализация представлений
const page = ensureElement<HTMLElement>('.page__wrapper');
const catalogView = new Catalog(ensureElement<HTMLElement>('.gallery'));
const modalView = new Modal(ensureElement<HTMLElement>('#modal-container'));
const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'));
const basketCounter = new BasketCounter(ensureElement<HTMLElement>('.header__basket'));
const orderFormView = new OrderForm(cloneTemplate<HTMLElement>('#order'));
const contactsFormView = new ContactsForm(cloneTemplate<HTMLElement>('#contacts'));

// Функция для отображения товаров в каталоге
function renderCatalog(products: IProduct[]) {
    catalogView.items = products;
    
    // Устанавливаем обработчик клика по карточке
    catalogView.onCardClick = (productId: string) => {
        const product = productsModel.getItem(productId);
        if (product) {
            showProductModal(product);
        }
    };
}

// Функция для отображения модального окна товара
function showProductModal(product: IProduct) {
    const cardPreview = new Card(cloneTemplate<HTMLElement>('#card-preview'));
    
    // Устанавливаем свойства карточки
    cardPreview.title = product.title;
    cardPreview.price = product.price;
    cardPreview.category = product.category;
    cardPreview.image = product.image;
    cardPreview.description = product.description || '';
    
    // Проверяем, есть ли товар уже в корзине
    const isInBasket = basketModel.getItems().some(item => item.id === product.id);
    
    if (isInBasket) {
        cardPreview.buttonText = 'Удалить из корзины';
        cardPreview.buttonDisabled = false;
    } else {
        cardPreview.buttonText = product.price !== null ? 'В корзину' : 'Недоступно';
        cardPreview.buttonDisabled = product.price === null;
    }
    
    // Устанавливаем обработчики событий
    cardPreview.onClick = () => {
        // Обработка клика на карточку
    };
    
    cardPreview.onButtonClick = () => {
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
    };
    
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

// Обработчики событий корзины
basketView.onRemoveItem = (id: string) => {
    basketModel.removeItem(id);
    updateBasket();
    updateBasketView();
};

basketView.onCheckout = () => {
    showOrderForm();
};

// Обработчики событий форм
orderFormView.onSubmit = () => {
    showContactsForm();
};

contactsFormView.onSubmit = () => {
    submitOrder();
};

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
        payment: orderModel.payment as 'card' | 'cash',
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
        });
}

function showSuccess(total: number) {
    const successContainer = cloneTemplate<HTMLElement>('#success');
    const successMessage = new SuccessMessage(successContainer);
    successMessage.total = total;
    successMessage.onClose = () => {
        modalView.close();
    };
    
    modalView.content = successContainer;
    modalView.open();
}

// Инициализация корзины
updateBasket();