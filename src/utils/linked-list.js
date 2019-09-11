class _Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  insert(value) {
    if (this.head === null) {
      this.head = new _Node(value);
      this.tail = this.head;
    }
    else {
      this.tail.next = new _Node(value);
      this.tail = this.tail.next;
    }
  }

  insertBefore(item, value) {
    let currNode = this.head;

    if (this.head === null) return;

    if (this.head.value === value) {
      this.head = new _Node(item, currNode);
    } else {
      while (currNode.next !== null) {
        if (currNode.next.value === value) {
          const newNode = new _Node(item, currNode.next);
          currNode.next = newNode;
          return;
        }

        currNode = currNode.next;
      }
    }
  }

  insertAfter(item, value) {
    let currNode = this.head;
    while (currNode !== null) {
      if (currNode.value === value) {
        currNode.next = new _Node(item, currNode.next);
        return;
      } else {
        currNode = currNode.next;
      }
    }
  }

  insertAt(value, index) {
    let currNode = this.head;
    if (index === 0) {
      this.insertBefore(value, currNode.value);
      return;
    }
    for (let i = 0; i < index - 1; i++) {
      if (currNode !== null) {
        // console.log(currNode.value);
        currNode = currNode.next;
      } else {
        console.log('Invalid Index');
        return;
      }
    }
    
    currNode.next = new _Node(value, currNode.next);
  }

  toArray() {
    let currNode = this.head;
    const arr = [];

    while(currNode !== null) {
      arr.push(currNode.value);
      currNode = currNode.next;
    }

    return arr;
  }

  pop() {
    if (this.head === null) return null;
    else {
      let currHead = this.head;
      this.head = this.head.next;
      return currHead.value;
    }
  }

  remove(node) {
    if (this.head === null) return null;

    if (this.head.id === node.id) {
      const removedValue = this.head;
      this.head = this.head.next;
      return removedValue;
    }
    else {
      let currNode = this.head;
      let prevNode = this.head;
      while (currNode !== null && currNode.value.id !== node.id) {
        prevNode = currNode;
        currNode = currNode.next;
      }

      if (currNode === null) return null;
      else prevNode.next = currNode.next;
    }
  }
}

module.exports = LinkedList;