export class List<T> implements Iterable<T> {
    protected _items: T[];

    [Symbol.iterator]() {
        let pointer = 0;
        let items = this._items;
        return {
            next(): IteratorResult<T> {
                return (pointer < items.length)
                    ? { done: false, value: items[pointer++] }
                    : { done: true, value: null };
            }
        }
    }

    constructor(items?: T[]) {
        this._items = (items) ? items : new Array<T>();
    }

    //Create
    public Add(...items: T[]) {
        this._items.push(...items);
    }
    public AddList(list: List<T>) {
        this._items = this._items.concat(list._items);
    }
    //Read
    public Count(selector?: (item: T) => boolean) {
        return (selector)
            ? this._items.filter(selector).length
            : this._items.length;
    }
    public FirstOrDefault(selector?: (item: T) => boolean) {
        return (selector)
            ? this._items.find(selector)
            : (this._items.length > 0) ? this._items[0] : undefined;
    }
    public Where(selector: (item: T) => boolean) {
        return new List<T>(this._items.filter(selector));
    }
    public SingleOrDefault(selector: (item: T) => boolean) {
        return this._items.find(selector);
    }
    public Single(selector: (item: T) => boolean) {
        let i = this.SingleOrDefault(selector);
        if (!i) throw { message: 'There is not match item!' };
        return i;
    }
    public TrueForAll(selector: (item: T) => boolean) {
        return this._items.every(selector);
    }
    public Contains(item: T) {
        return this._items.indexOf(item) >= 0;
    }
    //Delete
    public Clear() {
        this._items.splice(0);
    }
    public Remove(item: T): void {
        let index = this._items.indexOf(item);
        if (index >= 0) this._items.splice(index, 1);
    }
    //Transform
    public ToArray() { return this._items; }
    public Map<R>(mapper: (item: T) => R) {
        return new List(this._items.map(i => mapper(i)));
    }
    public ForEach(action: (item: T) => void) {
        this._items.forEach(i => action(i));
    }
    public OrderBy(selector: (item: T) => any) {
        return new List(this._items.sort((a: T, b: T) => {
            let l = selector(a);
            let r = selector(b)
            if (l > r) return 1;
            if (l < r) return -1;
            return 0;
        }));
    }
    public OrderByDescending(selector: (item: T) => any) {
        return new List(this._items.sort((a: T, b: T) => {
            let l = selector(a);
            let r = selector(b)
            if (l < r) return 1;
            if (l > r) return -1;
            return 0;
        }));
    }
    public GroupBy<K, R>(keySelector: (item: T) => K,
        resultSelector: (key: K, group: List<T>) => R) {
        let groups = new Map<string, List<T>>();
        this._items.forEach(item => {
            let key = JSON.stringify(keySelector(item));
            let group = groups.get(key);
            if (!group) {
                group = new List<T>();
                groups.set(key, group);
            }
            group.Add(item);
        });
        let result = new List<R>();
        groups.forEach((group, key) =>
            result.Add(resultSelector(JSON.parse(key), group)));
        return result;
    }
    public Concat(list: List<T>) {
        return new List<T>(this._items.concat(list._items));
    }
}