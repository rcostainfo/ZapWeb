/// <reference path="../lib/signalr/dist/browser/signalr.min.js" />
/* Conexão e Reconexão com o SignalR - Hub */
var connection = new signalR.HubConnectionBuilder().withUrl("/ZapWebHub").build();

connection.onclose(async () => { await ConnectionStart(); });

ConnectionStart();

function ConnectionStart() {
    connection.start().then(() => {
        HabilitarCadastro();
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

            connection.invoke("Cadastrar", usuario).then(() => { console.info("Cadastrado com sucesso!"); })
                .catch((err) => { console.error(err.toString()); });
        });

        connection.invoke("Teste").then((str) => { console.info(str); })
            .catch((err) => { console.error(err.toString()); });

    }

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