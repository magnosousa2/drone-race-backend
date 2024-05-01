const Tello = require('./tello.js');
const Express = require('express');
const config = require('./config/config.js')
const server = Express();

const drone = new Tello();

server.use(Express.json());

server.listen(config.portaServidorAPI, config.ipServidorAPI, () => {
    console.log(`Servidor local conectado em ${config.ipServidorAPI}:${config.portaServidorAPI}` )
    drone.connect();
})

/**
 * Endpoint que será consumido pela a api criada pelos alunos. 
 * Ela deverá receber o array de comandos da rota no corpo da requisição POST
 */
server.post('/executar-rota', (req, res) => {
    const rota = req.body;
    console.log(req.body)

    console.log(rota)
    executar(rota, 0);

    return res.send(rota);
});


/**
 * 
 * @param {*} comandos 
 * @param {*} index 
 * As 3 função abaixo utilizam recursividade para iterar sob o array de objetos 
 * que contém os comandos da rota. 
 * Essa recursividade é necssária para utilizar as chamadas de forma síncrona,
 * executando os comandos apenas após finalizado o timeout correspondente a
 * cada comando anterior.
 */

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








