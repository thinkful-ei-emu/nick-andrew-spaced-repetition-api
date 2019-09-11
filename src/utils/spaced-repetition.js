const LinkedList = require('./linked-list');

class SpacedRepetition {
  constructor(words, headWordId) {
    this.words = new LinkedList();

    this.orderedInsert(words, headWordId);
    // this.buildList(words);
  }

  peek() {
    return this.words.head.value;
  }

  totalScore() {
    let currNode = this.words.head;
    let totalScore = 0;
    while (currNode !== null) {
      totalScore += currNode.value.correct_count;
      currNode = currNode.next;
    }
    return totalScore;
  }

  buildList(words) {
    for (let word of words) {
      console.log('building list', word.original);
      this.weightedInsert(word, word.memory_value);
    }
  }

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

  weightedInsert(word, weight) {
    let prevNode = this.words.head;
    let currNode = this.words.head;

    if (!currNode) this.words.insert(word);

    let i = 0;
    while (currNode !== null) {
      // console.log('inserting', word.original);
      if (currNode.next === null) {
        // console.log('end');
        currNode.value.next = word.id;
        word.next = null;
        this.words.insert(word);
        return {
          prevWord: currNode.value,
          newWord: word
        };
        // break;
      }
      if (weight < currNode.next.value.memory_value) {
        // console.log('weight');
        prevNode.value.next = word.id;
        word.next = currNode.next.value.id;
        this.words.insertAt(word, i);
        return {
          prevWord: prevNode.value,
          newWord: word
        };
      }
      // console.log(currNode.value.original);
      prevNode = currNode;
      currNode = currNode.next;
      i++;
    }
  }

  guess(result) {
    const currWord = this.words.pop();
    const newHead = currWord.next;
    // const newHead = currWord.value.next;
    if (currWord === null) return null;
    else {
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