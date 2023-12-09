const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, validator) {
    this.svc = service;
    this.vldtr = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    try {
      this.vldtr.validateExportNotesPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { targetEmail } = request.payload;

      const message = {
        userId: credentialId,
        targetEmail,
      };

      await this.svc.sendMessage('export:notes', JSON.stringify(message));

      const response = h
        .response({
          status: 'success',
          message: 'Permintaan Anda dalam antrean',
        })
        .code(201);

      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });

        response.code(err.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      response.code(500);
      console.error(err);
      return response;
    }
  }
}

module.exports = ExportsHandler;
