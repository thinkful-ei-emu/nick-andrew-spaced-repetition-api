const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');
const SpacedRepetition = require('../utils/spaced-repetition');

const languageRouter = express.Router();

const missingGuessError = {
  error: 'Missing \'guess\' in request body',
};

languageRouter
  .use(requireAuth)

  .use(async (req, res, next) => {
    try {
      /**
       * use the user id to get language from db
       */
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      );

      if (!language)
        return res.status(404).json({
          error: 'You don\'t have any languages',
        });

      req.language = language;
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/', async (req, res, next) => {
    try {
      /**
       * use language id to get words
       */
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );

      res.json({
        language: req.language,
        words,
      });
      next();
    } catch (error) {
      next(error);
    }
  });

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      );

      if (!words || !words.length) {
        return res.status(400).json({ error: 'No words were found' });
      }

      const headWord = words.find(word => word.id === req.language.head);

      const head = {
        nextWord: headWord.original,
        totalScore: req.language.total_score,
        wordCorrectCount: headWord.correct_count,
        wordIncorrectCount: headWord.incorrect_count
      };

      res.json(head);
    }
    catch (e) {
      next(e);
    }
  });

languageRouter
  .use(express.json())
  .post('/guess', async (req, res, next) => {
    const db = req.app.get('db');
    try {
      const { guess, isCorrect } = req.body;
      if (!guess) return res.status(400).json(missingGuessError);

      const words = await LanguageService.getLanguageWords(
        db,
        req.language.id
      );

      const spacedRepetition = new SpacedRepetition(words, req.language.head);

      let { newHead, prevWord, newWord } = spacedRepetition.guess(isCorrect);

      const updatePrevWord = LanguageService.updateLanguageWord(
        db,
        prevWord
      );
      const updateNewWord = LanguageService.updateLanguageWord(
        db,
        newWord
      );
      const updateLanguageHead = LanguageService.setUsersLanguageHead(
        db,
        req.user.id,
        newHead
      );
      await Promise.all([
        updatePrevWord,
        updateNewWord,
        updateLanguageHead
      ]);

      res.json({
        nextWord: spacedRepetition.peek().original,
        totalScore: spacedRepetition.totalScore(),
        wordCorrectCount: newWord.correct_count,
        wordIncorrectCount: newWord.incorrect_count,
        answer: newWord.translation,
        isCorrect
      });
    }
    catch (e) {
      next(e);
    }
  });

module.exports = languageRouter;
