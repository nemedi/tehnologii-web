function RangeIterator(start = 1, stop = Infinity, step = 1) {
    const iterator = {
      [Symbol.iterator]() {
        let next = start;
        let count = 0;
        return {
          next() {
            let item;
            if (next < stop) {
              item = {value: next, done: false};
              next += step;
              count++;
              return item;
            }
            return {value: count, done: true};
          }
        };
      }
    };
    return iterator;
}