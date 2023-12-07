const { nanoid } = require('nanoid');

class NotesService {
  constructor() {
    this.items = [];
  }

  async add({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title,
      body,
      tags,
      id,
      createdAt,
      updatedAt,
    };

    this.items.push(newNote);

    const isSuccess = this.items.filter((item) => item.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Catatan gagal ditambahkan');
    }

    return id;
  }

  async getAll() {
    return this.items;
  }

  async getById(id) {
    const note = this.items.filter((item) => item.id === id)[0];

    if (!note) {
      throw new Error('Catatan tidak ditemukan');
    }

    return note;
  }

  editById(id, { title, body, tags }) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this.items[index] = {
      ...this.items[index],
      title,
      body,
      tags,
      updatedAt,
    };
  }

  deleteById(id) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('Catatan gagal dihapus. Id tidak ditemukan');
    }

    this.items.splice(index, 1);
  }
}

module.exports = NotesService;
