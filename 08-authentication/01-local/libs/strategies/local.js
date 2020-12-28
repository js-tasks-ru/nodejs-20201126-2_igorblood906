const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
  { usernameField: 'email', session: false },
  async function (email, password, done) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Нет такого пользователя');
      }
      const correctPass = await user.checkPassword(password);
      if (!correctPass) {
        throw new Error('Неверный пароль');
      }
      done(null, user);
    } catch (error) {
      done(null, false, error.message);
    }
  }
);
