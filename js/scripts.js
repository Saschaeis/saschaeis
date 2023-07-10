let menu = document.querySelector('.menu');
let menuItems = menu.querySelectorAll('.menu__link');
let upBtn = document.querySelector('.upBtn');
let headers = document.querySelectorAll('h2');
let content = document.querySelector('.content');
let contentMarginTop = window.getComputedStyle(content, null).getPropertyValue("margin-top");
let faq = document.querySelector('.faq');
let form = document.getElementById("form");
const burger = document.querySelector('.burger');
window.addEventListener('load', function () {
    atTopPosition();
    burger.addEventListener('click', function () {
        this.classList.toggle('active');
        menu.classList.toggle('opened');
    })

    delegate(faq, '.ask', 'click', function () {
        let answer = this.closest('.item').querySelector('.answer');
        let cl = answer.classList;
        //let answerHeight = answer.getBoundingClientRect().height + 'px'; // можно так взять высоту

        if (cl.contains('open')) {
            let animation = answer.animate([
                {height: getElemPixelHeight(answer)},
                {height: 0}
            ], {duration: 100});

            animation.addEventListener('finish', function () {
                cl.remove('open');

            });
            this.classList.toggle('opened');
        } else {
            cl.add('open');
            this.classList.toggle('opened');
            answer.animate([
                {height: 0},
                {height: getElemPixelHeight(answer)}
            ], {duration: 100});
        }
    });
    delegate(menu, '.menu__link', 'click', function (e) {
        e.preventDefault();
        let target = document.querySelector(this.hash); // hash как id селектор
        scrollToElem(target);
        //setActiveMenuItem(menu, this);
    });
    const buttonsContainer = document.querySelector('.welcome__text-info-buttons');
    delegate(buttonsContainer, '.button', 'click', function (e) {
        e.preventDefault();
        let target = document.querySelector(this.hash);
        scrollToElem(target);
    });

    let startHash = window.location.hash;
    let autoTarget = startHash.length > 0 ? document.querySelector(startHash) : null;

    if (autoTarget !== null) {
        scrollToElem(autoTarget);
        setActiveMenuItem(menu, menu.querySelector(`[href$="${hash}"]`));
    }
    upBtn.addEventListener('click', function () {
        scrollToY(0)
    });
    document.addEventListener('scroll', function () {
        if (window.scrollY > 400) { // используем window.scrollY но и window.pageYOffset дают одни и те же значения.  можно использовать window.innerHeight / 2 ( > 400), чтоб не привязываться к абсолютной величине 400
            upBtn.classList.remove("disabled");
        } else {
            upBtn.classList.add("disabled");
        }
        atTopPosition();
        for (let i = menuItems.length - 1; i >= 0; i--) {
            let link = menuItems[i];
            /*
            parseInt(document.querySelector(link.hash).getBoundingClientRect().top)  -- если не округлять parseInt то кординаты могут не совпасть на сотые доли и headinPosition <=  window.scrollY  может не сработать
            */
            let headinPosition = (+document.querySelector(link.hash).getBoundingClientRect().top + window.scrollY) - 500;//parseInt(contentMarginTop) //menu.offsetHeight;
            if (headinPosition <= window.scrollY + 1) { // иногда кординаты различаются на сотые доли... эта 1 компенсирует, чтобы не было так, что нажал на один пункт, а подсвечивается ещё предыдущй
                setActiveMenuItem(menu, link);
                break;
            }
        }

    })
    let contactProcessing = JSON.parse(localStorage.getItem("contactIsSent"));
    let timeProcessing = JSON.parse(localStorage.getItem("time"));
    if (contactProcessing && timeProcessing + (3600 * 1000) > new Date().getTime()) {
        form.innerHTML = `
            <p class="formSent">Заявка отправлена и обрабатывается. В ближайшее время с Вами свяжутся.</p>
            `;
    } else {
        localStorage.setItem("contactIsSent", JSON.stringify(false));
        localStorage.setItem("time", JSON.stringify(0));
        document.querySelector('#sendBtn').addEventListener('click', sendContact);
    }
});

function setActiveMenuItem(menu, item) {
    menu.querySelectorAll('.menu__link').forEach(link => link.classList.remove('menu__link-active'));
    item.classList.add('menu__link-active');
}

function scrollToElem(el) {
    let elementYposition = el.getBoundingClientRect().top; // IE и Edge: не поддерживают x/y. можно использовать top/left, т.к. это всегда одно и то же при положительных width/height.
    let top = (elementYposition + window.scrollY) - 90; // Number(parentBoxMarginTop.replace(/[^0-9]/g, '')
    scrollToY(top);
    if (burger.classList.contains('active') && menu.classList.contains('opened')) {
        burger.classList.toggle('active');
        menu.classList.toggle('opened');
    }
}

function scrollToY(top) {
    window.scrollTo({
        top,
        behavior: "smooth"
    });
}

function getElemPixelHeight(element) {
    return element.getBoundingClientRect().height + 'px';
}

function delegate(box, selector, eventName, handler) {
    box.addEventListener(eventName, function (e) {
        let elem = e.target.closest(selector);
        if (elem !== null && box.contains(elem)) {
            handler.call(elem, e);
        }
    });
}

let sendContact = () => {
    let nameField = document.querySelector('#name').value;
    let regular = /^\+375\d{2}\d{7}/;
    let phoneField = document.querySelector('#phone').value;

    if (nameField.trim().length > 1 && nameField.trim().length < 25) {
        if (phoneField.trim().length !== 0 && regular.test(phoneField) && phoneField.length === 13) {
            const TOKEN = '6113579328:AAHZY13MenQYfRSkaqM901gzdN7DHpTgHrI';
            const CHAT_ID = '-1001829262127';
            const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
            let orderMessage = `
            <b>Имя:</b>     ${nameField}

            <a href="tel:${phoneField}">${phoneField}</a>
            `;
            axios.post(URL_API, {
                chat_id: CHAT_ID,
                parse_mode: 'html',
                text: orderMessage,
            })
                .then((res) => {
                    form.innerHTML = `
            <p class="formSent">Заявка отправлена! В ближайшее время с Вами свяжутся.</p>
            `;
                    localStorage.setItem("contactIsSent", JSON.stringify(true));
                    localStorage.setItem("time", JSON.stringify(new Date().getTime()));
                })
                .catch((err) => {
                    console.warn(err);
                })
                .finally(() => {
                    console.log('Готово!');
                });
        } else {
            window.alert('Проверьте, верно ли введён номер');
        }
        return;
    } else {
        window.alert('Проверьте, верно ли введёно имя');
    }
};

function atTopPosition() {
    if (window.scrollY > 10) {
        menu.classList.remove("AtTop");
    } else {
        menu.classList.add("AtTop");
    }
}