const LinkedList = require('./linked-list');

class SpacedRepetition {
  constructor(words, headWordId) {
    this.words = new LinkedList();

    this.orderedInsert(words, headWordId);
  }

  /**
   * return the head word
   */
  peek() {
    return this.words.head.value;
  }

  /**
   * return sum of correct_counts of all words in the linked list
   */
  totalScore() {
    let currNode = this.words.head;
    let totalScore = 0;
    while (currNode !== null) {
      totalScore += currNode.value.correct_count;
      currNode = currNode.next;
    }
    return totalScore;
  }

  // buildList(words) {
  //   for (let word of words) {
  //     console.log('building list', word.original);
  //     this.weightedInsert(word, word.memory_value);
  //   }
  // }

  /**
   * Insert words from the given array based on headWordId
   * and subsequent next id's for each word until null is reached
   * 
   * could probably be optimized
   * 
   * @param {array} wordsArray 
   * @param {number} headWordId 
   */
  orderedInsert(wordsArray, headWordId) {
    const headWord = wordsArray.find(word => word.id === headWordId);
    this.words.insert(headWord);
    let currNode = this.words.head;

    while (currNode.value.next !== null) {
      let nextWord = wordsArray.find(word => word.id === currNode.value.next);
      this.words.insert(nextWord);
      currNode = currNode.next;
    }
  }

  /**
   * Inserts word object into words linked list at 
   * weight-determined index
   * 
   * @param {object} word 
   * @param {number} weight 
   */
  weightedInsert(word, weight) {
    let currNode = this.words.head;

    if (!currNode) this.words.insert(word);

    let i = 1;
    while (currNode !== null && i <= weight) {
      /**
       * insert into end of linked list if end of linked list
       * is reached
       */
      if (currNode.next === null) {
        currNode.value.next = word.id;
        word.next = null;
        this.words.insert(word);
        return {
          prevWord: currNode.value,
          newWord: word
        };
      }
      if (i === weight) {
        // set current word's next value to new word's id
        currNode.value.next = word.id;

        // set new word's id to next node's word's id
        word.next = currNode.next.value.id;
        this.words.insertAt(word, i);
        return {
          prevWord: currNode.value,
          newWord: word
        };
      }

      currNode = currNode.next;
      i++;
    }
  }

  /**
   * Handles guesses received from the client
   * 
   * @param {boolean} result 
   */
  guess(result) {
    const currWord = this.words.pop();
    const newHead = currWord.next;
    if (currWord === null) return null;
    else {
      /**
       * increment correct counter if result is correct
       * increment incorrect counter if result is incorrect
       * 
       * double memory_value (weight) if result is correct
       * set memory_value (weight) to 1 if result is incorrect
       */
      result ? currWord.correct_count++ : currWord.incorrect_count++;
      currWord.memory_value = result ? currWord.memory_value * 2 : 1;

      return {
        newHead,
        ...this.weightedInsert(currWord, currWord.memory_value)
      };
    }
  }
}

module.exports = SpacedRepetition;