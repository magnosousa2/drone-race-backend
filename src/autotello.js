const Tello = require('./tello.js');
const Express = require('express');

const server = Express();

const drone = new Tello();

const IP_SERVER = '127.0.0.1';
const PORT_SERVER = '8080';

server.use(Express.json());

server.listen(PORT_SERVER, IP_SERVER, () => {
    console.log('Servidor local conectado')
})

/**
 * Endpoint que será consumido pela a api criada pelos alunos. 
 * Ela deverá receber o array de comandos da rota no corpo da requisição POST
 */
server.post('/executar-rota', (req, res) => {
    const rota = req.body;
    console.log(req.body)

    drone.connect();
    console.log('Conectou');

    console.log(rota)
    executar(rota, 0);

    console.log('Finalizou')

    return res.send(rota);
});




async function executar(comandos, index) {
    await executarComandosRecursivo(comandos, index);
}

async function executarComandosRecursivo(comandos, index) {
    if (index < comandos.length) {
        await executarComando(comandos[index]);
        await executarComandosRecursivo(comandos, index + 1);
    }
}

async function executarComando(comando) {
    await drone.sendCmd(comando.comando)
        .then(() => {
            console.log('SUCESSO NO COMANDO', comando.comando);
        })
        .catch(async error => {
            console.error('ERRO NO COMANDO ', comando.comando, '. Erro: ', error);
            await executarComando(comando);
        });
    console.log('DELAY: ', comando.tempoDuracaoComando)
    await drone.wait(comando.tempoDuracaoComando);
}








