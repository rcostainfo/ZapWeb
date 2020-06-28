/// <reference path="../lib/signalr/dist/browser/signalr.min.js" />
/* Conexão e Reconexão com o SignalR - Hub */
var connection = new signalR.HubConnectionBuilder().withUrl("/ZapWebHub").build();

connection.onclose(async () => { await ConnectionStart(); });

ConnectionStart();

function ConnectionStart() {
    connection.start().then(() => {
        HabilitarCadastro();
        HabilitarLogin();
        HabilitarConversacao();
        console.info("Connected!");
    }).catch((err) => {
        console.error(err.toString());
        setTimeout(ConnectionStart, 5000);
    });
}
function HabilitarCadastro() {
    var formCadastro = document.getElementById("form-cadastro");
    if (formCadastro != null) {
        var btnCadastrar = document.getElementById("btnCadastrar");

        btnCadastrar.addEventListener("click", () => {
            var nome = document.getElementById("nome").value;
            var email = document.getElementById("email").value;
            var senha = document.getElementById("senha").value;

            var usuario = { Nome: nome, Email: email, Senha: senha };

            connection.invoke("Cadastrar", usuario)
                .then(() => { console.info("Cadastrado com sucesso!"); })
                .catch((err) => { console.error(err.toString()); });
        });

        connection.on("ReceberCadastro", (sucesso, usuario, msg) => {
            var mensagem = document.getElementById("mensagem");
            if (sucesso) {
                console.info(usuario);

                document.getElementById("nome").value = "";
                document.getElementById("email").value = "";
                document.getElementById("senha").value = "";
            }

            mensagem.innerText = msg;
        });
    }
}
function HabilitarLogin() {
    var formLogin = document.getElementById("form-login");
    if (formLogin != null) {
        if (GetUsuarioLogado() != null) {
            window.location.href = "/Home/Conversacao";
        }

        var btnAcessar = document.getElementById("btnAcessar");

        btnAcessar.addEventListener("click", () => {
            var email = document.getElementById("email").value;
            var senha = document.getElementById("senha").value;

            var usuario = { Email: email, Senha: senha };

            connection.invoke("Login", usuario)
                .then(() => { console.info("Login com sucesso!"); })
                .catch((err) => { console.error(err.toString()); });
        });

        connection.on("ReceberLogin", (sucesso, usuario, msg) => {
            if (sucesso) {
                SetUsuarioLogado(usuario);
                window.location.href = "/Home/Conversacao";
            }
            else {
                var mensagem = document.getElementById("mensagem");
                mensagem.innerText = msg;
            }
        });
    }
}
function GetUsuarioLogado() {
    return JSON.parse(sessionStorage.getItem("Logado"));
}
function SetUsuarioLogado(usuario) {
    sessionStorage.setItem("Logado", JSON.stringify(usuario));
}
function DelUsuarioLogado() {
    sessionStorage.removeItem("Logado");
}

function HabilitarConversacao() {
    MonitorarConnectionID();
    MonitorarListaUsuarios();
}

function MonitorarListaUsuarios() {
    connection.invoke("ObterListaUsuarios");
    connection.on("ReceberListaUsuarios", (usuarios) => {
        var html = "";
        for (i = 0; i < usuarios.length; i++) {
            if (usuarios[i].id != GetUsuarioLogado().id) {
                html += '<div class="container-user-item"><img src="/imagem/logo.png" style="width: 20%;" /><div>' +
                    '<span>' + usuarios[i].nome.split(" ")[0] + ' (' + (usuarios[i].isOnline ? "online" : "offline") + ')</span><br />' +
                    '<span class="email">' + usuarios[i].email + '</span></div></div>';
            }
        }

        document.getElementById("users").innerHTML = html;

        var container = document.getElementById("users").querySelectorAll(".container-user-item");
        for (i = 0; i < container.length; i++) {
            container[i].addEventListener("click", (evt) => {
                var componente = evt.target || evt.srcElement;
                var emailUserUm = GetUsuarioLogado().email;
                var emailUserDois = componente.parentElement.querySelector(".email").innerText;

                connection.invoke("CriarOuAbrirGrupo", emailUserUm, emailUserDois);
            });
        }
    });
}
function MonitorarConnectionID() {
    var telaConversacao = document.getElementById("tela-conversacao");
    if (telaConversacao != null) {
        if (GetUsuarioLogado() == null) {
            window.location.href = "/Home/Login";
        }

        connection.invoke("AddConnectionIdDoUsuario", GetUsuarioLogado());

        var btnSair = document.getElementById("btnSair");
        btnSair.addEventListener("click", () => {
            connection.invoke("Logout", GetUsuarioLogado()).then(() => {
                DelUsuarioLogado();
                window.location.href = "/Home/Login";
            });
        });



    }
}