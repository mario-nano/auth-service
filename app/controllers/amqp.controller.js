const { Connection } = require('amqplib-as-promised');
const moment = require("moment");

class AmqpController {
    async connect() {
        try {
            const amqpServer = process.env.AMQP_URL || 'amqp://rabbitmq:Component15@rabbitmq.e-nomads.com';
            const connection = new Connection(amqpServer);
            await connection.init();
            this.channel = await connection.createChannel();
            console.log("Rabbit connected");
        } catch (error) {
            console.log(error);
        }
    }

    async publish({ queue, type, message, user }) {
        try {
            const payload = { message: message, generatedIn: moment().toDate() }
            await this.channel.assertQueue(queue);
            await this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(payload)),
                {
                    persistent: true,
                    contentType: "application/json"
                }
            );
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new AmqpController();
