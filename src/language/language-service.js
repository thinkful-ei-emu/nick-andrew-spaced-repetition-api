const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id });
  },
  updateLanguageWord(db, updatedWord) {
    return db.transaction(async trx => {
      await trx('word')
        .where('id', updatedWord.id)
        .update({
          ...updatedWord
        });
    });
  },
  setUsersLanguageHead(db, user_id, word_id) {
    return db.transaction(async trx => {
      await trx('language')
        .where({ user_id })
        .update({ head: word_id });
    });
  }
};

module.exports = LanguageService;
