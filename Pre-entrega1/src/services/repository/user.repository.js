export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () => {
        return this.dao.getAll();
    }
    save = (user) => {
        return this.dao.save(user);
    }
    update = (id, user) => {
        return this.dao.update(id, user);
    }
    findByUsername = async (username) => {
        return this.dao.findByUsername(username);
    };
};