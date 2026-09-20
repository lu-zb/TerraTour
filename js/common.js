const $ = selector => document.querySelector(selector);

const USERS_KEY = "terra-tour:users";
const USER_KEY = "terra-tour:user";

let authMode = "login";

function readStorage(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
    return readStorage(USERS_KEY, []);
}

function getCurrentUser() {
    return readStorage(USER_KEY, null);
}

function renderUser() {
    const user = getCurrentUser();

    $("#login-button").hidden = Boolean(user);
    $("#register-button").hidden = Boolean(user);
    $("#profile-button").hidden = !user;
    $("#profile-button").textContent = user ? `我的：${user.name}` : "我的";
}

function openAuth(mode) {
    setMenuOpen(false);
    const user = getCurrentUser();

    authMode = mode;
    $("#auth-form").reset();
    $("#auth-tabs").hidden = mode === "profile";
    $("#name-group").hidden = mode === "login";
    $("#password-group").hidden = mode === "profile";
    $("#profile-actions").hidden = mode !== "profile";

    $("#auth-name").required = mode !== "login";
    $("#auth-password").required = mode !== "profile";

    const titles = {
        login: "登录",
        register: "注册",
        profile: "我的资料"
    };

    const buttons = {
        login: "登录",
        register: "创建账号",
        profile: "保存资料"
    };

    $("#auth-title").textContent = titles[mode];
    $("#auth-submit").textContent = buttons[mode];

    document.querySelectorAll("[data-mode]").forEach(tab => {
        tab.classList.toggle("is-active", tab.dataset.mode === mode);
    });

    if (mode === "profile" && user) {
        $("#auth-name").value = user.name;
        $("#auth-email").value = user.email;
    }

    $("#auth-dialog").showModal();
}

function register(name, email, password) {
    const users = getUsers();

    if (users.some(user => user.email === email)) {
        alert("这个邮箱已经注册");
        return false;
    }

    const user = {
        id: String(Date.now()),
        name,
        email,
        password
    };

    users.push(user);
    writeStorage(USERS_KEY, users);
    writeStorage(USER_KEY, user);

    return true;
}

function login(email, password) {
    const user = getUsers().find(item => {
        return item.email === email && item.password === password;
    });

    if (!user) {
        alert("邮箱或密码不正确");
        return false;
    }

    writeStorage(USER_KEY, user);
    return true;
}

function updateProfile(name, email) {
    const currentUser = getCurrentUser();
    const users = getUsers();

    const emailUsed = users.some(user => {
        return user.email === email && user.id !== currentUser.id;
    });

    if (emailUsed) {
        alert("这个邮箱已经被使用");
        return false;
    }

    const userIndex = users.findIndex(user => {
        return user.id === currentUser.id;
    });

    users[userIndex].name = name;
    users[userIndex].email = email;

    writeStorage(USERS_KEY, users);
    writeStorage(USER_KEY, users[userIndex]);

    return true;
}

function handleSubmit(event) {
    event.preventDefault();

    const name = $("#auth-name").value.trim();
    const email = $("#auth-email").value.trim().toLowerCase();
    const password = $("#auth-password").value;

    let success;

    if (authMode === "register") {
        success = register(name, email, password);
    } else if (authMode === "login") {
        success = login(email, password);
    } else {
        success = updateProfile(name, email);
    }

    if (success) {
        $("#auth-dialog").close();
        renderUser();
        alert(authMode === "profile" ? "资料已保存" : "操作成功");
    }
}

function logout() {
    if (!confirm("确定退出登录吗？")) return;

    localStorage.removeItem(USER_KEY);
    $("#auth-dialog").close();
    renderUser();
}

function deleteAccount() {
    const currentUser = getCurrentUser();

    if (!confirm("账号删除后无法恢复，确定删除吗？")) return;

    const users = getUsers().filter(user => {
        return user.id !== currentUser.id;
    });

    writeStorage(USERS_KEY, users);
    localStorage.removeItem(USER_KEY);

    $("#auth-dialog").close();
    renderUser();
}

$("#login-button").addEventListener("click", () => openAuth("login"));
$("#register-button").addEventListener("click", () => openAuth("register"));
$("#profile-button").addEventListener("click", () => openAuth("profile"));
$("#auth-close").addEventListener("click", () => $("#auth-dialog").close());
$("#auth-form").addEventListener("submit", handleSubmit);
$("#logout-button").addEventListener("click", logout);
$("#delete-button").addEventListener("click", deleteAccount);

document.querySelectorAll("[data-mode]").forEach(tab => {
    tab.addEventListener("click", () => openAuth(tab.dataset.mode));
});

renderUser();

// 复用同一套导航；窄屏时将列表放到按钮后，保持键盘访问顺序。
const menuButton = document.querySelector(".menu-toggle");
const mainMenu = document.querySelector("#main-menu");
const topNav = document.querySelector(".top-nav");
const narrowNavigation = window.matchMedia("(max-width: 1023px)");

function setMenuOpen(open, returnFocus = false) {
    const expanded = open && narrowNavigation.matches;
    mainMenu.classList.toggle("is-open", expanded);
    menuButton.setAttribute("aria-expanded", String(expanded));
    menuButton.setAttribute("aria-label", expanded ? "关闭菜单" : "打开菜单");
    if (returnFocus) menuButton.focus();
}

function updateMenuLayout() {
    setMenuOpen(false);
    if (narrowNavigation.matches) {
        topNav.append(mainMenu);
    } else {
        topNav.insertBefore(mainMenu, document.querySelector(".auth-actions"));
    }
}

menuButton.addEventListener("click", () => {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});
mainMenu.addEventListener("click", event => {
    if (event.target.closest("a")) setMenuOpen(false, narrowNavigation.matches);
});
document.addEventListener("click", event => {
    if (!topNav.contains(event.target)) setMenuOpen(false);
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mainMenu.classList.contains("is-open")) {
        setMenuOpen(false, true);
    }
});
topNav.addEventListener("focusout", event => {
    if (!topNav.contains(event.relatedTarget)) setMenuOpen(false);
});
narrowNavigation.addEventListener("change", updateMenuLayout);
window.addEventListener("pageshow", () => setMenuOpen(false));
updateMenuLayout();
