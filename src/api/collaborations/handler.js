const ClientError = require('../../exceptions/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this.collaborationsService = collaborationsService;
    this.notesService = notesService;
    this.vldtr = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this.vldtr.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this.notesService.verifyNoteOwner(noteId, credentialId);
      const collaborationId = await this.collaborationsService.addCollaboration(noteId, userId);

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId,
        },
      });

      response.code(201);
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

  async deleteCollaborationHandler(request, h) {
    try {
      this.vldtr.validateCollaborationPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { noteId, userId } = request.payload;

      await this.notesService.verifyNoteOwner(noteId, credentialId);
      await this.collaborationsService.deleteCollaboration(noteId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
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

module.exports = CollaborationsHandler;
