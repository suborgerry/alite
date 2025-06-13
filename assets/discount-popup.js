document.addEventListener("DOMContentLoaded", (function () {
    const t = document.getElementById("discount-popup");
    if(!t) return;
    const n = document.getElementById("popup-discount-btn"),
        e = t.querySelector(".popup-discount-text"),
        o = (e.querySelector("svg"), document.createElement("span"));
    e.appendChild(o);
    let s = null,
        c = 0,
        i = !1;

    function a() {
        i || (t.classList.add("show-pop"), s && clearTimeout(s), s = setTimeout((() => {
            r()
        }), 5e3))
    }

    function r() {
        t.classList.remove("show-pop"), s && clearTimeout(s)
    }

    function u(t) {
        let n = 0,
            e = 0,
            s = 0;
        if (t < 4) {
            n = 4, s = 10;
            const e = n - t;
            return void(o.innerHTML = `\n        <span>${e} stickers left to get <span style="color:#CE3040;font-weight:600;">${s}% OFF</span></span>\n      `)
        }
        if (t < 6) e = 10, n = 6, s = 20;
        else {
            if (!(t < 10)) return e = 30, void(o.innerHTML = `\n        <strong style="margin-right: 10px;">–${e}% OFF</strong>\n        <span>Maximum discount <span style="color:#CE3040;font-weight:600;">30% OFF</span> reached!</span>\n      `);
            e = 20, n = 10, s = 30
        }
        const c = n - t;
        o.innerHTML = `\n      <strong style="margin-right: 10px;">–${e}% OFF</strong>\n      <span>${c} stickers left to get <span style="color:#CE3040;font-weight:600;">${s}% OFF</span></span>\n    `
    }
    async function d() {
        const t = await async function () {
            try {
                const t = await fetch("/cart.js"),
                    n = await t.json();
                let e = 0;
                return n.items.forEach((t => {
                    e += t.quantity
                })), e
            } catch (t) {
                return 0
            }
        }(), n = function (t) {
            return t < 4 ? 0 : t < 6 ? 10 : t < 10 ? 20 : 30
        }(t);
        n !== c ? (i = !1, u(t), r(), setTimeout((() => {
            a()
        }), 50)) : (i && (i = !1), u(t), a()), c = n
    }
    n.addEventListener("click", (function () {
        i = !0, r()
    })), document.addEventListener("submit", (function (t) {
        const n = t.target.closest('form[action^="/cart/add"]');
        if (n) {
            t.preventDefault();
            const e = new FormData(n);
            fetch("/cart/add.js", {
                method: "POST",
                body: e
            }).then((t => t.json())).then(d).catch((t => {}))
        }
    }), !0), document.querySelectorAll(".ts-product__button").forEach((t => {
        t.addEventListener("click", (function () {
            setTimeout(d, 700)
        }))
    }))
}));