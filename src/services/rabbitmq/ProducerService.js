const amqp = require('amqplib');

const ProducerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

    // Berikan jeda waktu 1 detik sebelum menutup koneksi RabbitMQ agar pesan terkirim ke RabbitMQ
    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = ProducerService;
