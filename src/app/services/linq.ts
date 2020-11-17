export module Linq {
  Array.prototype.firstOrDefault = function <T>(predicate: predicate<T>) {
    return this.reduce((accumulator: T, currentValue: T) => {
      if (!accumulator && predicate(currentValue))
        accumulator = currentValue;

      return accumulator;
    }, null);
  }
}
